<?php
require __DIR__ . '/config.php';

// Following API
//
// GET  /following.php?user_id=...
//   -> returns followed artists with artist name + image
//
// POST /following.php
//   { action: "follow" | "unfollow", user_id, artist_id }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        fail('user_id is required');
    }

    $stmt = $pdo->prepare("
        SELECT f.id, f.artist_id, a.name, a.image_url
        FROM public.following f
        JOIN public.artists a ON a.id = f.artist_id
        WHERE f.user_id = :user_id
        ORDER BY f.created_at DESC
    ");
    $stmt->execute([':user_id' => $userId]);
    $rows = $stmt->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;
    $userId = $input['user_id'] ?? null;
    $artistId = $input['artist_id'] ?? null;

    if (!$action || !$userId || !$artistId) {
        fail('action, user_id and artist_id are required');
    }

    if ($action === 'follow') {
        $stmt = $pdo->prepare('
            INSERT INTO public.following (user_id, artist_id)
            VALUES (:user_id, :artist_id)
            RETURNING *
        ');
        $stmt->execute([
            ':user_id'  => $userId,
            ':artist_id'=> $artistId,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'unfollow') {
        $stmt = $pdo->prepare('DELETE FROM public.following WHERE user_id = :user_id AND artist_id = :artist_id');
        $stmt->execute([
            ':user_id'  => $userId,
            ':artist_id'=> $artistId,
        ]);
        ok(['following' => false]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

