"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiUpdateSong } from "@/lib/api"

interface EditSongFormProps {
  song: {
    id: string
    title: string
    artist_id: string | null
    album_id: string | null
    cover_url?: string
    duration?: number
    artists?: { name: string }
    albums?: { name: string }
  };
  onUpdated: () => void;
}

export function EditSongForm({ song, onUpdated }: EditSongFormProps) {
  const [title, setTitle] = useState(song.title)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    await apiUpdateSong({
      id: song.id,
      title,
      artist_id: song.artist_id ?? undefined,
      album_id: song.album_id ?? undefined,
    })
    setLoading(false)
    onUpdated()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Edit Song</h2>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Song"}
      </Button>
    </div>
  )
}
