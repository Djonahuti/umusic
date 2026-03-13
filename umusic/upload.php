<?php
require __DIR__ . '/config.php';

// This endpoint handles file uploads (audio + artworks) and stores them
// under the public "audio" folder on the server.
//
// Response:
// {
//   "ok": true,
//   "data": {
//     "fileName": "abc123.mp3",
//     "url": "https://calistacouture.com.ng/audio/abc123.mp3"
//   }
// }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

// Make sure the request contains a file
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    fail('No file uploaded or upload error');
}

// Base directory for uploads (one level above /umusic, into /audio)
$uploadBaseDir = realpath(__DIR__ . '/../audio');

// If the directory does not exist yet, try to create it
if ($uploadBaseDir === false) {
    $uploadBaseDir = __DIR__ . '/../audio';
    if (!is_dir($uploadBaseDir) && !mkdir($uploadBaseDir, 0775, true)) {
        fail('Failed to create upload directory');
    }
}

// Simple whitelist of allowed extensions
$allowedExtensions = ['mp3', 'wav', 'flac', 'm4a', 'ogg', 'jpg', 'jpeg', 'png', 'webp', 'gif'];

$fileInfo = $_FILES['file'];
$originalName = $fileInfo['name'];
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions, true)) {
    fail('Unsupported file type');
}

// Generate a unique file name to avoid collisions
$safeName = bin2hex(random_bytes(8)) . '.' . $ext;
$targetPath = rtrim($uploadBaseDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $safeName;

if (!move_uploaded_file($fileInfo['tmp_name'], $targetPath)) {
    fail('Failed to move uploaded file');
}

// Public URL where the file can be accessed
$publicBaseUrl = rtrim('https://calistacouture.com.ng/audio', '/');
$publicUrl = $publicBaseUrl . '/' . $safeName;

ok([
    'fileName' => $safeName,
    'url' => $publicUrl,
]);

