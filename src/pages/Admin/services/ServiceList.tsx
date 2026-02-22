
import Spinner from "@/components/common/Spinner";
import ServiceListLayout from "@/components/layout/admin/services/ServiceList";
import { serviceStatus } from "@/constants";
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service";
import { useEffect, useState } from "react";

export default function ServiceList() {

    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await ServiceTypesService.getAll();
                setServiceTypes(data || []);
            } catch (err) {
                console.error("Failed to fetch showcase projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-8 w-full h-full">
                <Spinner status={loading} />
                <span className="text-sm"> Loading Services... </span>
            </div>
        )
    };

    if (setServiceTypes.length === 0) {
        return (
            <div className="text-center p-8 text-muted">No services was made yet.</div>
        )
    }

    return (
        <main>
            <section className="relative flex flex-col w-full mb-20">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Service List </h1>
                    {/* Service content goes here */}

                    <ServiceListLayout serviceTypes={serviceTypes} serviceStatus={serviceStatus} />

                </div>
            </section>
        </main>
    )
}