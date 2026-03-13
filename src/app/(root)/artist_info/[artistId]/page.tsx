'use client';
import { apiFetchArtist, apiFetchSongs, apiFollowArtist, apiFetchFollowing, getAudioUrl, type ApiArtist, type ApiSong } from "@/lib/api";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, MoreHorizontal, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayer } from "@/lib/playerContext";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

type Song = ApiSong;

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ArtistInfo({ params }: { params: Promise<{ artistId: string }> }) {
  const player = usePlayer();
  const [artist, setArtist] = useState<ApiArtist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { artistId } = React.use(params);
  const session = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);  

  useEffect(() => {
    const fetchArtistAndSongs = async () => {
      try {
        const artistData = await apiFetchArtist(artistId);
        setArtist(artistData);

        const songsData = await apiFetchSongs({ artistId });
        setSongs(songsData || []);
      } catch (e) {
        setError(String(e));
      }
    };

    fetchArtistAndSongs();
  }, [artistId]);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!session?.user?.id || !artistId) return;
      try {
        const data = await apiFetchFollowing(session.user.id);
        setIsFollowing(data.some((f) => f.artist_id === artistId));
      } catch {
        setIsFollowing(false);
      }
    };
    checkFollowing();
  }, [session, artistId]);

  const handleFollow = async () => {
    if (!session?.user?.id || !artistId) return;
    setLoadingFollow(true);
    try {
      await apiFollowArtist(session.user.id, artistId);
      setIsFollowing(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };  

  if (error) {
    return <div className="p-4 text-red-500">Failed to load artist: {error}</div>;
  }

  return (
    <div className="p-4">
      {artist && (
        <>
            <div className="col-span-10 flex flex-col justify-between">
              <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold md:hidden"><Link href="/artists"><ChevronLeft /></Link></div>
              <section className="w-full mx-auto rounded-xl overflow-hidden">
                {/* Header Section */}
                <div className="relative h-60 md:h-80 w-full">
                  <Image
                    src={artist.image_url || '/utmusic.png'}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">
                    <Avatar className="w-24 h-24 mb-2 rounded-full overflow-hidden">
                      <AvatarImage
                        src={artist.image_url || '/utmusic.png'}
                        alt={artist.name}
                        className="rounded-full w-full h-full object-cover"
                      />
                      <AvatarFallback className="bg-gray-800 text-white">
                        {artist.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>        
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <CheckCircle size={16} className="text-blue-500" />
                      Verified Artist
                    </div>
                    <h1 className=" text-4xl md:text-6xl font-bold leading-tight">{artist.name}</h1>
                    <p className="text-sm mt-1">3,590,023 monthly listeners</p>
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
                          artist: artist?.name ?? 'Unknown',
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
                      variant="outline"
                      className="rounded-full border-white hover:bg-white hover:text-black"
                      disabled={isFollowing || loadingFollow}
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : loadingFollow ? "Following..." : "Follow"}
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
                  <h2 className="text-xl font-semibold mb-4">Popular</h2>
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
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <Card>
                  <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <Avatar className="w-36 h-36">
                      <AvatarImage
                        src={artist.image_url || '/utmusic.png'}
                        alt={artist.name}
                      />
                      <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="text-center md:text-left">
                      <p className="text-lg font-semibold">
                        3,590,023 <span className="text-sm font-normal">monthly listeners</span>
                      </p>
                      <p className="mt-2 text-gray-500 leading-relaxed">
                        {artist.bio || 'No bio available'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

            </div>
        </>
      )}
    </div>
  );
}
