<?php
require __DIR__ . '/config.php';

// Playlists API
//
// GET  /playlists.php
//   ?user_id=...     -> playlists for user
//   ?id=...          -> single playlist
//   (none)           -> all public playlists
//
// POST /playlists.php
//   { action: "create" | "update" | "delete", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM public.playlists WHERE id = :id');
        $stmt->execute([':id' => $_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            fail('Playlist not found', 404);
        }
        ok($row);
    }

    if (!empty($_GET['user_id'])) {
        $stmt = $pdo->prepare('SELECT * FROM public.playlists WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $_GET['user_id']]);
        $rows = $stmt->fetchAll();
        ok($rows);
    }

    // All public playlists
    $stmt = $pdo->query('SELECT * FROM public.playlists WHERE is_public = true ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;

    if (!$action) {
        fail('Missing action');
    }

    if ($action === 'create') {
        $userId = $input['user_id'] ?? null;
        $title  = $input['title']    ?? null;
        $description = $input['description'] ?? null;
        $imageUrl    = $input['image_url']    ?? null;

        if (!$userId || !$title) {
            fail('user_id and title are required');
        }

        $stmt = $pdo->prepare('
            INSERT INTO public.playlists (user_id, title, description, image_url)
            VALUES (:user_id, :title, :description, :image_url)
            RETURNING *
        ');
        $stmt->execute([
            ':user_id'     => $userId,
            ':title'       => $title,
            ':description' => $description,
            ':image_url'   => $imageUrl,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'update') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing playlist id');

        $fields = [];
        $params = [':id' => $id];

        foreach (['title', 'description', 'image_url', 'is_public'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (!$fields) {
            fail('No fields to update');
        }

        $sql = 'UPDATE public.playlists SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING *';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing playlist id');

        $stmt = $pdo->prepare('DELETE FROM public.playlists WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

