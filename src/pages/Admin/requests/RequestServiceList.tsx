import { useState, useEffect } from 'react';
import RequestServiceTable from "@components/layout/admin/RequestServiceTable";
import RequestDetailDrawer from "@components/layout/admin/RequestDetailDrawer";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";

export default function RequestServiceList() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getAllServiceRequests();
            console.log("Raw Service Requests Data:", data); // DEBUG: Check structure
            // Transform data to flatten relations
            const formattedData = (data || []).map(req => ({
                ...req,
                // Ensure chat_id is accessible at the top level for the table
                chat_id: Array.isArray(req.chat_room) ? req.chat_room[0]?.id : (req.chat_room as any)?.id,
                // Ensure full_name is accessible (if not already handled)
                full_name: req.profiles?.full_name || 'Unknown Client'
            }));
            setRequests(formattedData);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleOpenDrawer = (request: any) => {
        setSelectedRequest(request);
        setIsDrawerOpen(true);
    };

    return (
        <main className="flex-1 flex flex-col w-full overflow-hidden">
            <section className="flex-1 min-h-0 flex flex-col p-4 md:p-6 overflow-hidden">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-none">
                    <div>
                        <h1 className="font-bold text-2xl md:text-3xl text-heading tracking-tight">Request Management</h1>
                        <p className="text-sm text-muted mt-1">Manage and track service requests through their lifecycle.</p>
                    </div>

                    <button
                        onClick={loadRequests}
                        className="px-4 py-2 bg-emphasis text-body rounded-lg hover:bg-neutral-tertiary-medium transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                        <ICONS.arrowPath className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    {loading && requests.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <ICONS.cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Initializing workspace...</p>
                        </div>
                    ) : (
                        <RequestServiceTable
                            onRowClick={handleOpenDrawer}
                            externalData={requests}
                            onRefresh={loadRequests}
                        />
                    )}
                </div>

                {/* Detail Drawer */}
                <RequestDetailDrawer
                    isOpen={isDrawerOpen}
                    request={selectedRequest}
                    onClose={() => setIsDrawerOpen(false)}
                    onStatusUpdate={loadRequests}
                />

            </section>
        </main>
    );
}