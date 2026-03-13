'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePlayer } from '@/lib/playerContext';
import Image from 'next/image';
import { FastForward, ListOrdered, Shuffle, MoreHorizontal, Pause, Play, Rewind, Star, Repeat1, Repeat } from 'lucide-react';
import { TimeProgress } from '../TimeProgress';
import { VolBar } from '../VolBar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}


const NowPlaying: React.FC = () => {
  const player = usePlayer()

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack, duration, currentTime, repeatMode, toggleRepeat } = player;  

  if (!player) return null
  const { isPlaying, togglePlay, playNext, playPrev } = player

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
    {/* Blurred Background Image */}
    {currentTrack.image && (
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${currentTrack.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px)',
          opacity: 0.8,
        }}
      />
    )}
    {/* Overlay for fallback color */}
    <div className="absolute inset-0 z-0 bg-[#d7e9e7] opacity-20" />

    {/* Main Content */}
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Top Bar Indicator */}
      <div className="w-12 h-1.5 rounded-full bg-gray-500 opacity-40 mb-4" />

      {/* Album Art */}
      <div className="w-72 h-72 rounded-xl overflow-hidden shadow-lg mb-6">
       {currentTrack.image ? (
        <Image src={currentTrack.image} alt="cover" width={288} height={288} className="object-cover" />
       ):(
        <Image src="/utmusic.png" alt="default cover" width={288} height={288} className="object-cover" />
       )}  
      </div>

      {/* Song Info */}
      <div className="w-full max-w-md text-center mb-4">
        <h2 className="text-xl font-semibold flex items-center justify-center gap-1">
          {currentTrack.title} <span className="text-xs border border-white px-1 py-0.5 rounded">E</span>
        </h2>
        <p className="text-sm text-gray-600">{currentTrack.artist}</p>
      </div>

      {/* Controls */}
      <div className="w-full flex justify-between mb-4">
        <Button variant="ghost" size="icon">
          <Star className="w-5 h-5 dark:text-gray-200 text-black" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
           className="p-1 rounded hover:bg-muted transition ml-2"
          >
         <MoreHorizontal className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Go To Artist</DropdownMenuItem> 
            <DropdownMenuItem>Go To Album</DropdownMenuItem>     
          </DropdownMenuContent>
        </DropdownMenu> 
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <div className="w-full">
        <TimeProgress />
        </div>
        <div className="w-full flex justify-between text-xs dark:text-gray-200 text-black mt-1">
          <span>{formatTime(currentTime)}</span>
          <span className="bg-gray-700 text-white text-[10px] px-2 py-0.5 rounded">Lossless</span>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <Button onClick={playPrev} variant="ghost" size="icon">
          <Rewind className="w-7 h-7 dark:text-gray-200 text-black" />
        </Button>
        <Button onClick={togglePlay} variant="ghost" size="icon">
          {isPlaying ? <Pause className="w-25 h-25" /> : <Play className="w-25 h-25" />}
        </Button>
        <Button onClick={playNext} variant="ghost" size="icon">
          <FastForward className="w-7 h-7 dark:text-gray-200 text-black" />
        </Button>
      </div>

      {/* Volume Bar */}
      <div className="w-full max-w-md flex items-center gap-2 mb-6">
        <VolBar />
      </div>

      {/* Bottom Icons */}
      <div className="flex justify-between items-center w-full max-w-md px-4 text-gray-600">
        <Shuffle
         className={`w-5 h-5 cursor-pointer transition ${player.isShuffling ? 'text-pink-500' : ''}`}
         onClick={player.toggleShuffle}
        />
      <Button
       variant="ghost" size="icon"
       onClick={toggleRepeat}
        className={`cursor-pointer transition ${
          repeatMode !== 'off' ? 'text-pink-500' : ''
        }`}
        aria-label="Toggle repeat"       
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-5 h-5" />
        ) : (
          <Repeat className="w-5 h-5" />
        )}
      </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
           className="p-1 rounded hover:bg-muted transition ml-2"
          >
         <ListOrdered className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Up Next</DropdownMenuLabel>
            <DropdownMenuSeparator />             
        {player?.queue && player.queue.length > 0 ? (
          player.queue.map((track, idx) => {
           const isCurrent = player.currentTrack?.id === track.id;
           return (
           <React.Fragment key={track.id + '-' + idx}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
             className={`flex items-center gap-2 cursor-pointer ${isCurrent ? 'bg-accent text-accent-foreground' : ''}`}
             onClick={() => player.setCurrentTrack(track)}
            >
              <img
                src={track.image}
                alt={track.title}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium">{track.title}</span>
                <span className="truncate text-xs text-muted-foreground">{track.artist}</span>
              </div>
            </DropdownMenuItem>
            </React.Fragment>
          );
})
        ) : (
          <DropdownMenuItem className="text-muted-foreground">Queue is empty</DropdownMenuItem>
        )}       
            <DropdownMenuItem
             className="text-red-500 flex items-center justify-center"
             onClick={() => player.setQueue([])}
            >
              Clear
            </DropdownMenuItem>     
          </DropdownMenuContent>
        </DropdownMenu> 
      </div>
      </div>
    </div>
  );
};

export default NowPlaying;