<?php
require 'koneksi.php';
if ($conn) {
    foreach (['users', 'pekerjaan', 'lamaran'] as $table) {
        echo "=== $table ===\n";
        $res = mysqli_query($conn, "SELECT * FROM $table");
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                print_r($row);
            }
        } else {
            echo "Error: " . mysqli_error($conn) . "\n";
        }
        echo "\n";
    }
}
?>
