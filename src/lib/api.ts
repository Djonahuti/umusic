import type { User as AppUser } from "@/types";

const API_BASE =
  process.env.NEXT_APP_API_URL ||
  (process.env.NEXT_APP_BASE_URL
    ? `${process.env.NEXT_APP_BASE_URL.replace(/\/$/, "")}/umusic`
    : "https://calistacouture.com.ng/umusic");

const AUDIO_BASE =
  (process.env.NEXT_APP_BASE_URL || "https://calistacouture.com.ng").replace(/\/$/, "") +
  "/audio";

type HttpMethod = "GET" | "POST";

interface RequestOptions {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL(path, API_BASE + "/");
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    const message = data?.error || data?.message || res.statusText || "Request failed";
    throw new Error(message);
  }

  return data.data as T;
}

export function getAudioUrl(fileName: string | null | undefined): string {
  if (!fileName) return "";
  // Existing records already store a full URL; new ones will be just file names.
  if (/^https?:\/\//i.test(fileName)) return fileName;
  return `${AUDIO_BASE}/${fileName}`;
}

// Types that mirror the backend payloads

export type ApiUser = AppUser;

export interface ApiArtist {
  id: string;
  name: string;
  bio?: string | null;
  image_url?: string | null;
}

export interface ApiAlbum {
  id: string;
  name: string;
  info?: string | null;
  cover_url?: string | null;
  artist_id: string | null;
  genre_id: string | null;
  release_year: number | null;
  artists?: { name: string | null };
}

export interface ApiGenre {
  id: string;
  name: string | null;
  description?: string | null;
}

export interface ApiSong {
  id: string;
  title: string;
  audio_url: string | null;
  cover_url: string | null;
  album_id: string | null;
  artist_id: string | null;
  genre_id: string | null;
  duration: number | null;
  plays: number | null;
  track_no: number | null;
  artists?: { name: string | null };
  albums?: { name: string | null };
  genres?: { name: string | null };
}

export interface ApiPlaylist {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  user_id: string | null;
  is_public: boolean;
}

export interface ApiPlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
}

export interface UploadResult {
  fileName: string;
  url: string;
}

// Auth

export async function apiLogin(email: string, password: string): Promise<ApiUser> {
  return requestJson<ApiUser>("auth.php", {
    method: "POST",
    body: {
      action: "login",
      email,
      password,
    },
  });
}

export async function apiRegister(email: string, password: string, fullName: string): Promise<ApiUser> {
  return requestJson<ApiUser>("auth.php", {
    method: "POST",
    body: {
      action: "register",
      email,
      password,
      fullName,
    },
  });
}

// Uploads (audio + artworks) -> /audio folder

export async function apiUploadFile(file: File): Promise<UploadResult> {
  const url = `${API_BASE}/upload.php`;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    const message = data?.error || data?.message || res.statusText || "Upload failed";
    throw new Error(message);
  }

  return data.data as UploadResult;
}

// Songs

export async function apiFetchSongs(filters?: {
  artistId?: string;
  albumId?: string;
  genreId?: string;
}): Promise<ApiSong[]> {
  return requestJson<ApiSong[]>("songs.php", {
    query: {
      artist_id: filters?.artistId,
      album_id: filters?.albumId,
      genre_id: filters?.genreId,
    },
  });
}

export async function apiCreateSong(payload: {
  title: string;
  track_no: string | number;
  artist_id: string;
  album_id: string;
  genre_id: string;
  audio_url: string;
  cover_url?: string;
  duration?: number | null;
}): Promise<ApiSong> {
  return requestJson<ApiSong>("songs.php", {
    method: "POST",
    body: {
      action: "create",
      ...payload,
    },
  });
}

export async function apiUpdateSong(payload: {
  id: string;
  title?: string;
  artist_id?: string;
  album_id?: string;
  genre_id?: string;
  audio_url?: string;
  cover_url?: string | null;
  duration?: number | null;
  track_no?: string | number;
}): Promise<ApiSong> {
  return requestJson<ApiSong>("songs.php", {
    method: "POST",
    body: {
      action: "update",
      ...payload,
    },
  });
}

