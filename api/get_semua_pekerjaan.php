<?php
require '../koneksi.php';

$id_mahasiswa = intval($_GET['id_mahasiswa'] ?? 0);

$stmt = mysqli_prepare($conn,
    "SELECT p.*, l.id_lamaran
     FROM pekerjaan p
     LEFT JOIN lamaran l ON p.id_pekerjaan = l.id_pekerjaan AND l.id_mahasiswa = ?
     WHERE p.status_loker = 'buka'
     ORDER BY p.id_pekerjaan DESC"
);
mysqli_stmt_bind_param($stmt, 'i', $id_mahasiswa);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$pekerjaan = [];
while ($row = mysqli_fetch_assoc($result)) {
    $pekerjaan[] = $row;
}

echo json_encode($pekerjaan);
?>
