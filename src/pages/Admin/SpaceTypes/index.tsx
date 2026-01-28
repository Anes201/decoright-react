import { useState, useEffect } from 'react';
import { SpaceTypesService, type SpaceType } from '@/services/space-types.service';
import { ICONS } from '@/icons';
import SpaceTypeTable from './SpaceTypeTable';
import SpaceTypeForm from './SpaceTypeForm';

export default function SpaceTypes() {
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType | null>(null);

    const loadSpaceTypes = async () => {
        try {
            setLoading(true);
            const data = await SpaceTypesService.getAll();
            setSpaceTypes(data);
        } catch (error) {
            console.error('Failed to load space types:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpaceTypes();
    }, []);

    const handleAdd = () => {
        setSelectedSpaceType(null);
        setIsFormOpen(true);
    };

    const handleEdit = (spaceType: SpaceType) => {
        setSelectedSpaceType(spaceType);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedSpaceType(null);
    };

    const handleFormSuccess = () => {
        loadSpaceTypes();
        handleFormClose();
    };

    return (
        <main className="flex-1 flex flex-col w-full overflow-hidden">
            <section className="flex-1 min-h-0 flex flex-col p-4 md:p-6 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-none">
                    <div>
                        <h1 className="font-bold text-2xl md:text-3xl text-heading tracking-tight">Space Types</h1>
                        <p className="text-sm text-muted mt-1">Manage space type categories for projects and requests.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={loadSpaceTypes}
                            className="px-4 py-2 bg-emphasis text-body rounded-lg hover:bg-neutral-tertiary-medium transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <ICONS.arrowPath className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <ICONS.plus className="size-4" />
                            Add Space Type
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    {loading && spaceTypes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <ICONS.cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Loading space types...</p>
                        </div>
                    ) : (
                        <SpaceTypeTable
                            spaceTypes={spaceTypes}
                            onEdit={handleEdit}
                            onRefresh={loadSpaceTypes}
                        />
                    )}
                </div>

                {/* Form Dialog */}
                <SpaceTypeForm
                    isOpen={isFormOpen}
                    spaceType={selectedSpaceType}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            </section>
        </main>
    );
}
