<?php
require_once 'bootstrap.php';

$user         = require_login('mahasiswa');
$id_mahasiswa = $user['id_user'];

$id_pekerjaan  = intval($_POST['id_pekerjaan'] ?? 0);
$pesan_pelamar = trim($_POST['pesan_pelamar'] ?? '');

if (!$id_pekerjaan || !$pesan_pelamar) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Semua field wajib diisi']);
    exit;
}

if (mb_strlen($pesan_pelamar) > 2000) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Pesan lamaran maksimal 2000 karakter']);
    exit;
}

try {
    // Ambil id_client dari pekerjaan yang dilamar (kolom wajib di tabel lamaran)
    $stmtJob = mysqli_prepare($conn, "SELECT id_client FROM pekerjaan WHERE id_pekerjaan = ? AND status_loker = 'dibuka' LIMIT 1");
    mysqli_stmt_bind_param($stmtJob, 'i', $id_pekerjaan);
    mysqli_stmt_execute($stmtJob);
    $jobResult = mysqli_stmt_get_result($stmtJob);
    $job = mysqli_fetch_assoc($jobResult);

    if (!$job) {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Pekerjaan tidak ditemukan atau sudah ditutup']);
        exit;
    }
    $id_client = $job['id_client'];

    // Cek sudah pernah melamar pekerjaan yang sama
    $stmtCek = mysqli_prepare($conn, "SELECT id_lamaran FROM lamaran WHERE id_pekerjaan = ? AND id_mahasiswa = ? LIMIT 1");
    mysqli_stmt_bind_param($stmtCek, 'ii', $id_pekerjaan, $id_mahasiswa);
    mysqli_stmt_execute($stmtCek);
    mysqli_stmt_store_result($stmtCek);

    if (mysqli_stmt_num_rows($stmtCek) > 0) {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Kamu sudah pernah melamar pekerjaan ini']);
        exit;
    }
    mysqli_stmt_close($stmtCek);

    $stmt = mysqli_prepare($conn, "INSERT INTO lamaran (id_pekerjaan, id_mahasiswa, id_client, pesan_pelamar, status_lamaran) VALUES (?, ?, ?, ?, 'menunggu')");
    mysqli_stmt_bind_param($stmt, 'iiis', $id_pekerjaan, $id_mahasiswa, $id_client, $pesan_pelamar);
    mysqli_stmt_execute($stmt);

    echo json_encode(['status' => 'sukses', 'pesan' => 'Selamat! Lamaran berhasil dikirim.']);
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
