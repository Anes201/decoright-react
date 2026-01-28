import React from 'react';
import { ICONS } from '@/icons';

interface KanbanBoardProps {
    requests: any[];
    onCardClick: (request: any) => void;
}

const COLUMNS = [
    { key: 'Submitted', label: 'New / Pending', icon: ICONS.bell, color: 'text-blue-500 bg-blue-500/10' },
    { key: 'Under Review', label: 'Under Review', icon: ICONS.eye, color: 'text-amber-500 bg-amber-500/10' },
    { key: 'Approved', label: 'Approved', icon: ICONS.check, color: 'text-emerald-500 bg-emerald-500/10' },
    { key: 'In Progress', label: 'In Progress', icon: ICONS.pencilSquare, color: 'text-indigo-500 bg-indigo-500/10' },
    { key: 'Completed', label: 'Completed', icon: ICONS.star, color: 'text-purple-500 bg-purple-500/10' },
];

export default function KanbanBoard({ requests, onCardClick }: KanbanBoardProps) {
    // Filter out rejected/cancelled by default as per user request
    const visibleRequests = requests.filter(r => !['Rejected', 'Cancelled'].includes(r.status));

    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-6 -mx-1 px-1">
            {COLUMNS.map(column => {
                const columnRequests = visibleRequests.filter(r => r.status === column.key);

                return (
                    <div key={column.key} className="flex-none w-80 flex flex-col h-full bg-emphasis/15 rounded-2xl border border-muted/10">
                        {/* Column Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`size-8 rounded-lg ${column.color} flex items-center justify-center`}>
                                    <column.icon className="size-4" />
                                </div>
                                <h3 className="font-semibold text-sm">{column.label}</h3>
                            </div>
                            <span className="text-2xs font-bold text-muted bg-emphasis px-2 py-0.5 rounded-full">
                                {columnRequests.length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {columnRequests.map(request => (
                                <div
                                    key={request.id}
                                    onClick={() => onCardClick(request)}
                                    className="p-4 bg-surface border border-muted/20 rounded-xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{request.request_code}</span>
                                        <div className="flex -space-x-1">
                                            <div className="size-6 rounded-full border-2 border-surface bg-emphasis flex items-center justify-center text-[10px] font-medium uppercase">
                                                {request.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                                        {request.profiles?.full_name || 'Anonymous'}
                                    </p>

                                    <div className="flex flex-col gap-1.5 mt-3">
                                        <div className="flex items-center gap-1.5 text-3xs text-muted">
                                            <ICONS.tag className="size-3" />
                                            <span>{request.service_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-3xs text-muted">
                                            <ICONS.rectangleStack className="size-3" />
                                            <span>{request.space_type}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-muted/5 flex items-center justify-between text-[10px]">
                                        <span className="text-muted italic">{new Date(request.created_at).toLocaleDateString()}</span>
                                        <button className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Manage <ICONS.chevronRight className="size-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {columnRequests.length === 0 && (
                                <div className="h-24 border-2 border-dashed border-muted/10 rounded-xl flex items-center justify-center p-4 text-center">
                                    <p className="text-3xs text-muted font-medium uppercase tracking-widest leading-relaxed">
                                        Empty Stage
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
