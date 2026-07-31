<?php
require_once 'bootstrap.php';

$user         = require_login('mahasiswa');
$id_mahasiswa = $user['id_user'];

try {
    $stmt = mysqli_prepare($conn,
        "SELECT p.*, l.id_lamaran
         FROM pekerjaan p
         LEFT JOIN lamaran l ON p.id_pekerjaan = l.id_pekerjaan AND l.id_mahasiswa = ?
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
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
