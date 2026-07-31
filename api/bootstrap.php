<?php
// Bootstrap wajib untuk semua endpoint di folder api/.
// Menjamin response SELALU JSON valid meski terjadi fatal error di tengah request,
// dan menyediakan identitas user dari session (bukan dari input client yang bisa dipalsukan).

ob_start();
session_start();

header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', '0');

require_once __DIR__ . '/../koneksi.php';

// Proteksi CSRF sederhana: tolak request POST (aksi yang mengubah data) yang
// Origin/Referer-nya berasal dari host lain. Ini BUKAN proteksi CSRF token
// penuh — trade-off yang diambil untuk skala tugas kuliah/lokal ini:
// - Kalau browser mengirim header Origin/Referer (kasus normal di browser modern),
//   request lintas-origin akan ditolak.
// - Kalau header itu tidak ada sama sekali (curl/Postman/testing langsung),
//   request TETAP DILOLOSKAN, supaya endpoint masih bisa ditest manual.
//   Ini berarti proteksi ini tidak menahan tool yang sengaja tidak mengirim
//   Origin/Referer — untuk itu perlu CSRF token asli (di luar scope saat ini).
function check_same_origin(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        return;
    }

    $host   = $_SERVER['HTTP_HOST'] ?? '';
    $source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';

    if ($source === '' || $host === '') {
        return;
    }

    $sourceHost = parse_url($source, PHP_URL_HOST);
    $sourcePort = parse_url($source, PHP_URL_PORT);
    $sourceHostFull = $sourcePort ? "{$sourceHost}:{$sourcePort}" : $sourceHost;

    if ($sourceHostFull !== $host) {
        http_response_code(403);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Request ditolak: origin tidak valid.']);
        exit;
    }
}

check_same_origin();

register_shutdown_function(function () {
    $error = error_get_last();
    $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];

    if ($error && in_array($error['type'], $fatalTypes, true)) {
        if (ob_get_level() > 0) {
            ob_clean();
        }
        http_response_code(500);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Terjadi kesalahan pada server.']);
    }
});

function current_user(): ?array
{
    if (!isset($_SESSION['id_user'], $_SESSION['role'])) {
        return null;
    }

    return [
        'id_user'      => (int) $_SESSION['id_user'],
        'role'         => $_SESSION['role'],
        'nama_lengkap' => $_SESSION['nama_lengkap'] ?? '',
    ];
}

function require_login(?string $role = null): array
{
    $user = current_user();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Anda harus login terlebih dahulu.']);
        exit;
    }

    if ($role !== null && $user['role'] !== $role) {
        http_response_code(403);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Anda tidak memiliki akses untuk melakukan aksi ini.']);
        exit;
    }

    return $user;
}

function db_error_response(mysqli_sql_exception $e): void
{
    http_response_code(500);
    // TODO(go-live): $e->getMessage() membocorkan detail query/struktur tabel ke client.
    // Ini sengaja dibiarkan verbose untuk memudahkan debugging selama development lokal.
    // Sebelum deploy ke publik, ganti baris di bawah dengan pesan generik saja, dan
    // log detail asli via error_log($e->getMessage()) di server, bukan echo ke response.
    echo json_encode(['status' => 'gagal', 'pesan' => 'Terjadi kesalahan database: ' . $e->getMessage()]);
}
