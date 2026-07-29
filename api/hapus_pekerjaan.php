<?php
require_once '../koneksi.php';

$id_pekerjaan = intval($_POST['id_pekerjaan'] ?? 0);
$id_client    = intval($_POST['id_client'] ?? 0);

if (!$id_pekerjaan || !$id_client) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak lengkap']);
    exit;
}

// Pastikan pekerjaan milik client ini sebelum hapus
$stmt = mysqli_prepare($conn, "DELETE FROM pekerjaan WHERE id_pekerjaan = ? AND id_client = ?");
mysqli_stmt_bind_param($stmt, 'ii', $id_pekerjaan, $id_client);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['status' => 'sukses', 'pesan' => 'Pekerjaan berhasil dihapus']);
    } else {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak ditemukan atau bukan milik Anda']);
    }
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Gagal menghapus: ' . mysqli_error($conn)]);
}
?>
