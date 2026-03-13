<?php
require __DIR__ . '/config.php';

// Artists API
//
// GET  /artists.php
//   ?id=...    -> single artist
//   (none)     -> all artists
//
// POST /artists.php
//   { action: "create" | "update" | "delete", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM public.artists WHERE id = :id');
        $stmt->execute([':id' => $_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            fail('Artist not found', 404);
        }
        ok($row);
    }

    $stmt = $pdo->query('SELECT * FROM public.artists ORDER BY created_at DESC');
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
        $name = $input['name'] ?? null;
        $bio  = $input['bio']  ?? null;
        $imageUrl = $input['image_url'] ?? null;

        if (!$name) {
            fail('Name is required');
        }

        $stmt = $pdo->prepare('INSERT INTO public.artists (name, bio, image_url) VALUES (:name, :bio, :image_url) RETURNING *');
        $stmt->execute([
            ':name'      => $name,
            ':bio'       => $bio,
            ':image_url' => $imageUrl,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'update') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing artist id');

        $fields = [];
        $params = [':id' => $id];

        foreach (['name', 'bio', 'image_url'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (!$fields) {
            fail('No fields to update');
        }

        $sql = 'UPDATE public.artists SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING *';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing artist id');

        $stmt = $pdo->prepare('DELETE FROM public.artists WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

