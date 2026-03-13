"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetchArtists, apiFetchGenres, apiUploadFile, apiCreateAlbum } from "@/lib/api"
import { useState, ChangeEvent, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

type FormValues = {
  name: string
  artist_id: string
  genre_id: string
  release_year: string
  info: string
}

export function AddAlbumForm({ onAdded }: { onAdded: () => void }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      artist_id: "",
      genre_id: "",
      release_year: "",
      info: "",
    },
    mode: "onSubmit",
  })  
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([])
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch artists and genres from PHP API
    apiFetchArtists().then((data) => {
      setArtists(data.map(a => ({ id: a.id, name: a.name })))
    }).catch(console.error)

    apiFetchGenres().then((data) => {
      setGenres(data.map(g => ({ id: g.id, name: g.name || "" })))
    }).catch(console.error)
  }, [])

  async function onSubmit(values: FormValues) {
    setLoading(true)

    // 1. Upload cover to PHP backend (audio folder)
    let coverUrl = ""
    if (coverFile) {
      try {
        const upload = await apiUploadFile(coverFile)
        coverUrl = upload.url
      } catch (err) {
        console.error("Cover upload failed:", err)
        alert("Cover upload failed")
        setLoading(false)
        return
      }
    }

    // 2. Insert into albums table via PHP API
    await apiCreateAlbum({
      name: values.name,
      artist_id: values.artist_id,
      genre_id: values.genre_id,
      release_year: values.release_year,
      info: values.info,
      cover_url: coverUrl,
    })

    setArtists([])
    setGenres([])
    setCoverFile(null)
    reset()
    setLoading(false)
    onAdded()
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-medium">Add Album</h2>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <Input placeholder="Name" {...field} />
        )}
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}

      <Controller
        name="artist_id"
        control={control}
        rules={{ required: "Artist is required" }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={loading}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Artist" />
           </SelectTrigger> 
            <SelectContent>
              <SelectGroup>
            {artists.map((artist) => (
              <SelectItem key={artist.id} value={artist.id}>
                {artist.name}
              </SelectItem>
            ))}                
              </SelectGroup>  
            </SelectContent>
          </Select>
        )}
      />
      {errors.artist_id && <div className="text-red-500">{errors.artist_id.message}</div>}

      <Controller
        name="info"
        control={control}
        rules={{ required: "Info is required" }}
        render={({ field }) => (
          <Textarea placeholder="Info" {...field} />
        )}
      />
      {errors.info && <div className="text-red-500">{errors.info.message}</div>}

      <Controller
        name="genre_id"
        control={control}
        rules={{ required: "Genre is required" }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={loading}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose Genre" />
           </SelectTrigger> 
            <SelectContent>
              <SelectGroup>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}                
              </SelectGroup>  
            </SelectContent>
          </Select>
        )}
      />
      {errors.genre_id && <div className="text-red-500">{errors.genre_id.message}</div>}      

      <Controller
        name="release_year"
        control={control}
        rules={{ required: "A year is required" }}
        render={({ field }) => (
          <Input placeholder="Year" {...field} />
        )}
      />
      {errors.release_year && <div className="text-red-500">{errors.release_year.message}</div>}

      <Input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverFile(e.target.files?.[0] || null)} />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Album"}
      </Button>
    </form>
  )
}