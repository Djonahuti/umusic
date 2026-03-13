<?php
require __DIR__ . '/config.php';

// Simple email/password auth API (no Supabase).
//
// POST /auth.php
//   { action: "login", email, password }
//   { action: "register", email, password, fullname }
//
// NOTE: This uses plain-text passwords to match the existing `users` table.
//       For a real production app you should hash passwords with password_hash().

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    fail('Method not allowed', 405);
}

$input = json_input();
$action = $input['action'] ?? null;

if (!$action) {
    fail('Missing action');
}

if ($action === 'login') {
    $email    = $input['email']    ?? null;
    $password = $input['password'] ?? null;

    if (!$email || !$password) {
        fail('Email and password are required');
    }

    $stmt = $pdo->prepare('SELECT id, fullname, email, avatar_url, is_admin, password FROM public.users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $row = $stmt->fetch();

    if (!$row || $row['password'] !== $password) {
        fail('Invalid credentials', 401);
    }

    ok([
        'id'        => $row['id'],
        'fullName'  => $row['fullname'],
        'email'     => $row['email'],
        'avatar_url'=> $row['avatar_url'],
        'is_admin'  => (bool)$row['is_admin'],
    ]);
}

if ($action === 'register') {
    $email    = $input['email']    ?? null;
    $password = $input['password'] ?? null;
    $fullName = $input['fullName'] ?? null;

    if (!$email || !$password || !$fullName) {
        fail('email, password and fullName are required');
    }

    // Check if email already exists
    $stmt = $pdo->prepare('SELECT id FROM public.users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        fail('Email already registered', 400);
    }

    $stmt = $pdo->prepare('
        INSERT INTO public.users (fullname, email, password, is_admin)
        VALUES (:fullname, :email, :password, false)
        RETURNING id, fullname, email, avatar_url, is_admin
    ');
    $stmt->execute([
        ':fullname' => $fullName,
        ':email'    => $email,
        ':password' => $password,
    ]);

    $row = $stmt->fetch();
    ok([
        'id'        => $row['id'],
        'fullName'  => $row['fullname'],
        'email'     => $row['email'],
        'avatar_url'=> $row['avatar_url'],
        'is_admin'  => (bool)$row['is_admin'],
    ]);
}

fail('Unknown action', 400);

