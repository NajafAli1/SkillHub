<?php
require_once '../koneksi.php';

$id_client = intval($_GET['id_client'] ?? 0);

if (!$id_client) {
    echo json_encode([]);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT * FROM pekerjaan WHERE id_client = ? ORDER BY id_pekerjaan DESC");
mysqli_stmt_bind_param($stmt, 'i', $id_client);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$pekerjaan = [];
while ($row = mysqli_fetch_assoc($result)) {
    $pekerjaan[] = $row;
}

echo json_encode($pekerjaan);
?>
