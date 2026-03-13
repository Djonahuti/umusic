<?php
require __DIR__ . '/config.php';

// Albums API
//
// GET  /albums.php
//   ?id=...       -> single album with joined artist + songs
//   (no params)   -> latest albums with artist name
//
// POST /albums.php
//   { action: "create" | "update" | "delete", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $albumId = $_GET['id'];

        // Fetch album with artist
        $stmt = $pdo->prepare("
            SELECT al.*, ar.name AS artist_name
            FROM public.albums al
            LEFT JOIN public.artists ar ON ar.id = al.artist_id
            WHERE al.id = :id
        ");
        $stmt->execute([':id' => $albumId]);
        $album = $stmt->fetch();
        if (!$album) {
            fail('Album not found', 404);
        }

        // Fetch songs for the album
        $stmtSongs = $pdo->prepare("
            SELECT id, title, cover_url, plays, audio_url, duration, track_no
            FROM public.songs
            WHERE album_id = :album_id
            ORDER BY track_no ASC
        ");
        $stmtSongs->execute([':album_id' => $albumId]);
        $songs = $stmtSongs->fetchAll();

        ok([
            'album' => [
                'id'          => $album['id'],
                'name'        => $album['name'],
                'info'        => $album['info'],
                'cover_url'   => $album['cover_url'],
                'artist_id'   => $album['artist_id'],
                'genre_id'    => $album['genre_id'],
                'release_year'=> $album['release_year'],
                'artists'     => ['name' => $album['artist_name']],
            ],
            'songs' => $songs,
        ]);
    }

    // Latest albums with artist
    $stmt = $pdo->query("
        SELECT al.*, ar.name AS artist_name
        FROM public.albums al
        LEFT JOIN public.artists ar ON ar.id = al.artist_id
        ORDER BY al.created_at DESC
    ");
    $rows = $stmt->fetchAll();

    $formatted = array_map(function ($row) {
        return [
            'id'        => $row['id'],
            'name'      => $row['name'],
            'info'      => $row['info'],
            'cover_url' => $row['cover_url'],
            'artist_id' => $row['artist_id'],
            'genre_id'  => $row['genre_id'],
            'release_year' => $row['release_year'],
            'artists'   => ['name' => $row['artist_name']],
        ];
    }, $rows);

    ok($formatted);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;

    if (!$action) {
        fail('Missing action');
    }

    if ($action === 'create') {
        $name        = $input['name']        ?? null;
        $artistId    = $input['artist_id']   ?? null;
        $genreId     = $input['genre_id']    ?? null;
        $releaseYear = $input['release_year']?? null;
        $info        = $input['info']        ?? null;
        $coverUrl    = $input['cover_url']   ?? null;

        if (!$name || !$artistId || !$genreId || !$releaseYear) {
            fail('Missing required fields for album creation');
        }

        $stmt = $pdo->prepare("
            INSERT INTO public.albums
            (name, artist_id, genre_id, release_year, info, cover_url)
            VALUES (:name, :artist_id, :genre_id, :release_year, :info, :cover_url)
            RETURNING *
        ");
        $stmt->execute([
            ':name'         => $name,
            ':artist_id'    => $artistId,
            ':genre_id'     => $genreId,
            ':release_year' => $releaseYear,
            ':info'         => $info,
            ':cover_url'    => $coverUrl,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'update') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing album id');

        $fields = [];
        $params = [':id' => $id];

        foreach (['name', 'artist_id', 'genre_id', 'release_year', 'info', 'cover_url'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (!$fields) {
            fail('No fields to update');
        }

        $sql = 'UPDATE public.albums SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING *';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing album id');

        $stmt = $pdo->prepare('DELETE FROM public.albums WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

