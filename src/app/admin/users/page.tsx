import { UserTable } from "../users-table";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Users</h1>
      <UserTable />
    </div>
  );
}