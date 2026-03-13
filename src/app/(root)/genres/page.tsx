import { Genre } from "@/components/shared/Genre";
import GenreList from "@/components/shared/GenreList";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


export default function GenresPage() {
  return (
    <div>
      <div className="flex items-center justify-between px-8 py-2 bg-background border-b space-x-5 md:hidden">
        <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold"><Link href="/"><ChevronLeft /></Link></div>
        <h1 className="text-xl font-semibold mb-2">Genres</h1>
      </div> 
      <div className="md:hidden">
        <GenreList />
      </div>
      <div className="hidden md:block">    
        <h1 className="text-xl font-semibold mb-4">Genres</h1>
        <Genre />
      </div> 
    </div>
  );
}