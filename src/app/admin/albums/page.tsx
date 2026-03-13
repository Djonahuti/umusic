import { AlbumTable } from "../albums-table";

export default function AdminAlbumsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Albums</h1>
      <AlbumTable />
    </div>
  );
}
