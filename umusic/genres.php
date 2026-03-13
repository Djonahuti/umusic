<?php
require __DIR__ . '/config.php';

// Genres API
//
// GET  /genres.php
//   ?id=...  -> single genre
//   (none)   -> all genres
//
// POST /genres.php
//   { action: "create" | "update" | "delete", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM public.genres WHERE id = :id');
        $stmt->execute([':id' => $_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            fail('Genre not found', 404);
        }
        ok($row);
    }

    $stmt = $pdo->query('SELECT * FROM public.genres ORDER BY created_at DESC');
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
        $description = $input['description'] ?? null;
        if (!$name) fail('Name is required');

        $stmt = $pdo->prepare('INSERT INTO public.genres (name, description) VALUES (:name, :description) RETURNING *');
        $stmt->execute([
            ':name'        => $name,
            ':description' => $description,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'update') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing genre id');

        $fields = [];
        $params = [':id' => $id];

        foreach (['name', 'description'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (!$fields) {
            fail('No fields to update');
        }

        $sql = 'UPDATE public.genres SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING *';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing genre id');

        $stmt = $pdo->prepare('DELETE FROM public.genres WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

