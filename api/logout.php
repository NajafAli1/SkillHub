<?php
require_once 'bootstrap.php';

$_SESSION = [];
session_destroy();

echo json_encode(['status' => 'sukses', 'pesan' => 'Logout berhasil']);
