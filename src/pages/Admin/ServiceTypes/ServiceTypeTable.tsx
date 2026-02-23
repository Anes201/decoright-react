import { ServiceTypesService, type ServiceType } from '@/services/service-types.service';
import { useState } from 'react';
import { useConfirm } from '@/components/confirm';
import { Cog, Folder, PencilSquare, Photo, Trash } from '@/icons';
import toast from 'react-hot-toast';
import ZoomImage from '@/components/ui/ZoomImage';


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
        try {
            const usage = await ServiceTypesService.getUsageCount(serviceType.id)
            
            if (usage.requests > 0 || usage.projects > 0) {
                const parts: string[] = []
                if (usage.requests > 0) parts.push(`${usage.requests} service request${usage.requests > 1 ? 's' : ''}`)
                if (usage.projects > 0) parts.push(`${usage.projects} project${usage.projects > 1 ? 's' : ''}`)
                
                toast.error(`Cannot delete — this type is used by ${parts.join(' and ')}. Deactivate it instead.`)
                return
            }
        } catch (error) {
            console.error('Failed to check service type usage:', error)
            toast.error('Failed to verify usage. Please try again.')
            return
        }

        const isConfirmed = await confirm({
            title: 'Delete Service Type',
            description: `Are you sure you want to delete "${serviceType.display_name_en}"? This action cannot be undone.`,
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
                toast.error(error.message || 'Failed to delete service type.');
            }
        }
    };

    return (
        <div className="h-full overflow-auto border-b-0 border border-muted/25 rounded-t-lg bg-surface">
            <table className="w-full text-left border-collapse">
                <thead className="bg-emphasis/75 sticky top-0 z-10">
                    <tr className="border-b border-muted/15">
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Image</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">English Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Arabic Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceTypes.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-muted">
                                <Folder className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No service types found</p>
                            </td>
                        </tr>
                    ) : (
                        serviceTypes.map((serviceType) => (
                            <tr key={serviceType.id} className="border-b border-muted/15 hover:bg-emphasis transition-colors">
                                <td className="p-3">
                                    <div className="h-22 aspect-video rounded-lg overflow-hidden border border-muted/10 bg-surface flex items-center justify-center">
                                        {serviceType.image_url ? (
                                            <ZoomImage src={serviceType.image_url} alt="" className="w-full h-full object-cover" />
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
