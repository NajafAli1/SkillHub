<?php
require_once 'bootstrap.php';
require_once 'rate_limit.php';

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['status' => 'gagal', 'pesan' => 'Email dan password wajib diisi']);
    exit;
}

$lockSeconds = login_rate_limit_check($email);
if ($lockSeconds !== null) {
    http_response_code(429);
    echo json_encode(['status' => 'gagal', 'pesan' => "Terlalu banyak percobaan gagal. Coba lagi dalam {$lockSeconds} detik."]);
    exit;
}

try {
    // Prepared statement — cegah SQL injection
    // Kolom eksplisit (bukan SELECT *) supaya password tidak pernah ikut ke variabel
    // yang bisa saja tanpa sengaja di-json_encode utuh oleh perubahan kode di masa depan.
    $stmt = mysqli_prepare($conn, "SELECT id_user, nama_lengkap, email, password, role FROM users WHERE email = ? LIMIT 1");
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
            login_rate_limit_reset($email);
            session_regenerate_id(true);
            $_SESSION['id_user']      = $user['id_user'];
            $_SESSION['role']         = $user['role'];
            $_SESSION['nama_lengkap'] = $user['nama_lengkap'];

            echo json_encode([
                'status'       => 'success',
                'pesan'        => 'Login berhasil',
                'role'         => $user['role'],
                'id_user'      => $user['id_user'],
                'nama_lengkap' => $user['nama_lengkap']
            ]);
        } else {
            login_rate_limit_record_failure($email);
            echo json_encode(['status' => 'gagal', 'pesan' => 'Email atau password salah']);
        }
    } else {
        login_rate_limit_record_failure($email);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Email atau password salah']);
    }
} catch (mysqli_sql_exception $e) {
    db_error_response($e);
}