export async function apiDeleteSong(id: string): Promise<void> {
  await requestJson("songs.php", {
    method: "POST",
    body: {
      action: "delete",
      id,
    },
  });
}

export async function apiIncrementSongPlays(id: string): Promise<number> {
  const res = await requestJson<{ id: string; plays: number }>("songs.php", {
    method: "POST",
    body: {
      action: "increment_plays",
      id,
    },
  });
  return res.plays;
}

// Artists

export async function apiFetchArtists(): Promise<ApiArtist[]> {
  return requestJson<ApiArtist[]>("artists.php");
}

export async function apiCreateArtist(payload: {
  name: string;
  bio?: string;
  image_url?: string;
}): Promise<ApiArtist> {
  return requestJson<ApiArtist>("artists.php", {
    method: "POST",
    body: {
      action: "create",
      ...payload,
    },
  });
}

export async function apiFetchArtist(id: string): Promise<ApiArtist> {
  return requestJson<ApiArtist>("artists.php", { query: { id } });
}

export async function apiUpdateArtist(payload: {
  id: string;
  name?: string;
  bio?: string | null;
  image_url?: string | null;
}): Promise<ApiArtist> {
  return requestJson<ApiArtist>("artists.php", {
    method: "POST",
    body: { action: "update", ...payload },
  });
}

export async function apiDeleteArtist(id: string): Promise<void> {
  await requestJson("artists.php", {
    method: "POST",
    body: { action: "delete", id },
  });
}

// Albums

export async function apiFetchAlbums(): Promise<ApiAlbum[]> {
  return requestJson<ApiAlbum[]>("albums.php");
}

export async function apiFetchAlbumWithSongs(id: string): Promise<{ album: ApiAlbum; songs: ApiSong[] }> {
  return requestJson<{ album: ApiAlbum; songs: ApiSong[] }>("albums.php", {
    query: { id },
  });
}

export async function apiCreateAlbum(payload: {
  name: string;
  artist_id: string;
  genre_id: string;
  release_year: string | number;
  info?: string;
  cover_url?: string;
}): Promise<ApiAlbum> {
  return requestJson<ApiAlbum>("albums.php", {
    method: "POST",
    body: {
      action: "create",
      ...payload,
    },
  });
}

export async function apiUpdateAlbum(payload: {
  id: string;
  name?: string;
  artist_id?: string;
  genre_id?: string;
  release_year?: number;
  info?: string | null;
  cover_url?: string | null;
}): Promise<ApiAlbum> {
  return requestJson<ApiAlbum>("albums.php", {
    method: "POST",
    body: { action: "update", ...payload },
  });
}

export async function apiDeleteAlbum(id: string): Promise<void> {
  await requestJson("albums.php", {
    method: "POST",
    body: { action: "delete", id },
  });
}

// Genres

export async function apiFetchGenres(): Promise<ApiGenre[]> {
  return requestJson<ApiGenre[]>("genres.php");
}

export async function apiFetchGenre(id: string): Promise<ApiGenre> {
  return requestJson<ApiGenre>("genres.php", { query: { id } });
}

export async function apiCreateGenre(payload: { name: string; description?: string }): Promise<ApiGenre> {
  return requestJson<ApiGenre>("genres.php", {
    method: "POST",
    body: {
      action: "create",
      ...payload,
    },
  });
}

export async function apiUpdateGenre(payload: { id: string; name?: string; description?: string | null }): Promise<ApiGenre> {
  return requestJson<ApiGenre>("genres.php", {
    method: "POST",
    body: { action: "update", ...payload },
  });
}

export async function apiDeleteGenre(id: string): Promise<void> {
  await requestJson("genres.php", {
    method: "POST",
    body: { action: "delete", id },
  });
}

// Playlists

export async function apiFetchUserPlaylists(userId: string): Promise<ApiPlaylist[]> {
  return requestJson<ApiPlaylist[]>("playlists.php", {
    query: { user_id: userId },
  });
}

/** Fetch all public playlists (no user filter) */
export async function apiFetchPublicPlaylists(): Promise<ApiPlaylist[]> {
  return requestJson<ApiPlaylist[]>("playlists.php");
}

