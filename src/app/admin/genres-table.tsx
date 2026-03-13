"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetchGenres, apiUpdateGenre, apiDeleteGenre } from "@/lib/api";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddGenreForm } from "./add-genre-form";

interface Genre {
  id: string
  name: string
  description: string
}

export function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Genre | null>(null)

  const fetchGenres = async () => {
    const data = await apiFetchGenres();
    setGenres((data || []) as Genre[]);
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const handleDelete = async (id: string) => {
    await apiDeleteGenre(id);
    fetchGenres()
  }

  const handleEdit = (genre: Genre) => {
    setEditing(genre)
  }

  const onSubmit = async (values: Genre) => {
    if (!editing?.id) return;
    await apiUpdateGenre({ id: editing.id, name: values.name, description: values.description });
    setEditing(null)
    fetchGenres()
  }

  const filtered = genres.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  const { register, handleSubmit, reset } = useForm<Genre>({
    defaultValues: editing || { name: "", description: "", id: "" }
  })

  useEffect(() => {
    if (editing) reset(editing)
  }, [editing, reset])

  return (
    <div className="space-y-4">
     <div className="flex justify-between items-center">
      <Input placeholder="Search genres..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Genre</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Genre</DialogTitle>
            </DialogHeader>
            <DialogDescription>Fill Correctly</DialogDescription>
            <AddGenreForm onAdded={fetchGenres} />
          </DialogContent>
        </Dialog>
       </div> 
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((genre) => (
            <TableRow key={genre.id} className="border-t">
              <TableCell>{genre.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{genre.description}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(genre)}>
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Genre</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Fill Correctly</DialogDescription>                                  
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input {...register("name")} placeholder="Name" />
                      <Input {...register("description")} placeholder="Description" />
                      <Button type="submit">Update Genre</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleDelete(genre.id)} variant="ghost" size="icon">
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}