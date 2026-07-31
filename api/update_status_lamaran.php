<?php
require_once 'bootstrap.php';

$user      = require_login('client');
$id_client = $user['id_user'];

$id_lamaran  = intval($_POST['id_lamaran'] ?? 0);
$status_baru = trim($_POST['status_baru'] ?? '');

if (!$id_lamaran) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'ID lamaran tidak valid']);
    exit;
}

// Validasi nilai status yang diperbolehkan
$statusValid = ['menunggu', 'diterima', 'ditolak'];
if (!in_array($status_baru, $statusValid, true)) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Status tidak valid']);
    exit;
}

try {
    // Pastikan lamaran ini milik pekerjaan yang diposting oleh client yang login
    $stmt = mysqli_prepare($conn,
        "UPDATE lamaran l
         JOIN pekerjaan p ON l.id_pekerjaan = p.id_pekerjaan
         SET l.status_lamaran = ?
         WHERE l.id_lamaran = ? AND p.id_client = ?"
    );
    mysqli_stmt_bind_param($stmt, 'sii', $status_baru, $id_lamaran, $id_client);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['status' => 'sukses', 'pesan' => "Status lamaran berhasil diupdate menjadi $status_baru!"]);
    } else {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Data tidak ditemukan atau bukan milik Anda']);
    }
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
