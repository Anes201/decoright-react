import Table from "@/components/ui/DataTable";
import { AdminService } from "@/services/admin.service";
import { useEffect, useState } from "react";

const columns = [
    { key: 'request_code', title: 'Code', searchable: true },
    { key: 'customer_name', title: 'Customer', render: (row: any) => row.profiles?.full_name || 'Unknown' },
    { key: 'service_type', title: 'Service' },
    { key: 'space_type', title: 'Space' },
    { key: 'status', title: 'Status' },
    { key: 'created_at', title: 'Date', render: (row: any) => new Date(row.created_at).toLocaleDateString() },
];

export default function ServiceRequestTable() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadRequests() {
        try {
            const data = await AdminService.getAllServiceRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await AdminService.updateRequestStatus(id, newStatus);
            loadRequests(); // Reload data
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-muted">Loading requests...</div>;
    }

    return (
        <Table columns={columns} data={requests} options={{
            selectable: true,
            filterOptions: [
                { label: 'Submitted', value: 'Submitted' },
                { label: 'Under Review', value: 'Under Review' },
                { label: 'Approved', value: 'Approved' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Rejected', value: 'Rejected' },
                { label: 'Cancelled', value: 'Cancelled' },
            ],
            filterField: 'status',
            renderActions: (row) => (
                <div className="flex flex-col gap-2 w-full p-2">
                    <select
                        className="bg-background border border-muted/25 rounded px-2 py-1 text-xs"
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="px-2 py-1 w-full text-sm text-start hover:bg-emphasis/10 rounded" onClick={() => console.log('Details', row)}>Details</button>
                </div>
            ),
            bulkActions: [
                { label: 'Export Selected', onClick: (selected) => console.log('export', selected) },
            ],
            onSelectionChange: (selected) => console.log('selected rows', selected),
            searchPlaceholder: 'Search by codes or customers',
        }}
        />
    );
}