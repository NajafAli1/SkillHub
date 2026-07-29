<?php
require_once '../koneksi.php';

$id_client = intval($_POST['id_client'] ?? 0);
$judul     = trim($_POST['judul_pekerjaan'] ?? '');
$deskripsi = trim($_POST['deskripsi'] ?? '');

if (!$id_client || !$judul || !$deskripsi) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Semua field wajib diisi']);
    exit;
}

$stmt = mysqli_prepare($conn, "INSERT INTO pekerjaan (id_client, judul_pekerjaan, deskripsi, status_loker) VALUES (?, ?, ?, 'buka')");
mysqli_stmt_bind_param($stmt, 'iss', $id_client, $judul, $deskripsi);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['status' => 'sukses', 'pesan' => 'Pekerjaan berhasil diposting!']);
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Gagal memposting: ' . mysqli_error($conn)]);
}
?>
