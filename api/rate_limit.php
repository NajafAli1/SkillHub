<?php
// Pembatasan percobaan login sederhana, disimpan di file JSON (bukan tabel DB baru
// supaya tetap ringan). Dikunci per (IP + email) sehingga satu IP tidak mengunci
// akun lain yang kebetulan berbagi jaringan, tapi tetap menahan brute-force
// terhadap satu akun tertentu.

function login_rate_limit_path(): string
{
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . '/login_attempts.json';
}

function login_rate_limit_key(string $email): string
{
    return md5(($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|' . strtolower($email));
}

// Kembalikan sisa detik lockout kalau sedang dikunci, atau null kalau boleh mencoba.
function login_rate_limit_check(string $email): ?int
{
    $path = login_rate_limit_path();
    $fp = fopen($path, 'c+');
    if (!$fp) {
        return null;
    }

    flock($fp, LOCK_SH);
    $raw = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    $data = json_decode($raw ?: '{}', true) ?: [];
    $entry = $data[login_rate_limit_key($email)] ?? null;

    if ($entry && !empty($entry['locked_until']) && $entry['locked_until'] > time()) {
        return $entry['locked_until'] - time();
    }

    return null;
}

function login_rate_limit_record_failure(string $email): void
{
    $path = login_rate_limit_path();
    $fp = fopen($path, 'c+');
    if (!$fp) {
        return;
    }

    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '{}', true) ?: [];
    $key = login_rate_limit_key($email);
    $now = time();

    $entry = $data[$key] ?? ['count' => 0, 'window_start' => $now, 'locked_until' => 0];

    // Reset window kalau percobaan gagal pertama sudah lebih dari 15 menit lalu.
    if ($now - $entry['window_start'] > 900) {
        $entry = ['count' => 0, 'window_start' => $now, 'locked_until' => 0];
    }

    $entry['count']++;

    if ($entry['count'] >= 5) {
        // Lockout progresif: 60 detik dasar + 30 detik tiap kelebihan percobaan.
        $extra = ($entry['count'] - 5) * 30;
        $entry['locked_until'] = $now + 60 + $extra;
    }

    $data[$key] = $entry;

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

function login_rate_limit_reset(string $email): void
{
    $path = login_rate_limit_path();
    $fp = fopen($path, 'c+');
    if (!$fp) {
        return;
    }

    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '{}', true) ?: [];
    unset($data[login_rate_limit_key($email)]);

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}
