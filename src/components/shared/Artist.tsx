"use client";

import { Input } from "@/components/ui/input";
import { apiFetchArtists, type ApiArtist } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LayoutGrid, Plus, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Artist = ApiArtist;

export function Artist() {
  const router = useRouter();  
  const [artists, setArtists] = useState<Artist[]>([])
  const [search, setSearch] = useState("")

  const fetchArtists = async () => {
    const data = await apiFetchArtists();
    setArtists(data || []);
  }

  const handleArtistClick = (artistId: string) => {
    router.push(`/artist_info/${artistId}`);
  };

  useEffect(() => {
    fetchArtists()
  }, [])

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen text-gray-600 p-4 font-sans antialiased">
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Library</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-100 hover:bg-gray-700 rounded-full p-2">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create</span>
          </Button>
          <span className="text-lg font-medium hidden md:inline">Create</span> {/* "Create" text only on medium screens and up */}
        </div>
      </header>

      {/* Navigation and Search Bar */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
           variant="outline" 
           onClick={() => router.push("/")}
           className="rounded-full text-gray-600 hover:bg-opacity-20 px-4 py-2 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Artists
          </Button>
          {/* Add more filter buttons here if needed */}
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Artists"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full text-gray-600 border-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <Button variant="ghost" className="text-gray-600 hover:bg-gray-700 rounded-full p-2">
            <LayoutGrid className="h-6 w-6" />
            <span className="sr-only">Recents</span>
          </Button>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filtered.map((artist) => (
          <div
           key={artist.id}
           onClick={() => handleArtistClick(artist.id)} 
           className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          >
            <Avatar className="w-24 h-24 mb-2 rounded-full overflow-hidden">
              <AvatarImage src={artist.image_url ? artist.image_url : '/utmusic.png'} alt={artist.name} className="object-cover w-full h-full" />
              <AvatarFallback className="bg-gray-700 text-white text-xl">{artist.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{artist.name}</span>
          </div>
        ))}
      </section>
    </div>
  )
}