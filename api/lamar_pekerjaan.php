<?php
require_once '../koneksi.php';

$id_pekerjaan = intval($_POST['id_pekerjaan'] ?? 0);
$id_mahasiswa = intval($_POST['id_mahasiswa'] ?? 0);
$pesan_pelamar = trim($_POST['pesan_pelamar'] ?? '');

if (!$id_pekerjaan || !$id_mahasiswa || !$pesan_pelamar) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Semua field wajib diisi']);
    exit;
}

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

$stmt = mysqli_prepare($conn, "INSERT INTO lamaran (id_pekerjaan, id_mahasiswa, pesan_pelamar, status_lamaran) VALUES (?, ?, ?, 'menunggu')");
mysqli_stmt_bind_param($stmt, 'iis', $id_pekerjaan, $id_mahasiswa, $pesan_pelamar);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['status' => 'sukses', 'pesan' => 'Selamat! Lamaran berhasil dikirim.']);
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Gagal mengirim lamaran: ' . mysqli_error($conn)]);
}
?>
