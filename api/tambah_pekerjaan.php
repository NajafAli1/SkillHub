<?php
require_once 'bootstrap.php';

$user      = require_login('client');
$id_client = $user['id_user'];

$judul     = trim($_POST['judul_pekerjaan'] ?? '');
$deskripsi = trim($_POST['deskripsi'] ?? '');

if (!$judul || !$deskripsi) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Semua field wajib diisi']);
    exit;
}

if (mb_strlen($judul) > 200) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Judul pekerjaan maksimal 200 karakter']);
    exit;
}

if (mb_strlen($deskripsi) > 2000) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Deskripsi maksimal 2000 karakter']);
    exit;
}

try {
    $stmt = mysqli_prepare($conn, "INSERT INTO pekerjaan (id_client, judul_pekerjaan, deskripsi, status_loker) VALUES (?, ?, ?, 'dibuka')");
    mysqli_stmt_bind_param($stmt, 'iss', $id_client, $judul, $deskripsi);
    mysqli_stmt_execute($stmt);

    echo json_encode(['status' => 'sukses', 'pesan' => 'Pekerjaan berhasil diposting!']);
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
