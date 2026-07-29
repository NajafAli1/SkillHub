<?php
require_once '../koneksi.php';

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Email dan password wajib diisi']);
    exit;
}

// Prepared statement — cegah SQL injection
$stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE email = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);

    // Cek password — support plain text lama DAN bcrypt baru
    $passwordValid = false;
    if (password_get_info($user['password'])['algo'] !== 0) {
        // Password sudah di-hash bcrypt
        $passwordValid = password_verify($password, $user['password']);
    } else {
        // Password lama masih plain text (data bawaan)
        $passwordValid = ($password === $user['password']);
    }

    if ($passwordValid) {
        echo json_encode([
            'status'       => 'success',
            'pesan'        => 'Login berhasil',
            'role'         => $user['role'],
            'id_user'      => $user['id_user'],
            'nama_lengkap' => $user['nama_lengkap']
        ]);
    } else {
        echo json_encode(['status' => 'gagal', 'pesan' => 'Email atau password salah']);
    }
} else {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Email atau password salah']);
}
?>
