<?php
require_once 'bootstrap.php';

$nama_lengkap = trim($_POST['nama_lengkap'] ?? '');
$email        = trim($_POST['email'] ?? '');
$password     = $_POST['password'] ?? '';
$role         = $_POST['role'] ?? '';

// Validasi input
if (!$nama_lengkap || !$email || !$password || !$role) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Semua kolom wajib diisi']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Format email tidak valid']);
    exit;
}

if (mb_strlen($nama_lengkap) > 150) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Nama maksimal 150 karakter']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Password minimal 6 karakter']);
    exit;
}

if (strlen($password) > 72) {
    // bcrypt hanya memproses 72 byte pertama — di atas itu sisanya diam-diam
    // diabaikan. Tolak eksplisit supaya user tidak salah kira seluruh passwordnya dipakai.
    echo json_encode(['status' => 'gagal', 'pesan' => 'Password maksimal 72 karakter']);
    exit;
}

if (!in_array($role, ['mahasiswa', 'client'], true)) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Role tidak valid']);
    exit;
}

try {
    // Cek email sudah terdaftar
    $stmtCek = mysqli_prepare($conn, "SELECT id_user FROM users WHERE email = ? LIMIT 1");
    mysqli_stmt_bind_param($stmtCek, 's', $email);
    mysqli_stmt_execute($stmtCek);
    mysqli_stmt_store_result($stmtCek);

    if (mysqli_stmt_num_rows($stmtCek) > 0) {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Email sudah terdaftar! Gunakan email lain.']);
        exit;
    }
    mysqli_stmt_close($stmtCek);

    // Hash password sebelum simpan
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = mysqli_prepare($conn, "INSERT INTO users (nama_lengkap, email, password, role) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, 'ssss', $nama_lengkap, $email, $hashedPassword, $role);
    mysqli_stmt_execute($stmt);

    echo json_encode(['status' => 'sukses', 'pesan' => 'Registrasi berhasil! Silakan login.']);
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() === 1062) {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Email sudah terdaftar! Gunakan email lain.']);
        exit;
    }
    db_error_response($e);
}
