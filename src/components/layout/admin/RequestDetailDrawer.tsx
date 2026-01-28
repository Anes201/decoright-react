import React, { useEffect, useState } from 'react';
import { ICONS } from '@/icons';
import { AdminService } from '@/services/admin.service';

interface RequestDetailDrawerProps {
    request: any | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: () => void;
}

export default function RequestDetailDrawer({ request, isOpen, onClose, onStatusUpdate }: RequestDetailDrawerProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!request) return null;

    const handleStatusChange = async (newStatus: string) => {
        try {
            setIsUpdating(true);
            await AdminService.updateRequestStatus(request.id, newStatus);
            onStatusUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const statusColors: Record<string, string> = {
        'Submitted': 'text-blue-500 bg-blue-500/10',
        'Under Review': 'text-amber-500 bg-amber-500/10',
        'Approved': 'text-emerald-500 bg-emerald-500/10',
        'In Progress': 'text-indigo-500 bg-indigo-500/10',
        'Completed': 'text-purple-500 bg-purple-500/10',
        'Rejected': 'text-red-500 bg-red-500/10',
        'Cancelled': 'text-zinc-500 bg-zinc-500/10',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-muted/20 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-muted/10">
                        <div>
                            <span className="text-3xs uppercase tracking-wider text-muted font-bold">Request Details</span>
                            <h2 className="text-xl font-semibold mt-1 uppercase">{request.request_code}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-emphasis rounded-full transition-colors"
                        >
                            <ICONS.xMark className="size-6 text-muted" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Client Info Section */}
                        <section>
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-tight mb-4">Client Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <ICONS.user className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Full Name</p>
                                        <p className="font-medium">{request.profiles?.full_name || 'Anonymous'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <ICONS.phone className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Phone Number</p>
                                        <p className="font-medium">{request.profiles?.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <ICONS.mapPin className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Location</p>
                                        <p className="font-medium">{request.location || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Request Details Section */}
                        <section>
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-tight mb-4">Service Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-emphasis/30 border border-muted/10">
                                    <div className="flex items-center gap-2 text-primary mb-1">
                                        <ICONS.tag className="size-4" />
                                        <span className="text-3xs uppercase font-bold">Service</span>
                                    </div>
                                    <p className="text-sm font-medium">{request.service_type}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-emphasis/30 border border-muted/10">
                                    <div className="flex items-center gap-2 text-indigo-500 mb-1">
                                        <ICONS.rectangleStack className="size-4" />
                                        <span className="text-3xs uppercase font-bold">Space</span>
                                    </div>
                                    <p className="text-sm font-medium">{request.space_type}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-emphasis/30 border border-muted/10">
                                    <span className="text-3xs uppercase font-bold text-muted mb-1 block">Area</span>
                                    <p className="text-sm font-medium">{request.area_sqm || 0} m²</p>
                                </div>

                                <div className="p-4 rounded-xl bg-emphasis/30 border border-muted/10">
                                    <span className="text-3xs uppercase font-bold text-muted mb-1 block">Status</span>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[request.status] || 'bg-muted/10'}`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        {request.description && (
                            <section>
                                <h3 className="text-sm font-semibold text-muted uppercase tracking-tight mb-2">Description</h3>
                                <p className="text-sm text-body leading-relaxed bg-emphasis/20 p-4 rounded-xl italic">
                                    "{request.description}"
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Actions Footer */}
                    <div className="p-6 border-t border-muted/10 bg-emphasis/10">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 px-1">Update Workflow</h3>
                        <div className="flex flex-wrap gap-2">
                            {request.status === 'Submitted' && (
                                <>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusChange('Under Review')}
                                        className="flex-1 min-w-[140px] py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                                    >
                                        Start Review
                                    </button>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusChange('Rejected')}
                                        className="flex-1 min-w-[140px] py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {request.status === 'Under Review' && (
                                <>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusChange('Approved')}
                                        className="flex-1 min-w-[140px] py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusChange('Rejected')}
                                        className="flex-1 min-w-[140px] py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {request.status === 'Approved' && (
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange('In Progress')}
                                    className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Move to In Progress
                                </button>
                            )}

                            {request.status === 'In Progress' && (
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange('Completed')}
                                    className="w-full py-2.5 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
                                >
                                    Mark as Completed
                                </button>
                            )}

                            {['Completed', 'Rejected', 'Cancelled'].includes(request.status) && (
                                <div className="w-full py-3 text-center text-muted text-sm font-medium border border-dashed border-muted/30 rounded-lg">
                                    No further actions available for {request.status} requests.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
