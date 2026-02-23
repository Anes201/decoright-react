import { useState, useEffect } from 'react';
import { ServiceTypesService, type ServiceType } from '@/services/service-types.service';
import ServiceTypeTable from '@/pages/Admin/ServiceTypes/ServiceTypeTable';
import ServiceTypeForm from '@/pages/Admin/ServiceTypes/ServiceTypeForm';
import { ArrowPath, Cog, MagnifyingGlass, Plus } from '@/icons';

export default function ServiceTypes() {
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
    const [search, setSearch] = useState('');

    const loadServiceTypes = async () => {
        try {
            setLoading(true);
            const data = await ServiceTypesService.getAll();
            setServiceTypes(data);
        } catch (error) {
            console.error('Failed to load service types:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServiceTypes = serviceTypes.filter(st =>
        st.display_name_en.toLowerCase().includes(search.toLowerCase()) ||
        st.display_name_fr?.toLowerCase().includes(search.toLowerCase()) ||
        st.display_name_ar?.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        loadServiceTypes();
    }, []);

    const handleAdd = () => {
        setSelectedServiceType(null);
        setIsFormOpen(true);
    };

    const handleEdit = (serviceType: ServiceType) => {
        setSelectedServiceType(serviceType);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedServiceType(null);
    };

    const handleFormSuccess = () => {
        loadServiceTypes();
        handleFormClose();
    };

    return (
        <main className="w-full h-full">
            <section className="flex flex-col pt-4 md:pt-6 w-full h-full">
                {/* Header */}
                <div className="flex flex-col h-fit mb-6">
                    <h1 className="font-medium text-2xl md:text-3xl text-heading tracking-tight">Service Types</h1>
                    <p className="text-sm text-muted mt-1">Manage service type categories for projects and requests.</p>
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
                                Add Service Type
                            </button>
                            <button
                                onClick={loadServiceTypes}
                                title="Refresh Table"
                                className="p-2 border border-muted/15 text-body rounded-lg hover:bg-neutral-tertiary-medium transition-colors flex items-center gap-2 text-sm font-semibold bg-surface hover:bg-emphasis active:bg-emphasis"
                            > <ArrowPath className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {loading && serviceTypes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <Cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Loading service types...</p>
                        </div>
                    ) : (
                        <ServiceTypeTable
                            serviceTypes={filteredServiceTypes}
                            onEdit={handleEdit}
                            onRefresh={loadServiceTypes}
                        />
                    )}
                </div>

                {/* Form Dialog */}
                <ServiceTypeForm
                    isOpen={isFormOpen}
                    serviceType={selectedServiceType}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            </section>
        </main>
    );
}
