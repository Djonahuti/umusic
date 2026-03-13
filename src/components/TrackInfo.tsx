// TrackInfo.tsx
'use client'
import { usePlayer } from '@/lib/playerContext'
import Image from 'next/image'
import { Timeline } from './Timeline';
import { Button } from './ui/button';
import { Repeat, Repeat1, Shuffle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import MiniPlayer from './shared/MiniPlayer';

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const TrackInfo = () => {
  const player = usePlayer();

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack, duration, currentTime, repeatMode, toggleRepeat  } = player;

  return (
    <div className="flex items-center gap-3 max-w-lg w-full p-2">
     {currentTrack.image ? (
      <Dialog>
        <DialogTrigger asChild>
          <Image
            src={currentTrack.image}
            alt="cover"
            width={40}
            height={40}
            className="rounded-sm cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent
         className="p-0 bg-transparent shadow-none border-none"
        >
          <DialogHeader>
            <DialogTitle className='hidden'>-</DialogTitle>
          </DialogHeader>          
          <MiniPlayer />
        </DialogContent>
      </Dialog>
     ):(
      <Image src="/utmusic.png" alt="default cover" width={40} height={40} className="rounded-sm" />
     )}
      <Button
       variant="ghost" size="icon"
       onClick={player.toggleShuffle}
       className={`cursor-pointer transition ${player.isShuffling ? 'text-pink-500' : ''}`}
      >
        <Shuffle className="w-4 h-4" />
      </Button>
      <div className="flex flex-col text-center flex-grow">
        <div className="text-sm font-semibold leading-none truncate">
          {currentTrack.title}
        </div>
        <div className="text-xs leading-none text-gray-500 truncate">
          {currentTrack.artist}
        </div>
        <div className="flex items-center gap-2 justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <div className="relative w-full h-1 bg-gray-300 rounded-full">
           <Timeline /> 
          </div>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>
      <Button
       variant="ghost" size="icon"
       onClick={toggleRepeat}
        className={`cursor-pointer transition ${
          repeatMode !== 'off' ? 'text-pink-500' : ''
        }`}
        aria-label="Toggle repeat"       
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-4 h-4" />
        ) : (
          <Repeat className="w-4 h-4" />
        )}
      </Button>           
    </div>
  )
}