export async function apiCreatePlaylist(userId: string, title: string): Promise<ApiPlaylist> {
  return requestJson<ApiPlaylist>("playlists.php", {
    method: "POST",
    body: {
      action: "create",
      user_id: userId,
      title,
    },
  });
}

export async function apiFetchPlaylist(id: string): Promise<ApiPlaylist> {
  return requestJson<ApiPlaylist>("playlists.php", {
    query: { id },
  });
}

export async function apiUpdatePlaylist(payload: {
  id: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  is_public?: boolean;
}): Promise<ApiPlaylist> {
  return requestJson<ApiPlaylist>("playlists.php", {
    method: "POST",
    body: {
      action: "update",
      ...payload,
    },
  });
}

export async function apiFetchPlaylistSongs(playlistId: string): Promise<ApiSong[]> {
  return requestJson<ApiSong[]>("playlist_songs.php", {
    query: { playlist_id: playlistId },
  });
}

export async function apiAddSongToPlaylist(playlistId: string, songId: string): Promise<ApiPlaylistSong> {
  return requestJson<ApiPlaylistSong>("playlist_songs.php", {
    method: "POST",
    body: {
      action: "add_song",
      playlist_id: playlistId,
      song_id: songId,
    },
  });
}

// Likes

export async function apiFetchLikesForUser(userId: string, songIds: string[]): Promise<{ song_id: string }[]> {
  if (songIds.length === 0) return [];
  return requestJson<{ song_id: string }[]>("likes.php", {
    query: {
      user_id: userId,
      song_ids: songIds.join(","),
    },
  });
}

export async function apiLikeSong(userId: string, songId: string): Promise<void> {
  await requestJson("likes.php", {
    method: "POST",
    body: {
      action: "like",
      user_id: userId,
      song_id: songId,
    },
  });
}

export async function apiUnlikeSong(userId: string, songId: string): Promise<void> {
  await requestJson("likes.php", {
    method: "POST",
    body: {
      action: "unlike",
      user_id: userId,
      song_id: songId,
    },
  });
}

// Favorite albums

export async function apiIsFavoriteAlbum(userId: string, albumId: string): Promise<boolean> {
  const rows = await requestJson<{ id: string }[]>("favorite_album.php", {
    query: { user_id: userId, album_id: albumId },
  });
  return rows.length > 0;
}

export async function apiAddFavoriteAlbum(userId: string, albumId: string): Promise<void> {
  await requestJson("favorite_album.php", {
    method: "POST",
    body: {
      action: "add",
      user_id: userId,
      album_id: albumId,
    },
  });
}

// Following

export async function apiFetchFollowing(userId: string): Promise<Array<{ id: number; artist_id: string; name: string; image_url?: string }>> {
  return requestJson("following.php", {
    query: { user_id: userId },
  });
}

export async function apiFollowArtist(userId: string, artistId: string): Promise<void> {
  await requestJson("following.php", {
    method: "POST",
    body: {
      action: "follow",
      user_id: userId,
      artist_id: artistId,
    },
  });
}

export async function apiUnfollowArtist(userId: string, artistId: string): Promise<void> {
  await requestJson("following.php", {
    method: "POST",
    body: {
      action: "unfollow",
      user_id: userId,
      artist_id: artistId,
    },
  });
}

// Users

export async function apiFetchUser(id: string): Promise<ApiUser> {
  return requestJson<ApiUser>("users.php", {
    query: { id },
  });
}

export async function apiFetchUsers(): Promise<ApiUser[]> {
  return requestJson<ApiUser[]>("users.php");
}

export async function apiUpdateUser(payload: {
  id: string;
  fullName?: string;
  avatar_url?: string | null;
  is_admin?: boolean;
}): Promise<ApiUser> {
  // Backend column is `fullname`, but our type uses `fullName`
  const body: Record<string, unknown> = {
    action: "update",
    id: payload.id,
  };
  if (payload.fullName !== undefined) body.fullname = payload.fullName;
  if (payload.avatar_url !== undefined) body.avatar_url = payload.avatar_url;
  if (payload.is_admin !== undefined) body.is_admin = payload.is_admin;

  return requestJson<ApiUser>("users.php", {
    method: "POST",
    body,
  });
}

