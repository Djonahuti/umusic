import { SongTable } from "../songs-table";

export default function AdminSongsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Songs</h1>
      <SongTable />
    </div>
  );
}