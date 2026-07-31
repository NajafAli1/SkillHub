<?php
require_once 'bootstrap.php';

$user      = require_login('client');
$id_client = $user['id_user'];

$id_pekerjaan    = intval($_POST['id_pekerjaan'] ?? 0);
$judul_pekerjaan = trim($_POST['judul_pekerjaan'] ?? '');
$deskripsi       = trim($_POST['deskripsi'] ?? '');

if (!$id_pekerjaan || !$judul_pekerjaan || !$deskripsi) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak lengkap']);
    exit;
}

if (mb_strlen($judul_pekerjaan) > 200) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Judul pekerjaan maksimal 200 karakter']);
    exit;
}

if (mb_strlen($deskripsi) > 2000) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Deskripsi maksimal 2000 karakter']);
    exit;
}

try {
    // Pastikan pekerjaan milik client ini (cegah edit milik orang lain)
    $stmt = mysqli_prepare($conn, "UPDATE pekerjaan SET judul_pekerjaan = ?, deskripsi = ? WHERE id_pekerjaan = ? AND id_client = ?");
    mysqli_stmt_bind_param($stmt, 'ssii', $judul_pekerjaan, $deskripsi, $id_pekerjaan, $id_client);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['status' => 'sukses', 'pesan' => 'Pekerjaan berhasil diperbarui']);
    } else {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak ditemukan atau bukan milik Anda']);
    }
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
