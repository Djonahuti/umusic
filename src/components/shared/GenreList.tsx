"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchGenres } from "@/lib/api";

interface Genre {
  id: string
  name: string
  description: string 
}

export default function GenreList() {
  const router = useRouter();  
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await apiFetchGenres();
      if (data) setGenres(data as Genre[]);
    };
    fetchGenres();
  }, []);  

  const handleGenreClick = (genreId: string) => {
    router.push(`/genre/${genreId}`);
  };

  return (
    <div className="p-4 space-y-4">
      {genres.length === 0 ? (
        <p>Nothing to see.</p>
      ) : (
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li
             key={genre.id} className="border p-3 rounded shadow"
             onClick={() => handleGenreClick(genre.id)}
            >
              <h2 className="font-semibold">{genre.name}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
