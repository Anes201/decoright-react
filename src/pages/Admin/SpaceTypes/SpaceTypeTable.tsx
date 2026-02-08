import { SpaceTypesService, type SpaceType } from '@/services/space-types.service';
import { ICONS } from '@/icons';
import { useState } from 'react';
import { useConfirm } from '@/components/confirm';
import toast from 'react-hot-toast';

interface SpaceTypeTableProps {
    spaceTypes: SpaceType[];
    onEdit: (spaceType: SpaceType) => void;
    onRefresh: () => void;
}

export default function SpaceTypeTable({ spaceTypes, onEdit, onRefresh }: SpaceTypeTableProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const confirm = useConfirm();

    const handleToggleActive = async (spaceType: SpaceType) => {
        try {
            setTogglingId(spaceType.id);
            await SpaceTypesService.toggleActive(spaceType.id, !spaceType.is_active);
            toast.success(`Space type ${!spaceType.is_active ? 'activated' : 'deactivated'} successfully`);
            onRefresh();
        } catch (error) {
            console.error('Failed to toggle space type status:', error);
            toast.error('Failed to update status');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (spaceType: SpaceType) => {
        const isConfirmed = await confirm({
            title: 'Delete Space Type',
            description: `Are you sure you want to delete "${spaceType.display_name_en}"? This action cannot be undone and may fail if the space type is currently in use by any projects.`,
            confirmText: 'Delete',
            variant: 'destructive'
        });

        if (isConfirmed) {
            try {
                await SpaceTypesService.delete(spaceType.id);
                toast.success('Space type deleted successfully');
                onRefresh();
            } catch (error: any) {
                console.error('Failed to delete space type:', error);
                toast.error(error.message || 'Failed to delete space type. It might be in use.');
            }
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
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-muted/15">
                    {spaceTypes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-muted">
                                <ICONS.folder className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No space types found</p>
                            </td>
                        </tr>
                    ) : (
                        spaceTypes.map((spaceType) => (
                            <tr key={spaceType.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-mono text-foreground">{spaceType.name}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{spaceType.display_name_en}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{spaceType.display_name_ar || '—'}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleToggleActive(spaceType)}
                                        disabled={togglingId === spaceType.id}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${spaceType.is_active
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } ${togglingId === spaceType.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {togglingId === spaceType.id ? (
                                            <ICONS.cog className="size-3 animate-spin inline" />
                                        ) : spaceType.is_active ? (
                                            'Active'
                                        ) : (
                                            'Inactive'
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(spaceType)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            <ICONS.pencilSquare className="size-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(spaceType)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <ICONS.trash className="size-4" />
                                            Delete
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
