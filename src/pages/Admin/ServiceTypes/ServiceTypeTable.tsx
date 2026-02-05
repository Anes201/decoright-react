import { ServiceTypesService, type ServiceType } from '@/services/service-types.service';
import { ICONS } from '@/icons';
import { useState } from 'react';

interface ServiceTypeTableProps {
    serviceTypes: ServiceType[];
    onEdit: (serviceType: ServiceType) => void;
    onRefresh: () => void;
}

export default function ServiceTypeTable({ serviceTypes, onEdit, onRefresh }: ServiceTypeTableProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleActive = async (serviceType: ServiceType) => {
        try {
            setTogglingId(serviceType.id);
            await ServiceTypesService.toggleActive(serviceType.id, !serviceType.is_active);
            onRefresh();
        } catch (error) {
            console.error('Failed to toggle service type status:', error);
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="h-full overflow-auto border border-muted/15 rounded-lg">
            <table className="w-full">
                <thead className="bg-surface/50 sticky top-0 z-10">
                    <tr className="border-b border-muted/15">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">English Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Arabic Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">French Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-muted/15">
                    {serviceTypes.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-muted">
                                <ICONS.folder className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No service types found</p>
                            </td>
                        </tr>
                    ) : (
                        serviceTypes.map((serviceType) => (
                            <tr key={serviceType.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-mono text-foreground">{serviceType.name}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{serviceType.display_name_en}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{serviceType.display_name_ar || '—'}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{serviceType.display_name_fr || '—'}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleToggleActive(serviceType)}
                                        disabled={togglingId === serviceType.id}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${serviceType.is_active
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } ${togglingId === serviceType.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {togglingId === serviceType.id ? (
                                            <ICONS.cog className="size-3 animate-spin inline" />
                                        ) : serviceType.is_active ? (
                                            'Active'
                                        ) : (
                                            'Inactive'
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onEdit(serviceType)}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <ICONS.pencilSquare className="size-4" />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
