
'use client'
import { useRef, useState } from 'react'
import { usePlayer } from '@/lib/playerContext'
import { IconVolume2, IconVolume3 } from '@tabler/icons-react'
import { Progress } from './ui/progress'
import { Volume2 } from 'lucide-react'

export const VolBar = () => {
  const player = usePlayer()
  const audioRef = player?.audioRef
  const [volume, setVolume] = useState(100)
  const barRef = useRef<HTMLDivElement>(null)  

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newVolume = Math.round((clickX / rect.width) * 100)
    setVolume(newVolume)
    if (audioRef?.current) audioRef.current.volume = newVolume / 100
  }
  const VolumeIcon = volume === 0 ? IconVolume3 : volume < 50 ? IconVolume2 : IconVolume2

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <VolumeIcon size={20} />
      <div
        ref={barRef}
        className="flex-1 cursor-pointer"
        onClick={handleBarClick}
      >
        <Progress value={volume} className="h-2 bg-gray-500" />
      </div>
      <Volume2 className="w-5 h-5" />
    </div>
  )
}