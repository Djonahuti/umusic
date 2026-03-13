"use client";

import { apiFetchAlbums } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Album {
  id: string
  name: string
  info: string
  cover_url: string
  artists: {
    name: string
  }
}

export function Added() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const router = useRouter();

  const fetchAlbums = async () => {
    try {
      const albums = await apiFetchAlbums();
      setAlbums((albums || []).slice(0, 12) as Album[]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAlbumClick = (albumId: string) => {
    router.push(`/album_detail/${albumId}`);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums?.map((album) => (
          <div
           key={album.id} 
           className="rounded overflow-hidden shadow-md" 
           onClick={() => handleAlbumClick(album.id)}
          >
            <Image
              src={album.cover_url}
              alt={album.name}
              width={300}
              height={300}
              className="w-full"
            />
            <div className="p-2">
              <p className="font-medium">{album.name}</p>
              <p className="text-sm text-muted-foreground">{album.artists?.name ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>
  );
}
