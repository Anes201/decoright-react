
import { ServiceCard } from "@/components/layout/admin/Services";
import { serviceTypes } from "@/constants";

export default function ServiceList() {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8 mb-40">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Service List </h1>
                    {/* Service content goes here */}

                    <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

                        {serviceTypes.map((service, index) => (
                            <ServiceCard id={service.value} key={index} label={service.label} description={service.description} src={service.src} />
                        ))}

                    </ul>

                </div>
            </section>
        </main>
    )
}