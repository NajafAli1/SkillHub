<?php
require_once '../koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "gagal", "pesan" => "Metode request tidak valid."]);
    exit;
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["status" => "gagal", "pesan" => "Tidak ada file foto yang diupload atau terjadi kesalahan upload."]);
    exit;
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$maxSize = 2 * 1024 * 1024;
$fileType = $_FILES['foto']['type'];
$fileSize = $_FILES['foto']['size'];

if (!in_array($fileType, $allowedTypes, true)) {
    echo json_encode(["status" => "gagal", "pesan" => "Tipe file tidak diizinkan. Gunakan JPG, PNG, atau GIF."]);
    exit;
}

if ($fileSize > $maxSize) {
    echo json_encode(["status" => "gagal", "pesan" => "Ukuran file terlalu besar. Maksimal 2MB."]);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../uploads');
if ($uploadDir === false) {
    $uploadDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
}

$extension = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
$filename = uniqid('foto_', true) . '.' . $extension;
$destination = $uploadDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($_FILES['foto']['tmp_name'], $destination)) {
    echo json_encode(["status" => "gagal", "pesan" => "Gagal menyimpan file upload."]);
    exit;
}

$publicPath = 'uploads/' . $filename;

echo json_encode(["status" => "sukses", "pesan" => "Upload foto berhasil.", "filename" => $publicPath]);
?>