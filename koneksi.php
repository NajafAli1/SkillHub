<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host     = "localhost";
$username = "root";
$password = "";
$database = "skillhub";
$port     = 3306;

$conn = mysqli_connect($host, $username, $password, $database, $port);

if (!$conn) {
    http_response_code(500);
    echo json_encode(['status' => 'gagal', 'pesan' => 'Koneksi database gagal: ' . mysqli_connect_error()]);
    exit;
}

mysqli_set_charset($conn, 'utf8mb4');
?>
