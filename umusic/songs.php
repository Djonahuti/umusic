<?php
require __DIR__ . '/config.php';

// Songs API:
//
// GET  /songs.php
//    ?id=...          -> single song (with joins)
//    ?album_id=...    -> songs by album
//    ?artist_id=...   -> songs by artist
//    ?genre_id=...    -> songs by genre
//    (no params)      -> all songs (latest first)
//
// POST /songs.php
//    JSON body with { action: "create" | "update" | "delete" | "increment_plays", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $params = [];
    $where = [];

    if (!empty($_GET['id'])) {
        $where[] = 's.id = :id';
        $params[':id'] = $_GET['id'];
    }
    if (!empty($_GET['album_id'])) {
        $where[] = 's.album_id = :album_id';
        $params[':album_id'] = $_GET['album_id'];
    }
    if (!empty($_GET['artist_id'])) {
        $where[] = 's.artist_id = :artist_id';
        $params[':artist_id'] = $_GET['artist_id'];
    }
    if (!empty($_GET['genre_id'])) {
        $where[] = 's.genre_id = :genre_id';
        $params[':genre_id'] = $_GET['genre_id'];
    }

    $sql = "
        SELECT
            s.*,
            a.name  AS artist_name,
            al.name AS album_name,
            g.name  AS genre_name
        FROM public.songs s
        LEFT JOIN public.artists a ON a.id = s.artist_id
        LEFT JOIN public.albums  al ON al.id = s.album_id
        LEFT JOIN public.genres  g  ON g.id = s.genre_id
    ";

    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    // Default ordering by creation date then track number
    $sql .= ' ORDER BY s.created_at DESC, s.track_no ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // Shape data to roughly match previous Supabase `.select("*, artists(name), albums(name), genres(name)")`
    $formatted = array_map(function ($row) {
        return [
            'id'         => $row['id'],
            'title'      => $row['title'],
            'audio_url'  => $row['audio_url'],
            'cover_url'  => $row['cover_url'],
            'album_id'   => $row['album_id'],
            'artist_id'  => $row['artist_id'],
            'genre_id'   => $row['genre_id'],
            'duration'   => $row['duration'],
            'plays'      => $row['plays'],
            'track_no'   => $row['track_no'],
            'created_at' => $row['created_at'],
            'artists'    => ['name' => $row['artist_name']],
            'albums'     => ['name' => $row['album_name']],
            'genres'     => ['name' => $row['genre_name']],
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
        $title     = $input['title']     ?? null;
        $trackNo   = $input['track_no']  ?? null;
        $artistId  = $input['artist_id'] ?? null;
        $albumId   = $input['album_id']  ?? null;
        $genreId   = $input['genre_id']  ?? null;
        $audioUrl  = $input['audio_url'] ?? null;
        $coverUrl  = $input['cover_url'] ?? null;
        $duration  = $input['duration']  ?? null;

        if (!$title || !$artistId || !$albumId || !$genreId || !$audioUrl) {
            fail('Missing required fields for song creation');
        }

        $sql = "
            INSERT INTO public.songs
            (title, track_no, artist_id, album_id, genre_id, audio_url, cover_url, duration)
            VALUES (:title, :track_no, :artist_id, :album_id, :genre_id, :audio_url, :cover_url, :duration)
            RETURNING *
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title'     => $title,
            ':track_no'  => $trackNo,
            ':artist_id' => $artistId,
            ':album_id'  => $albumId,
            ':genre_id'  => $genreId,
            ':audio_url' => $audioUrl,
            ':cover_url' => $coverUrl,
            ':duration'  => $duration,
        ]);

        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'update') {
        $id = $input['id'] ?? null;
        if (!$id) {
            fail('Missing song id for update');
        }

        $fields = [];
        $params = [':id' => $id];

        foreach (['title', 'track_no', 'artist_id', 'album_id', 'genre_id', 'audio_url', 'cover_url', 'duration', 'plays'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (!$fields) {
            fail('No fields to update');
        }

        $sql = 'UPDATE public.songs SET ' . implode(', ', $fields) . ' WHERE id = :id RETURNING *';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) {
            fail('Missing song id for delete');
        }

        $stmt = $pdo->prepare('DELETE FROM public.songs WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    if ($action === 'increment_plays') {
        $id = $input['id'] ?? null;
        if (!$id) {
            fail('Missing song id for increment_plays');
        }

        // Increment plays atomically
        $stmt = $pdo->prepare('UPDATE public.songs SET plays = COALESCE(plays, 0) + 1 WHERE id = :id RETURNING plays');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        ok(['id' => $id, 'plays' => $row['plays'] ?? 0]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

