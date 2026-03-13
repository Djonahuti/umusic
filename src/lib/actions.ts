import { apiAddSongToPlaylist, apiFetchUserPlaylists, apiCreatePlaylist } from "@/lib/api";

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  await apiAddSongToPlaylist(playlistId, songId);
};

export const fetchUserPlaylists = async (userId: string) => {
  return apiFetchUserPlaylists(userId);
};

export const createPlaylist = async (userId: string, title: string) => {
  return apiCreatePlaylist(userId, title);
};
