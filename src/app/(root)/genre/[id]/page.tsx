"use client";

import React, { useState, useEffect } from "react";
import { Play, MoreHorizontal, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apiFetchGenre, apiFetchSongs, getAudioUrl, type ApiSong } from "@/lib/api";
import { usePlayer } from "@/lib/playerContext";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Genre {
  id: string
  name: string
  description: string
  songs: Song[];  
}

type Song = ApiSong;

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function GenreDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: genreId } = React.use(params);    
  const player = usePlayer();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const found = await apiFetchGenre(genreId);
        setGenre({ id: found.id, name: found.name || "", description: found.description || "", songs: [] });
      } catch (e) {
        setError(String(e));
      }
    };
    fetchGenre();
  }, [genreId]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!genreId) return;
      try {
        const data = await apiFetchSongs({ genreId });
        setSongs(data || []);
      } catch (e) {
        setError(String(e));
      }
    };
    fetchSongs();
  }, [genreId]);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load genre: {error}</div>;
  }

  return (
    <div className="p-4">
        {/* Main content */}
        <div className="col-span-10 flex flex-col justify-between">
          <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold md:hidden"><Link href="/genres"><ChevronLeft /></Link></div>
          <section className="w-full mx-auto rounded-xl overflow-hidden">
            {/* Header Section */}
            <div className="relative h-60 md:h-80 w-full">
              <div className="w-[140px] h-[140px] rounded-lg shadow bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-800 text-center px-2">
                  {genre?.name || "Select a Genre"}
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">       
                <h1 className=" text-4xl md:text-6xl font-bold leading-tight">{genre?.name || "Select a Genre"}</h1>
                <p className="text-sm mt-1">Listen</p>
              </div>
            </div>

            {/* Controls */}
            <Card className="bg-gradient-to-t from-black/90 to-[#300000] px-6 py-4">
              <CardContent className="flex flex-wrap items-center gap-4 p-0">
                <Button
                 className="rounded-full bg-green-500 hover:bg-green-600 text-black text-lg font-bold px-6 py-2"
                 onClick={() => {
                    if (!player || songs.length === 0) return;
  
                    const formattedSongs = songs.map((song) => ({
                      id: song.id,
                      title: song.title,
                      artist: song.artists?.name ?? 'Unknown',
                      image: song.cover_url ?? '/img/default-cover.jpg',
                      src: getAudioUrl(song.audio_url),
                      audio_url: song.audio_url ?? ''
                    }));
  
                    player.setQueue(formattedSongs);
                    player.setCurrentTrack(formattedSongs[0]);
                    player.setIsPlaying(true);
                 }}            
                >
                  <Play className="mr-2" size={20} /> Play
                </Button>

                <Button
                  variant="ghost"
                  className="rounded-full text-gray-400 hover:bg-white/10"
                >
                  <MoreHorizontal size={20} />
                </Button>
              </CardContent>
            </Card>

            {/* Popular Songs */}
            <div className="px-6 pb-6">
              <h2 className="text-xl font-semibold mb-4">Tracks</h2>
              <div className="space-y-3">
              {songs.map((song) => (
                <div key={song.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">{song.track_no ?? 0}</span>
                    <Image
                      src={song.cover_url || "/utmusic.png"}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="rounded-sm"
                    />
                    <span className="font-medium text-gray-500 text-sm">
                      {song.title}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
                    <span>{song.plays ?? 0}+ plays</span>
                    <span>{song.duration ? formatDuration(song.duration) : 'N/A'}</span>
                  </div>
                </div>
              ))}    
              </div>
            </div>
          </section>

          {/* Footer Bio */}
          <section className="w-full mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Genre History</h2>
            <Card>
              <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
                <Avatar className="w-36 h-36">
                  <AvatarFallback>{genre?.name}</AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left">
                  <p className="text-lg font-semibold">
                    3,590,023 <span className="text-sm font-normal">monthly listeners</span>
                  </p>
                  <p className="mt-2 text-gray-500 leading-relaxed">
                    {genre?.description || "Explore music by genre"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
    </div>
  );
}
