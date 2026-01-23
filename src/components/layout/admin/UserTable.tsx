import Table from "@/components/ui/DataTable";
import { AdminService, UserProfile } from "@/services/admin.service";
import { useEffect, useState } from "react";

const columns = [
  { key: 'id', title: 'ID', searchable: true },
  { key: 'full_name', title: 'Full Name', searchable: true },
  { key: 'phone', title: 'Phone' },
  { key: 'role', title: 'Role' },
];

export default function UserTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await AdminService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-muted">Loading users...</div>;
  }

  return (
    <Table columns={columns} data={users} options={{
      selectable: true,
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      filterField: 'role',
      renderActions: (row) => (
        <div className="flex flex-col gap-2 w-full">
          <button className="px-2 py-1 w-full text-sm text-start hover:bg-emphasis/10 rounded" onClick={() => console.log('Edit', row)}>Edit</button>
          <button className="px-2 py-1 w-full text-sm text-start hover:bg-emphasis/10 rounded text-destructive" onClick={() => console.log('Delete', row)}>Delete</button>
        </div>
      ),
      bulkActions: [
        { label: 'Delete Selected', onClick: (selected) => console.log('delete', selected) },
        { label: 'Export Selected', onClick: (selected) => console.log('export', selected) },
      ],
      onSelectionChange: (selected) => console.log('selected rows', selected),
      searchPlaceholder: 'Search by names or ids',
    }}
    />
  );
}