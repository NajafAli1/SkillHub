<?php
require_once 'bootstrap.php';

$user      = require_login('client');
$id_client = $user['id_user'];

try {
    $stmt = mysqli_prepare($conn,
        "SELECT l.id_lamaran, l.pesan_pelamar, l.status_lamaran,
                p.judul_pekerjaan,
                u.email AS email_pelamar, u.nama_lengkap AS nama_pelamar
         FROM lamaran l
         JOIN pekerjaan p ON l.id_pekerjaan = p.id_pekerjaan
         JOIN users u ON l.id_mahasiswa = u.id_user
         WHERE p.id_client = ?
         ORDER BY l.id_lamaran DESC"
    );
    mysqli_stmt_bind_param($stmt, 'i', $id_client);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $lamaran = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $lamaran[] = $row;
    }

    echo json_encode($lamaran);
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
