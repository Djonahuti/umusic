<?php
require __DIR__ . '/config.php';

// Likes API
//
// GET  /likes.php?user_id=...&song_ids=uuid1,uuid2,...
//   -> returns array of { song_id }
//
// POST /likes.php
//   { action: "like" | "unlike", user_id, song_id }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    $songIdsParam = $_GET['song_ids'] ?? null;
    if (!$userId || !$songIdsParam) {
        fail('user_id and song_ids are required');
    }

    $songIds = array_filter(array_map('trim', explode(',', $songIdsParam)));
    if (!$songIds) {
        ok([]);
    }

    // Build placeholders for IN (...)
    $placeholders = implode(',', array_fill(0, count($songIds), '?'));
    $sql = "SELECT song_id FROM public.likes WHERE user_id = ? AND song_id IN ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $params = array_merge([$userId], $songIds);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;
    $userId = $input['user_id'] ?? null;
    $songId = $input['song_id'] ?? null;

    if (!$action || !$userId || !$songId) {
        fail('action, user_id and song_id are required');
    }

    if ($action === 'like') {
        $stmt = $pdo->prepare('
            INSERT INTO public.likes (user_id, song_id)
            VALUES (:user_id, :song_id)
            ON CONFLICT (id) DO NOTHING
        ');
        $stmt->execute([
            ':user_id' => $userId,
            ':song_id' => $songId,
        ]);
        ok(['liked' => true]);
    }

    if ($action === 'unlike') {
        $stmt = $pdo->prepare('DELETE FROM public.likes WHERE user_id = :user_id AND song_id = :song_id');
        $stmt->execute([
            ':user_id' => $userId,
            ':song_id' => $songId,
        ]);
        ok(['liked' => false]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

