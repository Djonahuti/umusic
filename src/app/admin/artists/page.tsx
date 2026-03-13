import { ArtistTable } from "../artists-table";

export default function AdminArtistsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Artists</h1>
      <ArtistTable />
    </div>
  );
}