<?php
require_once '../koneksi.php';

$id_pekerjaan    = intval($_POST['id_pekerjaan'] ?? 0);
$id_client       = intval($_POST['id_client'] ?? 0);
$judul_pekerjaan = trim($_POST['judul_pekerjaan'] ?? '');
$deskripsi       = trim($_POST['deskripsi'] ?? '');

if (!$id_pekerjaan || !$id_client || !$judul_pekerjaan || !$deskripsi) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak lengkap']);
    exit;
}

// Pastikan pekerjaan milik client ini (cegah edit milik orang lain)
$stmt = mysqli_prepare($conn, "UPDATE pekerjaan SET judul_pekerjaan = ?, deskripsi = ? WHERE id_pekerjaan = ? AND id_client = ?");
mysqli_stmt_bind_param($stmt, 'ssii', $judul_pekerjaan, $deskripsi, $id_pekerjaan, $id_client);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['status' => 'sukses', 'pesan' => 'Pekerjaan berhasil diperbarui']);
    } else {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak ditemukan atau bukan milik Anda']);
    }
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Gagal memperbarui: ' . mysqli_error($conn)]);
}
?>
