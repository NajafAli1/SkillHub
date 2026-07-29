<?php
require_once '../koneksi.php';

$id_mahasiswa = intval($_GET['id_mahasiswa'] ?? 0);

if (!$id_mahasiswa) {
    echo json_encode([]);
    exit;
}

$stmt = mysqli_prepare($conn,
    "SELECT l.id_lamaran, l.status_lamaran, l.pesan_pelamar, p.judul_pekerjaan
     FROM lamaran l
     JOIN pekerjaan p ON l.id_pekerjaan = p.id_pekerjaan
     WHERE l.id_mahasiswa = ?
     ORDER BY l.id_lamaran DESC"
);
mysqli_stmt_bind_param($stmt, 'i', $id_mahasiswa);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
