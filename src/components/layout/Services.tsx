
import { serviceTypes } from "../../constants/index"
import { SectionHeader } from '../ui/SectionHeader';

export function ServiceCardList () {
    return (
        <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

            {serviceTypes.map((service, index) => (

                <li key={index} className="relative p-4">
                    <div className="absolute top-0 right-0 w-full h-full bg-primary/10 mask-t-to-transparent -z-10 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-full h-full border border-muted/10 mask-b-to-transparent -z-10 rounded-2xl"></div>
                    <div className="w-full aspect-4/3 mb-4 overflow-hidden shadow-sm rounded-xl">
                        <img src={service.imgSrc} alt="" className="object-cover h-full w-full " />
                    </div>

                    <h3 className="text-lg font-medium mb-1"> {service.label} </h3>
                    <p className="text-2xs text-muted/75"> Transform your living spaces with our expert residential interior design services, tailored to reflect your unique style and needs. </p>
                </li>
            ))}

        </ul>
    )
}

export function ServiceListLayout () {
    return (
        <section className="relative my-8 py-12 px-3 sm:px-6 md:px-8">

            {/* <div className="absolute top-0 left-0 bg-linear-to-b from-background to-background/15 w-full h-full -z-10"></div> */}

            <div className="content-container flex flex-col gap-8 w-full">
                {/* Section Header */}
                <SectionHeader
                    title="Explore our range of interior design services"
                    desc="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus aperiam aspernatur, et repellendus facilis non dolore,  tailored to meet your unique needs."
                />

                {/* Service Cards */}
                <ServiceCardList/>
            </div>

        </section>
    )
}