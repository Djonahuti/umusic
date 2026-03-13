"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetchPlaylist, apiUpdatePlaylist, apiUploadFile } from "@/lib/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditPlaylistPage() {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      try {
        const data = await apiFetchPlaylist(id);
        setTitle(data.title);
        setDescription(data.description || "");
        setImageUrl(data.image_url || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    setLoading(true);
    let uploadedUrl = imageUrl;

    if (file) {
      try {
        const upload = await apiUploadFile(file);
        uploadedUrl = upload.url;
      } catch (err) {
        console.error("Upload failed", err);
        setLoading(false);
        return;
      }
    }

    try {
      await apiUpdatePlaylist({
        id,
        title,
        description: description || undefined,
        image_url: uploadedUrl,
      });
      router.push(`/playlist/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Playlist</h1>

      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Playlist title" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image</label>
        {imageUrl && <Image src={imageUrl} alt="Cover" width={120} height={120} className="rounded" />}
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Playlist"}
      </Button>
    </div>
  );
}
