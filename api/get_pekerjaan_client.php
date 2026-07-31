<?php
require_once 'bootstrap.php';

$user      = require_login('client');
$id_client = $user['id_user'];

try {
    $stmt = mysqli_prepare($conn, "SELECT * FROM pekerjaan WHERE id_client = ? ORDER BY id_pekerjaan DESC");
    mysqli_stmt_bind_param($stmt, 'i', $id_client);
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
