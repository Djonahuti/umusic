import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconPlayerSkipBack } from '@tabler/icons-react'
import { usePlayer } from '@/lib/playerContext'

export const PlayerControls = () => {
  const player = usePlayer()
  if (!player) return null
  const { isPlaying, togglePlay, playNext, playPrev } = player

  return (
    <div className="flex items-center gap-4">
      <button onClick={playPrev}>
        <IconPlayerSkipBack size={24} />
      </button>
      <button onClick={togglePlay}>
        {isPlaying ? <IconPlayerPause size={32} /> : <IconPlayerPlay size={32} />}
      </button>
      <button onClick={playNext}>
        <IconPlayerSkipForward size={24} />
      </button>
    </div>
  )
}
