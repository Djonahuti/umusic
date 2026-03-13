"use client";
import { apiFetchPublicPlaylists } from "@/lib/api";
import { cn } from "@/lib/utils";
import { IconAlbum, IconCalendarWeekFilled, IconMicrophone, IconPlaylist } from "@tabler/icons-react";
import { Guitar, Music2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Playlist {
  id: string;
  title: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const data = await apiFetchPublicPlaylists();
      setPlaylists((data || []).map((p) => ({ id: p.id, title: p.title })));
    };
    fetchPlaylists();
  }, []);

  const libraryItems = [
    { icon: <IconCalendarWeekFilled />, label: "Recently Added", href: "/" },
    { icon: <IconMicrophone />, label: "Artists", href: "/artists" },
    { icon: <IconAlbum />, label: "Albums", href: "/albums" },
    { icon: <Music2 />, label: "Songs", href: "/songs" },
    { icon: <Guitar />, label: "Genre", href: "/genres" },
  ];


  return (
    <aside className="w-64 p-4 border-r overflow-y-auto hidden md:block">
      <h2 className="font-semibold mb-4">Library</h2>
      <nav className="space-y-2 mb-6">
        {libraryItems.map(({ icon, label, href }) => (
          <Link
           key={href} 
           className={cn(
             "flex items-center gap-2 cursor-pointer hover:underline",
             pathname === href ? "text-pink-500 font-semibold" : "font-normal"
           )} 
           href={href}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
      <h2 className="font-semibold mb-2">Music Playlists</h2>
      <ul className="space-y-1">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link
              href={`/playlist/${playlist.id}`}
              className={cn(
                "flex items-center gap-2 py-2 cursor-pointer hover:underline",
                pathname === `/playlist/${playlist.id}` ? "text-pink-500 font-semibold" : "font-normal"
              )}
            >
            <span className="flex items-center"><IconPlaylist /></span>
            <span>{playlist.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
