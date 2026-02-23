import { useState, useEffect } from 'react';
import { SpaceTypesService, type SpaceType } from '@/services/space-types.service';
import SpaceTypeTable from './SpaceTypeTable';
import SpaceTypeForm from './SpaceTypeForm';
import { ArrowPath, Cog, MagnifyingGlass, Plus } from '@/icons';

export default function SpaceTypes() {
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType | null>(null);
    const [search, setSearch] = useState('');

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

    const filteredSpaceTypes = spaceTypes.filter(st =>
        st.display_name_en.toLowerCase().includes(search.toLowerCase()) ||
        st.display_name_fr?.toLowerCase().includes(search.toLowerCase()) ||
        st.display_name_ar?.toLowerCase().includes(search.toLowerCase())
    );

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
        <main className="w-full h-full">
            <section className="flex flex-col pt-4 md:pt-6 w-full h-full">
                {/* Header */}
                <div className="flex flex-col h-fit mb-6">
                    <h1 className="font-medium text-2xl md:text-3xl text-heading tracking-tight">Space Types</h1>
                    <p className="text-sm text-muted mt-1">Manage space type categories for projects and requests.</p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between gap-2 w-full h-fit">
                        <div className="flex items-center gap-2 w-full">
                            <label htmlFor="table-search" className="sr-only">Search</label>
                            <div className="relative flex w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <MagnifyingGlass className=" size-4 text-muted" />
                                </div>
                                <input
                                    id="table-search" value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search service types..."
                                    className="block w-full ps-9 pe-3 py-2 bg-surface border border-muted/15 text-heading text-sm rounded-lg focus:outline-1 outline-muted/10 placeholder:text-body focus:bg-emphasis transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 min-w-max">
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 font-semibold text-sm text-muted hover:text-foreground active:text-foreground px-3 py-2 border border-muted/15 bg-emphasis rounded-lg hover:bg-emphasis transition-colors"
                            >
                                <Plus className="size-4" />
                                Add Space Type
                            </button>
                            <button
                                onClick={loadSpaceTypes}
                                title="Refresh Table"
                                className="p-2 border border-muted/15 text-body rounded-lg hover:bg-neutral-tertiary-medium transition-colors flex items-center gap-2 text-sm font-semibold bg-surface hover:bg-emphasis active:bg-emphasis"
                            > <ArrowPath className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                    {loading && spaceTypes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <Cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Loading space types...</p>
                        </div>
                    ) : (
                        <SpaceTypeTable
                            spaceTypes={filteredSpaceTypes}
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
