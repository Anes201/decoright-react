import Table from "@/components/ui/DataTable";
import UserDetailDrawer from "./UserDetailDrawer";
import { AdminService, type UserProfile } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RectangleStack } from "@/icons";

export default function UserTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserClick = (row: any) => {
    setSelectedUser(row);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      key: 'full_name',
      title: t('admin.users.col_identity'),
      searchable: true,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {row.full_name?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-heading text-sm">{row.full_name || 'Unknown'}</span>
              {row.role === 'super_admin' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">
                  {t('admin.users.role_super_admin')}
                </span>
              )}
              {row.role === 'admin' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase border border-purple-500/20">
                  {t('admin.users.role_admin')}
                </span>
              )}
              {row.role === 'customer' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 uppercase border border-blue-500/20">
                  {t('admin.users.role_client')}
                </span>
              )}
            </div>
            <span className="text-xs text-muted">{row.email || t('admin.users.no_email')}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: t('admin.users.col_status'),
      width: '100px',
      render: (row: any) => (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${row.is_active
          ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'
          : 'bg-zinc-500/5 text-zinc-500 border-zinc-500/20'
          }`}>
          <span className={`size-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
          {row.is_active ? t('admin.users.status_active') : t('admin.users.status_banned')}
        </div>
      )
    },
    {
      key: 'contacts',
      title: t('admin.users.col_contacts'),
      render: (row: any) => (
        <div className="flex flex-col text-sm">
          <span className="text-body font-medium">{row.phone || '-'}</span>
        </div>
      )
    },
    {
      key: 'stats',
      title: t('admin.users.col_requests'),
      width: '100px',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <RectangleStack className="size-4 text-muted" />
          <span className="font-semibold text-heading">{row.total_requests || 0}</span>
        </div>
      )
    },
    {
      key: 'created_at',
      title: t('admin.users.col_joined'),
      sortable: true,
      render: (row: any) => (
        <span className="text-xs text-muted">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="p-10 text-center text-muted animate-pulse">{t('admin.users.loading')}</div>;
  }

  return (
    <>
      <Table
        columns={columns}
        data={users}
        options={{
          onRowClick: handleUserClick,
          selectable: false,
          filterOptions: [
            { label: t('admin.users.filter_super_admins'), value: 'super_admin' },
            { label: t('admin.users.filter_admins'), value: 'admin' },
            { label: t('admin.users.filter_clients'), value: 'customer' },
          ],
          filterField: 'role',
          searchPlaceholder: t('admin.users.search_placeholder'),
          renderActions: (row) => (
            <div className="flex flex-col gap-2 w-full z-10">
              <button className="px-2 py-1 w-full text-sm text-start hover:bg-emphasis/10 rounded font-medium" onClick={(e) => { e.stopPropagation(); handleUserClick(row); }}>{t('admin.users.view_details')}</button>
            </div>
          )
        }}
      />

      <UserDetailDrawer
        isOpen={isDrawerOpen}
        user={selectedUser}
        onClose={() => setIsDrawerOpen(false)}
        onUserUpdate={loadUsers}
      />
    </>
  );
}
