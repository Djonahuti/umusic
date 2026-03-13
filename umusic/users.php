<?php
require __DIR__ . '/config.php';

// Users API
//
// GET  /users.php
//   ?id=...       -> single user
//   (no params)   -> all users
//
// POST /users.php
//   { action: "update", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT id, fullname AS "fullName", email, avatar_url, is_admin FROM public.users WHERE id = :id');
        $stmt->execute([':id' => $_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            fail('User not found', 404);
        }
        ok($row);
    }

    $stmt = $pdo->query('SELECT id, fullname AS "fullName", email, avatar_url, is_admin FROM public.users ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;
    if ($action !== 'update') {
        fail('Unsupported action', 400);
    }

    $id = $input['id'] ?? null;
    if (!$id) {
        fail('Missing user id');
    }

    $fields = [];
    $params = [':id' => $id];

    foreach (['fullname', 'avatar_url', 'is_admin'] as $field) {
        if (array_key_exists($field, $input)) {
            $fields[] = "$field = :$field";
            $params[":$field"] = $input[$field];
        }
    }

    if (!$fields) {
        fail('No fields to update');
    }

    $sql = 'UPDATE public.users SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING id, fullname AS "fullName", email, avatar_url, is_admin';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch();
    ok($row);
}

fail('Method not allowed', 405);

