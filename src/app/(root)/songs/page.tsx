import { Song } from "@/components/shared/Song";


export default function SongsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 hidden md:block">Songs</h1>
        <Song />
    </div>
  );
}