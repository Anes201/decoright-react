import { SpaceTypesService, type SpaceTypeWithImages } from '@/services/space-types.service';
import { useState } from 'react';
import { useConfirm } from '@/components/confirm';
import { Cog, Folder, PencilSquare, Photo, Trash } from '@/icons';
import toast from 'react-hot-toast';
import ZoomImage from '@/components/ui/ZoomImage';

interface SpaceTypeTableProps {
    spaceTypes: SpaceTypeWithImages[];
    onEdit: (spaceType: SpaceTypeWithImages) => void;
    onRefresh: () => void;
}

export default function SpaceTypeTable({ spaceTypes, onEdit, onRefresh }: SpaceTypeTableProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const confirm = useConfirm();

    const handleToggleActive = async (spaceType: SpaceTypeWithImages) => {
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

    const handleDelete = async (spaceType: SpaceTypeWithImages) => {
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
        <div className="h-full overflow-y-auto overflow-x-auto border-b-0 border border-muted/25 rounded-t-lg bg-surface">
            <table className="w-full min-w-[640px] text-left border-collapse">
                <thead className="bg-emphasis/75 sticky top-0 z-10">
                    <tr className="border-b border-muted/15">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Images</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">English Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Arabic Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {spaceTypes.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-muted">
                                <Folder className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No space types found</p>
                            </td>
                        </tr>
                    ) : (
                        spaceTypes.map((spaceType) => {
                            const images = [...(spaceType.space_type_images ?? [])].sort(
                                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                            );
                            const visibleImages = images.slice(0, 3);
                            const overflow = images.length - visibleImages.length;

                            return (
                                <tr key={spaceType.id} className="border-b border-muted/15 hover:bg-emphasis/75 transition-colors">
                                    {/* Thumbnail strip */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            {visibleImages.length > 0 ? (
                                                <>
                                                    {visibleImages.map((img) => (
                                                        <div
                                                            key={img.id}
                                                            className="h-14 w-20 rounded-lg overflow-hidden border border-muted/10 bg-surface flex-shrink-0"
                                                        >
                                                            <ZoomImage
                                                                src={img.image_url}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {overflow > 0 && (
                                                        <div className="h-14 w-14 rounded-lg bg-emphasis border border-muted/10 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-semibold text-muted">+{overflow}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="h-14 w-20 rounded-lg border border-muted/10 bg-surface flex items-center justify-center flex-shrink-0">
                                                    <Photo className="size-6 text-muted/30" />
                                                </div>
                                            )}
                                        </div>
                                    </td>

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
                                                <Cog className="size-3 animate-spin inline" />
                                            ) : spaceType.is_active ? (
                                                'Active'
                                            ) : (
                                                'Inactive'
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title="Edit Space Type"
                                                onClick={() => onEdit(spaceType)}
                                                className="inline-flex items-center gap-1 p-2 text-sm font-medium ring-muted/45 rounded-full transition-colors hover:ring-1 hover:bg-emphasis"
                                            >
                                                <PencilSquare className="size-4" />
                                            </button>
                                            <button
                                                title="Delete Space Type"
                                                onClick={() => handleDelete(spaceType)}
                                                className="group/trash inline-flex items-center gap-1 p-2 text-sm font-medium ring-danger/45 rounded-full transition-colors hover:ring-1 hover:bg-emphasis"
                                            >
                                                <Trash className="size-4 group-hover/trash:text-danger" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
