"use client";

import { useEffect, useState } from "react";
import { fetchUserPlaylists } from "@/lib/actions";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { ApiPlaylist } from "@/lib/api";

type Playlist = ApiPlaylist;

export default function ViewPlaylists() {
  const user = useAuth();
  const router = useRouter();  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (user && user.user && user.user.id) {
      fetchUserPlaylists(user.user.id).then(setPlaylists).catch(console.error);
    }
  }, [user]);

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  return (
    <div className="p-4 space-y-4">
      {playlists.length === 0 ? (
        <p>No playlists yet</p>
      ) : (
        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li
             key={playlist.id} className="border p-3 rounded shadow"
             onClick={() => handlePlaylistClick(playlist.id)}
            >
              <h2 className="font-semibold">{playlist.title}</h2>
              <p className="text-sm text-muted-foreground">{playlist.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
