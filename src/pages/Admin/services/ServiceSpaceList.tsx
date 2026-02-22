

import Spinner from '@/components/common/Spinner';
import ServiceSpaceListLayout from '@/components/layout/admin/services/ServiceSpaceList';
import { serviceSpaceStatus } from '@/constants';
import { SpaceTypesService } from '@/services/space-types.service';
import { useEffect, useState } from 'react';

export default function ServiceSpaceList() {

    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await SpaceTypesService.getAll();
                setSpaces(data || []);
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
                <span className="text-sm"> Loading Spaces... </span>
            </div>
        )
    };

    if (spaces.length === 0) {
        return (
            <div className="text-center p-8 text-muted">No spaces was made yet.</div>
        )
    }

    return (
        <main>
            <section className="relative flex flex-col w-full mb-20">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Space Service List </h1>
                    {/* Service content goes here */}
                    <ServiceSpaceListLayout spaceTypes={spaces} serviceSpaceStatus={serviceSpaceStatus}/>
                </div>
            </section>
        </main>
    )
}