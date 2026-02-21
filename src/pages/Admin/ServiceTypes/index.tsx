import { useState, useEffect } from 'react';
import { ServiceTypesService, type ServiceType } from '@/services/service-types.service';
import ServiceTypeTable from '@/pages/Admin/ServiceTypes/ServiceTypeTable';
import ServiceTypeForm from '@/pages/Admin/ServiceTypes/ServiceTypeForm';
import { ArrowPath, Cog, Plus } from '@/icons';

export default function ServiceTypes() {
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

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
        <main className="flex-1 flex flex-col w-full overflow-hidden">
            <section className="flex-1 min-h-0 flex flex-col p-4 md:p-6 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-none">
                    <div>
                        <h1 className="font-bold text-2xl md:text-3xl text-heading tracking-tight">Service Types</h1>
                        <p className="text-sm text-muted mt-1">Manage service type categories for projects and requests.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={loadServiceTypes}
                            className="px-4 py-2 bg-emphasis text-body rounded-lg hover:bg-neutral-tertiary-medium transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <ArrowPath className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <Plus className="size-4" />
                            Add Service Type
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    {loading && serviceTypes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted animate-pulse">
                            <Cog className="size-12 animate-spin mb-4" />
                            <p className="font-medium">Loading service types...</p>
                        </div>
                    ) : (
                        <ServiceTypeTable
                            serviceTypes={serviceTypes}
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
