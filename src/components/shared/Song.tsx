"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetchSongs, apiFetchLikesForUser, apiLikeSong, apiUnlikeSong, getAudioUrl } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, List, Mic, Play, PlayCircle, Shuffle } from "lucide-react";
import { addSongToPlaylist, createPlaylist, fetchUserPlaylists } from "@/lib/actions";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { usePlayer } from "@/lib/playerContext";
import { Button } from "../ui/button";

interface Song {
  id: string
  title: string
  artist_id: string | null
  album_id: string | null
  cover_url: string
  duration: number
  artists: { name: string };
  albums: { name: string };
  genres: { name: string };
  plays: number;
  audio_url: string;
}

interface Playlist {
  id: string;
  title: string;
  description?: string | null;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Song() {
  const player = usePlayer();
  const [songs, setSongs] = useState<Song[]>([])
  const [search, setSearch] = useState("")
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);   
  const user = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [loadingLike, setLoadingLike] = useState<Record<string, boolean>>({});

  const fetchSongs = async () => {
    try {
      const data = await apiFetchSongs();
      setSongs((data || []) as unknown as Song[]);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const filtered = songs.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (user && user.user && user.user.id) {
      fetchUserPlaylists(user.user.id)
        .then((list) => setPlaylists(list as Playlist[]))
        .catch(console.error);
    }
  }, [user]);  

