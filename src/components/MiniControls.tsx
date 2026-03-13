import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward } from '@tabler/icons-react'
import { usePlayer } from '@/lib/playerContext'

export const MiniControls = () => {
  const player = usePlayer()
  if (!player) return null
  const { isPlaying, togglePlay, playNext } = player

  return (
    <div className="flex items-center gap-4">
      <button onClick={togglePlay}>
        {isPlaying ? <IconPlayerPause size={32} /> : <IconPlayerPlay size={32} />}
      </button>
      <button onClick={playNext}>
        <IconPlayerSkipForward size={24} />
      </button>
    </div>
  )
}
