'use client'
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { usePlayer } from '@/lib/playerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Search,
} from "lucide-react"
import { TimeProgress } from "../TimeProgress";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}


export default function MiniPlayer() {
  const player = usePlayer()

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack, duration, currentTime } = player;  

  if (!player) return null
  const { isPlaying, togglePlay, playNext, playPrev } = player

  return (
    <>
      <div className="p-4 w-[340px] bg-white rounded-2xl shadow-xl">
        <div className="relative">
           {currentTrack.image ? (
            <Image src={currentTrack.image} alt="cover" width={288} height={288} className="rounded-xl w-full h-auto object-cover" />
           ):(
            <Image src="/utmusic.png" alt="default cover" width={288} height={288} className="rounded-xl w-full h-auto object-cover" />
           )}           
          <h3 className="mt-2 text-center font-bold text-lg text-black">{currentTrack.title}</h3>
          <p className="text-center text-sm text-gray-600">{currentTrack.artist}</p>

          <div className="mt-3">
            <TimeProgress />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Volume2 className="text-black w-5 h-5" />
            <Button onClick={playPrev} variant="ghost" size="icon">
                <SkipBack className="text-black w-5 h-5" />
            </Button>
            <button onClick={togglePlay}>
              {isPlaying ? 
                <Pause className="text-black w-6 h-6" />
              :
                <Play className="text-black w-6 h-6" />
              }
            </button>
            <Button onClick={playNext} variant="ghost" size="icon">
                <SkipForward className="text-black w-5 h-5" />
            </Button> 
            <Search className="text-black w-5 h-5" />
          </div>
        </div>
      </div>
    </>
  )
}
