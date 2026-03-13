<?php
require __DIR__ . '/config.php';

// Playlist songs API
//
// GET /playlist_songs.php?playlist_id=...
//   -> returns songs for a playlist with joined song + artist + album + genre
//
// POST /playlist_songs.php
//   { action: "add_song" | "remove_song", ... }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $playlistId = $_GET['playlist_id'] ?? null;
    if (!$playlistId) {
        fail('playlist_id is required');
    }

    $stmt = $pdo->prepare("
        SELECT
            ps.id,
            ps.playlist_id,
            s.*,
            a.name  AS artist_name,
            al.name AS album_name,
            al.release_year AS album_release_year,
            g.name  AS genre_name
        FROM public.playlist_songs ps
        JOIN public.songs s    ON s.id = ps.song_id
        LEFT JOIN public.artists a ON a.id = s.artist_id
        LEFT JOIN public.albums  al ON al.id = s.album_id
        LEFT JOIN public.genres  g  ON g.id = s.genre_id
        WHERE ps.playlist_id = :playlist_id
        ORDER BY s.track_no ASC, s.created_at DESC
    ");
    $stmt->execute([':playlist_id' => $playlistId]);
    $rows = $stmt->fetchAll();

    $formatted = array_map(function ($row) {
        return [
            'id'         => $row['id'],
            'playlist_id'=> $row['playlist_id'],
            'song_id'    => $row['id'],
            'title'      => $row['title'],
            'audio_url'  => $row['audio_url'],
            'cover_url'  => $row['cover_url'],
            'album_id'   => $row['album_id'],
            'artist_id'  => $row['artist_id'],
            'genre_id'   => $row['genre_id'],
            'duration'   => $row['duration'],
            'plays'      => $row['plays'],
            'track_no'   => $row['track_no'],
            'artists'    => ['name' => $row['artist_name']],
            'albums'     => ['name' => $row['album_name'], 'release_year' => $row['album_release_year'] ?? null],
            'genres'     => ['name' => $row['genre_name']],
        ];
    }, $rows);

    ok($formatted);
}

if ($method === 'POST') {
    $input = json_input();
    $action = $input['action'] ?? null;

    if (!$action) fail('Missing action');

    if ($action === 'add_song') {
        $playlistId = $input['playlist_id'] ?? null;
        $songId     = $input['song_id']     ?? null;
        if (!$playlistId || !$songId) fail('playlist_id and song_id are required');

        $stmt = $pdo->prepare('
            INSERT INTO public.playlist_songs (playlist_id, song_id)
            VALUES (:playlist_id, :song_id)
            RETURNING *
        ');
        $stmt->execute([
            ':playlist_id' => $playlistId,
            ':song_id'     => $songId,
        ]);
        $row = $stmt->fetch();
        ok($row);
    }

    if ($action === 'remove_song') {
        $id = $input['id'] ?? null;
        if (!$id) fail('Missing playlist_songs id');

        $stmt = $pdo->prepare('DELETE FROM public.playlist_songs WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ok(['deleted' => true]);
    }

    fail('Unknown action', 400);
}

fail('Method not allowed', 405);

