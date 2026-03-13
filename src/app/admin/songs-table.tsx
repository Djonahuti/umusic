"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiFetchSongs, apiDeleteSong } from "@/lib/api";
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { AddSongForm } from "./add-song-form"
import { EditSongForm } from "./edit-song-form"

type Song = {
  id: string
  title: string
  artist_id: string | null
  album_id: string | null
  cover_url?: string
  duration?: number
  artists?: { name: string }
  albums?: { name: string }
}

export function SongTable() {
  const [songs, setSongs] = useState<Song[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchSongs()
  }, [])

  async function fetchSongs() {
    const data = await apiFetchSongs();
    setSongs((data || []) as Song[]);
  }

  async function deleteSong(id: string) {
    await apiDeleteSong(id);
    fetchSongs()
  }

  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Song</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Song</DialogTitle>
            </DialogHeader>
            <DialogDescription>Fill Correctly</DialogDescription>
            <AddSongForm onAdded={fetchSongs} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((song) => (
            <TableRow key={song.id}>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artists?.name ?? '—'}</TableCell>
              <TableCell>{song.albums?.name ?? '—'}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <EditSongForm song={song} onUpdated={fetchSongs} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSong(song.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}