import { ServiceTypesService, type ServiceType } from '@/services/service-types.service';
import { useState } from 'react';
import { useConfirm } from '@/components/confirm';
import { Cog, Folder, PencilSquare, Photo, Trash } from '@/icons';
import toast from 'react-hot-toast';


interface ServiceTypeTableProps {
    serviceTypes: ServiceType[];
    onEdit: (serviceType: ServiceType) => void;
    onRefresh: () => void;
}

export default function ServiceTypeTable({ serviceTypes, onEdit, onRefresh }: ServiceTypeTableProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const confirm = useConfirm();

    const handleToggleActive = async (serviceType: ServiceType) => {
        try {
            setTogglingId(serviceType.id);
            await ServiceTypesService.toggleActive(serviceType.id, !serviceType.is_active);
            onRefresh();
        } catch (error) {
            console.error('Failed to toggle service type status:', error);
            toast.error('Failed to update status');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (serviceType: ServiceType) => {
        const isConfirmed = await confirm({
            title: 'Delete Service Type',
            description: `Are you sure you want to delete "${serviceType.display_name_en}"? This action cannot be undone and may fail if projects are using this type.`,
            confirmText: 'Delete',
            variant: 'destructive',
        });

        if (isConfirmed) {
            try {
                await ServiceTypesService.delete(serviceType.id);
                toast.success('Service type deleted successfully');
                onRefresh();
            } catch (error: any) {
                console.error('Failed to delete service type:', error);
                toast.error(error.message || 'Failed to delete service type. It might be in use.');
            }
        }
    };

    return (
        <div className="h-full overflow-auto border border-muted/15 rounded-lg">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface/50 sticky top-0 z-10">
                    <tr className="border-b border-muted/15">
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Image</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">English Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Arabic Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-muted/15">
                    {serviceTypes.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-muted">
                                <Folder className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No service types found</p>
                            </td>
                        </tr>
                    ) : (
                        serviceTypes.map((serviceType) => (
                            <tr key={serviceType.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-muted/10 bg-surface flex items-center justify-center">
                                        {serviceType.image_url ? (
                                            <img src={serviceType.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Photo className="size-8 text-muted/20" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-foreground">{serviceType.name}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{serviceType.display_name_en}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{serviceType.display_name_ar || '—'}</td>
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
                                            <Cog className="size-3 animate-spin inline" />
                                        ) : serviceType.is_active ? (
                                            'Active'
                                        ) : (
                                            'Inactive'
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(serviceType)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <PencilSquare className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(serviceType)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
