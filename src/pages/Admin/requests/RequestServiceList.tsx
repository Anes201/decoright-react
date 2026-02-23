import RequestServiceTable from "@components/layout/admin/RequestServiceTable";
import { useState, useEffect } from 'react';
import { AdminService } from "@/services/admin.service";
import { ArrowPath, Cog } from "@/icons";

export default function RequestServiceList() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <main className="w-full">
            <section className="flex flex-col pt-4 md:pt-6 w-full h-full mb-60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-medium text-xl md:text-2xl text-heading tracking-tight"> Request Management </h1>
                        <p className="text-sm text-muted mt-1">Manage and track service requests through their lifecycle.</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div >
                    {loading && requests.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <Cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Initializing workspace...</p>
                        </div>
                    ) : (
                        <RequestServiceTable
                            externalData={requests}
                            onRefresh={loadRequests}
                        />
                    )}
                </div>
            </section>
        </main>
    );
}