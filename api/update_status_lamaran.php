<?php
require_once '../koneksi.php';

$id_lamaran = intval($_POST['id_lamaran'] ?? 0);
$status_baru = trim($_POST['status_baru'] ?? '');

if (!$id_lamaran) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'ID lamaran tidak valid']);
    exit;
}

// Validasi nilai status yang diperbolehkan
$statusValid = ['menunggu', 'diterima', 'ditolak'];
if (!in_array($status_baru, $statusValid)) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Status tidak valid']);
    exit;
}

$stmt = mysqli_prepare($conn, "UPDATE lamaran SET status_lamaran = ? WHERE id_lamaran = ?");
mysqli_stmt_bind_param($stmt, 'si', $status_baru, $id_lamaran);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['status' => 'sukses', 'pesan' => "Status lamaran berhasil diupdate menjadi $status_baru!"]);
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Gagal update status: ' . mysqli_error($conn)]);
}
?>
