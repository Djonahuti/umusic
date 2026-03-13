import { GenreTable } from "../genres-table";

export default function AdminGenresPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Genres</h1>
      <GenreTable />
    </div>
  );
}