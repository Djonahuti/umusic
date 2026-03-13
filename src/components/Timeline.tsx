'use client'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/lib/playerContext'
import { Progress } from './ui/progress'

export const Timeline = () => {
  const player = usePlayer()
  const audioRef = player?.audioRef
  const [progress, setProgress] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)  

  useEffect(() => {
    const audio = audioRef?.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [audioRef])

  // Allow seeking by clicking the progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef?.current
    if (!audio || !progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percent = Math.min(Math.max(clickX / width, 0), 1)
    audio.currentTime = percent * audio.duration
    setProgress(percent * 100)
  }

  return (
    <div
      ref={progressBarRef}
      onClick={handleSeek}
      style={{ cursor: 'pointer', width: '160px' }}
    >
      <Progress value={progress} className="h-[3px] rounded-lg accent-gray-500" />
    </div>
  )
}
