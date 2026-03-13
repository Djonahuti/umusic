// TrackInfo.tsx
'use client'
import { usePlayer } from '@/lib/playerContext'
import Image from 'next/image'

export const MiniInfo = () => {
  const player = usePlayer();

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack } = player;

  return (
    <div className="flex items-center gap-3 max-w-lg w-full p-2">
     {currentTrack.image ? (
      <Image src={currentTrack.image} alt="cover" width={40} height={40} className="rounded-sm" />
     ):(
      <Image src="/utmusic.png" alt="default cover" width={40} height={40} className="rounded-sm" />
     )}   
      <div className="flex flex-col text-center flex-grow">
        <div className="text-sm font-semibold leading-none truncate">
          {currentTrack.title}
        </div>
        <div className="text-xs leading-none text-gray-500 truncate">
          {currentTrack.artist}
        </div>
      </div>         
    </div>
  )
}
