"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetchPlaylist, apiFetchPlaylistSongs, getAudioUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Ellipsis, Mic, MoreHorizontal, Pencil, Play, PlayCircle, Plus, Shuffle, Trash2, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePlayer } from "@/lib/playerContext";
import { Button } from "@/components/ui/button";

interface Song {
  id: string;
  title: string;
  duration: number;
  cover_url: string;
  artists?: { name: string | null };
  albums?: { name: string | null; release_year?: number | null };
  genres?: { name: string | null };
  audio_url: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  is_public?: boolean;
}

export default function PlaylistDetailPage() {
  const params = useParams();
  const player = usePlayer();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [scrolled, setScrolled] = useState(false); 
  const [search, setSearch] = useState("")   

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!id) return;
      try {
        const playlistData = await apiFetchPlaylist(id);
        const playlistSongs = await apiFetchPlaylistSongs(id);
        setPlaylist(playlistData as Playlist);
        setSongs(playlistSongs as Song[]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  // Helper to format duration in mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate total duration
  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);  

  return (
    <>
      {playlist ? (
        <div className="space-y-4">
      {/* Desktop UI */}
        <div className="hidden md:block">
         <div className="w-full p-6 mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div>
            {playlist.image_url ? (
              <Image
                src={playlist.image_url}
                alt={playlist.title}
                width={140}
                height={140}
                className="rounded shadow object-cover"
              />
            ) : (
              <div className="w-[140px] h-[140px] rounded-lg shadow bg-gradient-to-br from-green-300 via-gray-400 to-purple-500 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-800 text-center px-2">
                  {playlist.title}
                </span>
              </div>
            )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
              <div className="text-sm text-gray-500 mb-2">
                {songs.length} Songs · {totalMinutes}hrs, {totalSeconds}min
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={playlist.is_public} readOnly />
                Publish on profile and in search
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
               className={`flex items-center gap-2 px-4 py-2 text-pink-500 hover:text-pink-600 ${player && player.isShuffling ? 'text-pink-800' : ''}`}
               onClick={player ? player.toggleShuffle : undefined}
              >
                <Shuffle size={18} /><p className="hidden md:block">Shuffle All</p>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                 className="p-1 rounded hover:bg-muted transition ml-2"
                >
                  <div className="bg-pink-500 text-white rounded-full p-3">
                    <Ellipsis size={20} />                    
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>...</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={`/playlist/${id}/edit`}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                    >
                     <span className="flex items-center"><Pencil /></span>
                     <span>Edit Playlist</span>
                    </Link>                    
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/"
                      className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                    >
                     <span className="flex items-center"><Trash2 color="red" /></span>
                     <span>Delete Playlist</span>
                    </Link>                    
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />             
                  <DropdownMenuItem>
                    <Button
                      className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                      onClick={() => {
                         if (!player || songs.length === 0) return;
  
                         const formattedSongs = songs.map((song) => ({
                           id: song.id,
                           title: song.title,
                           artist: song.artists?.name ?? 'Unknown',
                           album: song.albums?.name ?? 'Unknown',
                           image: song.cover_url ?? '/img/default-cover.jpg',
                         src: getAudioUrl(song.audio_url),
                           audio_url: song.audio_url ?? ''
                         }));
  
                         player.setQueue(formattedSongs);
                         player.setCurrentTrack(formattedSongs[0]);
                         player.setIsPlaying(true);
                      }}
                      variant="ghost"
                    >
                     <span className="flex items-center bg-blue-600 rounded-full"><PlayCircle /></span>
                     <span>Play All</span>
                    </Button>                    
                  </DropdownMenuItem>                  
                </DropdownMenuContent>
              </DropdownMenu>              
            </div>
          </div>

          {/* Song List */}
          <ul className="divide-y border-t">
            {songs.map((song) => (
              <li
               key={song.id} 
               className="flex items-center py-4 gap-4"
               onClick={() => {
                 if (!player) return;
                 // Format the queue from the songs list
                 const formattedQueue = songs.map((s) => ({
                   id: s.id,
                   title: s.title,
                   artist: s.artists?.name ?? 'Unknown',
                   image: s.cover_url ?? '/img/default-cover.jpg',
                   src: getAudioUrl(s.audio_url),
                   audio_url: s.audio_url ?? ''
                 }));
                 // Find the index of the clicked song in the songs list
                 const songIdx = songs.findIndex((s) => s.id === song.id);
                 // Set the queue and current track
                 player.setQueue(formattedQueue);
                 player.setCurrentTrack(formattedQueue[songIdx]);
                 player.setIsPlaying(true);
               }}               
              >
                <Image
                  src={song.cover_url}
                  alt={song.title}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {song.artists?.name}
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-500 text-center">
                  {song.albums?.release_year || "2024"}
                </div>
                <div className="w-24 text-sm text-gray-500 text-center">
                  {song.genres?.name || "Afrobeat"}
                </div>
                <div className="w-12 text-sm text-gray-500 text-right">
                  {formatDuration(song.duration)}
                </div>
              </li>
            ))}
          </ul>
         </div> 
        </div>
      {/* Mobile UI */}        
        <div className="block md:hidden">
         <div
          className={`fixed top-0 left-0 mb-3 w-full z-20 bg-white dark:bg-[#020617] transition-colors ${
            scrolled ? "bg-black" : ""
          }`}
         >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button className="text-pink-500 font-semibold text-lg"><Link href="/playlists">&lt; Playlist</Link></button>
            <div className="flex items-center gap-2">
              <button className="p-2"><UserPlus size={22} className="text-pink-500" />
              </button>
              <div className="p-2">
             <DropdownMenu>
               <DropdownMenuTrigger
                className="p-1 rounded hover:bg-muted transition ml-2"
               >
                 <Ellipsis size={20} className="text-pink-500" />
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                 <DropdownMenuLabel>...</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem>
                   <Link
                     href={`/playlist/${id}/edit`}
                     className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                   >
                    <span className="flex items-center"><Pencil /></span>
                    <span>Edit Playlist</span>
                   </Link>                    
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                   <Link
                     href="/"
                     className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                   >
                    <span className="flex items-center"><Trash2 color="red" /></span>
                    <span>Delete Playlist</span>
                   </Link>                    
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />             
                 <DropdownMenuItem>
                   <Button
                     className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                     onClick={() => {
                        if (!player || songs.length === 0) return;
  
                        const formattedSongs = songs.map((song) => ({
                          id: song.id,
                          title: song.title,
                          artist: song.artists?.name ?? 'Unknown',
                          album: song.albums?.name ?? 'Unknown',
                          image: song.cover_url ?? '/img/default-cover.jpg',
                          src: getAudioUrl(song.audio_url),
                          audio_url: song.audio_url ?? ''
                        }));
  
                        player.setQueue(formattedSongs);
                        player.setCurrentTrack(formattedSongs[0]);
                        player.setIsPlaying(true);
                     }}
                     variant="ghost"
                   >
                    <span className="flex items-center bg-blue-600 rounded-full"><PlayCircle /></span>
                    <span>Play All</span>
                   </Button>                    
                 </DropdownMenuItem>             
               </DropdownMenuContent>
             </DropdownMenu>             
              </div>
            </div>
          </div>
         </div>          
          <div className="min-h-screen px-4 mt-20">
            {/* Header */}
            <div className="relative mb-4">
             <input
               className="w-full rounded-lg bg-[#f3f4f6] dark:bg-[#232323] py-2 pl-10 pr-10 dark:placeholder-gray-400 focus:outline-none"
               placeholder="Search"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
             <Mic className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400" size={20} />
            </div>

            <div className="flex items-center justify-center w-full">
              <div className="rounded-2xl bg-gradient-to-br from-green-300 via-gray-400 to-purple-500 h-64 w-60 p-4">
                <h1 className="text-2xl font-bold text-gray-900">{playlist.title}</h1>
              </div>
            </div>            

            {/* Owner */}
            <div className="mt-4">
              <h1 className="text-center text-xl font-bold">{playlist.title}</h1>
              <h2 className="text-center text-lg font-semibold text-pink-500">David Jonah</h2>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6 mb-4">
              <button
               className="flex-1 flex items-center justify-center gap-2 bg-[#f3f4f6] dark:bg-[#181818] rounded-lg py-3 text-pink-500 font-semibold text-lg"
               onClick={() => {
                  if (!player || songs.length === 0) return;
  
                  const formattedSongs = songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    artist: song.artists?.name ?? 'Unknown',
                    album: song.albums?.name ?? 'Unknown',
                    image: song.cover_url ?? '/img/default-cover.jpg',
                    src: getAudioUrl(song.audio_url),
                    audio_url: song.audio_url ?? ''
                  }));
  
                  player.setQueue(formattedSongs);
                  player.setCurrentTrack(formattedSongs[0]);
                  player.setIsPlaying(true);
               }}         
              >
                <Play size={18} />
                Play
              </button>
              <button
               className={`flex-1 flex items-center justify-center gap-2 bg-[#f3f4f6] dark:bg-[#181818] rounded-lg py-3 text-pink-500 font-semibold text-lg ${player && player.isShuffling ? 'text-pink-700 bg-[#d1d2d4] dark:bg-[#1a1919]' : ''}`}
               onClick={player ? player.toggleShuffle : undefined}
              >
                <Shuffle size={18} />
                Shuffle
              </button>
            </div>

            {/* Songs List */}
            <div className="mt-6 space-y-4">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between rounded-lg"
                  onClick={() => {
                    if (!player) return;
                    // Format the queue from the songs list
                    const formattedQueue = songs.map((s) => ({
                      id: s.id,
                      title: s.title,
                      artist: s.artists?.name ?? 'Unknown',
                      image: s.cover_url ?? '/img/default-cover.jpg',
                      src: getAudioUrl(s.audio_url),
                      audio_url: s.audio_url ?? ''
                    }));
                    // Find the index of the clicked song in the songs list
                    const songIdx = songs.findIndex((s) => s.id === song.id);
                    // Set the queue and current track
                    player.setQueue(formattedQueue);
                    player.setCurrentTrack(formattedQueue[songIdx]);
                    player.setIsPlaying(true);
                  }}            
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={song.cover_url}
                      alt={song.title}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artists?.name}</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </div>
              ))}
                <div>
                  <div className="flex items-center gap-3">
                    <button className="bg-gray-600 p-2"><Plus /></button>
                    <div>
                      <p className="text-md font-semibold">Add Music</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-4 mb-2">
                    {songs.length}  Songs, {totalMinutes} hrs {totalSeconds} min
                  </div>
                </div>              
            </div>
          </div>          
        </div>    

        </div>
      ) : (
        <div>Loading playlist...</div>
      )}
    </>
  );
}
