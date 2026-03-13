'use client'
import { usePlayer } from '@/lib/playerContext'


type Track = {
  id: string
  title: string
  artist: string
  src: string
  image: string
  audio_url: string
}

export function Playlist () {
  const player = usePlayer()
  if (!player) return null
  const { setCurrentTrack, tracks } = player

  const handleTrackSelect = (selectedTrack: Track) => {
    if (!player) return;

    player.setQueue(tracks); // Set the queue to current playlist
    setCurrentTrack(selectedTrack);
    // setIsPlaying(true) // Removed because setIsPlaying does not exist
  }

  return (
    <div className="p-4 space-y-2">
      {player.tracks.map((track, idx) => (
        <div key={idx} onClick={() => handleTrackSelect(track)} className="cursor-pointer hover:bg-muted rounded p-2">
          <span className="block text-sm font-medium">{track.title}</span>
          <span className="block text-xs text-muted-foreground">{track.artist}</span>
        </div>
      ))}
    </div>
  )
}
