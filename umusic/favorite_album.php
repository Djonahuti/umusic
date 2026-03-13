<?php
require __DIR__ . '/config.php';

// Favorite albums API
//
// GET  /favorite_album.php?user_id=...&album_id=...
//   -> returns { id } if exists, or empty array
//
// POST /favorite_album.php
//   { action: "add", user_id, album_id }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $userId  = $_GET['user_id']  ?? null;
    $albumId = $_GET['album_id'] ?? null;
    if (!$userId || !$albumId) {
        fail('user_id and album_id are required');
    }

    $stmt = $pdo->prepare('SELECT id FROM public.favorite_album WHERE user_id = :user_id AND album_id = :album_id');
    $stmt->execute([
        ':user_id'  => $userId,
        ':album_id' => $albumId,
    ]);
    $rows = $stmt->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;
    $userId = $input['user_id'] ?? null;
    $albumId = $input['album_id'] ?? null;

    if ($action !== 'add' || !$userId || !$albumId) {
        fail('action "add", user_id and album_id are required');
    }

    $stmt = $pdo->prepare('
        INSERT INTO public.favorite_album (user_id, album_id)
        VALUES (:user_id, :album_id)
        RETURNING *
    ');
    $stmt->execute([
        ':user_id'  => $userId,
        ':album_id' => $albumId,
    ]);
    $row = $stmt->fetch();
    ok($row);
}

fail('Method not allowed', 405);