  const handleAddToPlaylist = async (playlistId: string, songId: string) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.success("Song added to playlist");
    } catch {
      toast.error("Failed to add song");
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle || !user?.user?.id) return;
    try {
      const playlist = await createPlaylist(user.user.id, newPlaylistTitle);
      setPlaylists([playlist as Playlist, ...playlists]);
      setCreatingPlaylist(false);
      setNewPlaylistTitle("");
      toast.success("Playlist created");
    } catch {
      toast.error("Failed to create playlist");
    }
  };

  // Group songs by first letter for mobile alpha list
  const groupedSongs = filtered.reduce((acc: Record<string, Song[]>, song) => {
    const letter = song.title[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(song);
    return acc;
  }, {});

  const alpha = Object.keys(groupedSongs).sort();  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePlayNext = (song: Song) => {
    if (!player) return;
    const formattedSong = {
      id: song.id,
      title: song.title,
      artist: song.artists?.name ?? 'Unknown',
      image: song.cover_url ?? '/img/default-cover.jpg',
      src: getAudioUrl(song.audio_url),
      audio_url: song.audio_url ?? ''
    };
    player.setQueue((prevQueue) => {
      // Remove if already in queue
      const filtered = prevQueue.filter((s) => s.id !== song.id);
      // Find current track index
      const currentIdx = filtered.findIndex((s) => s.id === player.currentTrack.id);
      // Insert after current track
      const insertIdx = currentIdx === -1 ? 0 : currentIdx + 1;
      return [
        ...filtered.slice(0, insertIdx),
        formattedSong,
        ...filtered.slice(insertIdx)
      ];
    });
    toast.success("Song added to play next!");
  };

  const handlePlayLater = (song: Song) => {
    if (!player) return;
    const formattedSong = {
      id: song.id,
      title: song.title,
      artist: song.artists?.name ?? 'Unknown',
      image: song.cover_url ?? '/img/default-cover.jpg',
      src: getAudioUrl(song.audio_url),
      audio_url: song.audio_url ?? ''
    };
    player.setQueue((prevQueue) => {
      // Remove if already in queue
      const filtered = prevQueue.filter((s) => s.id !== song.id);
      // Add to end
      return [...filtered, formattedSong];
    });
  };  

  useEffect(() => {
    const checkLiked = async () => {
      if (!user || !user.user || songs.length === 0) return;
      const songIds = songs.map(s => s.id);
      const likedMap: Record<string, boolean> = {};
      try {
        const data = await apiFetchLikesForUser(user.user.id, songIds);
        data.forEach((like) => {
          likedMap[like.song_id] = true;
        });
      } catch (err) {
        console.error("Error fetching likes:", err);
      }  
      setIsLiked(likedMap);  
    };
    checkLiked();
  }, [user, songs]);

  const toggleLike = async (songId: string) => {
    if (!user || !user.user) return;
    setLoadingLike(prev => ({ ...prev, [songId]: true }));

    const liked = isLiked[songId];
    try {
      if (liked) {
        await apiUnlikeSong(user.user.id, songId);
      } else {
        await apiLikeSong(user.user.id, songId);
      }
      setIsLiked(prev => ({ ...prev, [songId]: !liked }));
      toast.success(liked ? "Removed from likes" : "Added to likes");
    } catch (err) {
      console.error("Failed to update like:", err);
      toast.error("Failed to update like");
    }
    setLoadingLike(prev => ({ ...prev, [songId]: false }));
  };

  return (
   <div className="space-y-4">
      {/* Desktop UI */}    
    <div className="hidden md:block">
      <div className="flex justify-between items-center">
        <Input placeholder="Search songs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button
          className="flex items-center gap-2 py-2 cursor-pointer"
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
         <span className="flex items-center bg-blue-600 rounded-full text-2xl"><PlayCircle /></span>
         <span className="hover:text-blue-600">Play All</span>
        </Button>        
      </div>
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Plays</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((song) => (
            <TableRow
             key={song.id} 
             className="border-t group"
             onMouseEnter={() => setHoveredRow(song.id)}
             onMouseLeave={() => setHoveredRow(null)}
             onClick={() => {
               if (!player) return;
               // Format the queue from the filtered list
               const formattedQueue = filtered.map((s) => ({
                 id: s.id,
                 title: s.title,
                 artist: s.artists?.name ?? 'Unknown',
                 image: s.cover_url ?? '/img/default-cover.jpg',
                 src: getAudioUrl(s.audio_url),
                 audio_url: s.audio_url ?? ''
               }));
               // Find the index of the clicked song in the filtered list
               const songIdx = filtered.findIndex((s) => s.id === song.id);
               // Set the queue and current track
               player.setQueue(formattedQueue);
               player.setCurrentTrack(formattedQueue[songIdx]);
               player.setIsPlaying(true);
             }}             
            >
              <TableCell>
                <Image
                  src={song.cover_url}
                  alt="song cover"
                  className="w-10 h-10 object-cover rounded"
                  width={40}
                  height={40}
                />
              </TableCell>
              <TableCell className="relative">
                <span>{song.title}</span>
                {(hoveredRow === song.id || openDropdown === song.id) && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <DropdownMenu
                      open={openDropdown === song.id}
                      onOpenChange={(open) => setOpenDropdown(open ? song.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                         className="p-1 rounded hover:bg-muted transition ml-2"
                         onClick={e => e.stopPropagation()}
                        >
                          <Ellipsis size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                       align="end"
                       onClick={e => e.stopPropagation()}
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                           onClick={() => toggleLike(song.id)}
                           disabled={loadingLike[song.id]}
                          >
                            {loadingLike[song.id]
                              ? "Loading..."
                              : isLiked[song.id]
                                ? "Remove from Favorite"
                                : "Add to Favorite"
                            }
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Add to Playlist</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {playlists.map((p) => (
                                  <DropdownMenuItem key={p.id} onClick={() => handleAddToPlaylist(p.id, song.id)}>
                                    {p.title}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                {creatingPlaylist ? (
                                  <div className="flex items-center gap-2 px-2">
                                    <input
                                      type="text"
                                      className="border rounded p-1 text-sm w-full"
                                      value={newPlaylistTitle}
                                      onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                      placeholder="New Playlist"
                                    />
                                    <button onClick={handleCreatePlaylist} className="text-xs text-blue-500">Add</button>
                                  </div>
                                ) : (
                                  <DropdownMenuItem onClick={() => setCreatingPlaylist(true)}>
                                    + Create New Playlist
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => handlePlayNext(song)}>Play Next</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePlayLater(song)}>Play Later</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </span>
                )}                
              </TableCell>
              <TableCell className="max-w-[150px] truncate">{song.artists?.name ?? '—'}</TableCell>
              <TableCell className="max-w-[150px] truncate">{song.albums?.name ?? '—'}</TableCell>
              <TableCell>{song.genres?.name ?? '—'}</TableCell>
              <TableCell>{formatDuration(song.duration ?? 0)}</TableCell>
              <TableCell>{song.plays ?? 0}</TableCell>             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

      {/* Mobile UI */}
    <div className="block md:hidden">
      {/* Header */}
     <div
      className={`fixed top-0 left-0 mb-3 w-full z-20 bg-white dark:bg-[#020617] transition-colors ${
        scrolled ? "bg-black" : ""
      }`}
     >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button className="text-pink-500 font-semibold text-lg"><Link href="/">&lt; Library</Link></button>
        <div className="flex items-center gap-2">
          <button className="p-2"><List size={22} className="text-pink-500" />
          </button>
          <button className="p-2"><Ellipsis size={22} className="text-pink-500" /></button>
        </div>
      </div>
     </div> 

      <div className="px-4 mt-15">
        <h1 className="text-3xl font-bold mb-2">Songs</h1>
        {/* Search */}
        <div className="relative mb-4">
          <input
            className="w-full rounded-lg bg-[#f3f4f6] dark:bg-[#232323] py-2 pl-10 pr-10 dark:placeholder-gray-400 focus:outline-none"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Mic className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400" size={20} />
        </div>
        {/* Play/Shuffle */}
        <div className="flex gap-4 mb-4">
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
            <Play size={22} fill="currentColor" className="mr-1" /> Play
          </button>
          <button 
          className={`flex-1 flex items-center justify-center gap-2 bg-[#f3f4f6] dark:bg-[#181818] rounded-lg py-3 text-pink-500 font-semibold text-lg ${player && player.isShuffling ? 'text-pink-700 bg-[#d1d2d4] dark:bg-[#1a1919]' : ''}`}
          onClick={player ? player.toggleShuffle : undefined}
          >
            <Shuffle size={22} className="mr-1" /> Shuffle
          </button>
        </div>
      </div>
      {/* Song List */}
      <div className="overflow-y-auto pb-24">
        {alpha.map(letter => (
          <div key={letter}>
            <div className="px-4 py-2 text-pink-500 font-bold text-lg">{letter}</div>
            {groupedSongs[letter].map(song => (
              <div
               key={song.id} 
               className="flex items-center px-4 py-2 hover:bg-[#232323] transition group"
               onClick={() => {
                 if (!player) return;
                 // Format the queue from the filtered list
                 const formattedQueue = filtered.map((s) => ({
                   id: s.id,
                   title: s.title,
                   artist: s.artists?.name ?? 'Unknown',
                   image: s.cover_url ?? '/img/default-cover.jpg',
                   src: getAudioUrl(s.audio_url),
                   audio_url: s.audio_url ?? ''
                 }));
                 // Find the index of the clicked song in the filtered list
                 const songIdx = filtered.findIndex((s) => s.id === song.id);
                 // Set the queue and current track
                 player.setQueue(formattedQueue);
                 player.setCurrentTrack(formattedQueue[songIdx]);
                 player.setIsPlaying(true);
               }}               
              >
                <Image
                  src={song.cover_url}
                  alt="cover"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-gray-400 text-sm truncate">{song.artists?.name ?? '—'}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2 p-2 rounded-full hover:bg-[#181818] transition">
                   <Ellipsis size={22} className="text-gray-300" 
                    onClick={e => e.stopPropagation()}
                   />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    sideOffset={4}
                    onClick={e => e.stopPropagation()}
                  >
                   <DropdownMenuGroup>
                     <DropdownMenuItem
                      onClick={() => toggleLike(song.id)}
                      disabled={loadingLike[song.id]}
                     >
                       {loadingLike[song.id]
                         ? "Loading..."
                         : isLiked[song.id]
                           ? "Remove from Favorite"
                           : "Add to Favorite"
                       }
                     </DropdownMenuItem>
                     <DropdownMenuSub>
                       <DropdownMenuSubTrigger>Add to Playlist</DropdownMenuSubTrigger>
                       <DropdownMenuPortal>
                         <DropdownMenuSubContent>
                           {playlists.map((p) => (
                             <DropdownMenuItem key={p.id} onClick={() => handleAddToPlaylist(p.id, song.id)}>
                               {p.title}
                             </DropdownMenuItem>
                           ))}
                           <DropdownMenuSeparator />
                           {creatingPlaylist ? (
                             <div className="flex items-center gap-2 px-2">
                               <input
                                 type="text"
                                 className="border rounded p-1 text-sm w-full"
                                 value={newPlaylistTitle}
                                 onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                 placeholder="New Playlist"
                               />
                               <button onClick={handleCreatePlaylist} className="text-xs text-blue-500">Add</button>
                             </div>
                           ) : (
                             <DropdownMenuItem onClick={() => setCreatingPlaylist(true)}>
                               + Create New Playlist
                             </DropdownMenuItem>
                           )}
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>More...</DropdownMenuItem>
                         </DropdownMenuSubContent>
                       </DropdownMenuPortal>
                     </DropdownMenuSub>
                     <DropdownMenuItem onClick={() => handlePlayNext(song)}>Play Next</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handlePlayLater(song)}>Play Later</DropdownMenuItem>
                   </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Alpha index (right side) */}
      <div className="fixed right-1 top-32 flex flex-col items-center z-10">
        {alpha.map(letter => (
          <span key={letter} className="text-pink-500 text-xs py-0.5">{letter}</span>
        ))}
      </div>
    </div>      

   </div>
  )
}