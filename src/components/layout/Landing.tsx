
const HeroImgSrc = "/hero-image.jpg";
import { ICONS } from "@/icons"
import { PATHS } from "@/routers/Paths"
import { PCTALink, SCTALink } from "../ui/CTA"
import useAuth from "@/hooks/useAuth";

export function HeroContentCheckListItem({ content }: { content: string }) {
    return (
        <li className="text-2xs lg:text-xs text-muted/75 px-1 py-0.5 lg:px-2 lg:py-1 w-fit bg-surface/75 rounded-full"> ✓ {content} </li>
    )
}

export function HeroContentCheckList() {
    return (
        <ul className="flex flex-wrap gap-2 w-full">
            <HeroContentCheckListItem content={'Personalized Design Consultations'} />
            <HeroContentCheckListItem content={'Space Planning'} />
            <HeroContentCheckListItem content={'Custom Furniture & Decor'} />
        </ul>
    )
}

export function HeroContent({ settings }: { settings: Record<string, string> }) {
    const heroSubtitle = settings.home_hero_subtitle || "Space & Decoration";
    const heroTitle = settings.home_hero_title || "Interior Design That Elevates Everyday Living";
    const heroDescription = settings.home_hero_description || "Welcome to Deco Right, your trusted partner for exquisite interior design and decor solutions. We bring your vision to life with creativity and style.";

    return (
        <div className="flex flex-col justify-center gap-8 h-full">
            <div className="flex flex-col gap-2">
                <h3 className="font-medium text-xs md:text-sm"> {heroSubtitle} </h3>
                <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    {heroTitle.includes("Design") ? (
                        <>
                            {heroTitle.split("Design")[0]}
                            <span className="text-primary"> Design </span>
                            {heroTitle.split("Design")[1]}
                        </>
                    ) : heroTitle}
                </h1>
            </div>
            <p className="text-2xs lg:text-xs text-muted/75 max-w-lg">
                {heroDescription}
            </p>

            {/* Hero Check List */}
            <HeroContentCheckList />
        </div>
    )
}

export function HeroCTA() {
    const { user } = useAuth();
    return (

        <div className="flex max-md:flex-col gap-4">
            {user
                ?
                <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE}> Request Service </PCTALink>
                :
                <PCTALink to={PATHS.SERVICE_LIST}> Services </PCTALink>
            }
            <SCTALink to={PATHS.PROJECT_LIST} className="flex items-center justify-center gap-2"> Projects & Categories <ICONS.arrowLongRight className="size-4 text-foreground" /> </SCTALink>
        </div>
    )
}

export function HeroMetrics() {
    return (
        <div className="relative flex justify-center items-center gap-4 md:gap-6 w-full p-4">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-emphasis/75 rounded-2xl -z-10 mask-r-to-transparent mask-r-to-95%"></div>
            <div className="flex flex-col items-center w-full">
                <span className="font-bold text-2xl md:text-4xl">4.8<span className="font-semibold text-sm md:text-lg">/5</span> </span>
                <span className="text-3xs md:text-2xs text-muted"> Customer Rating </span>
            </div>
            <div className="flex flex-col items-center w-full">
                <span className="flex items-center font-bold text-2xl md:text-4xl">500<span className="font-semibold text-sm md:text-lg">+</span> </span>
                <span className="text-3xs md:text-2xs text-muted"> Projects Completed </span>
            </div>
            <div className="flex flex-col items-center w-full">
                <span className="flex items-center font-bold text-2xl md:text-4xl">10<span className="font-semibold text-sm md:text-lg">+</span> </span>
                <span className="text-3xs md:text-2xs text-muted"> Years of Experience </span>
            </div>
        </div>
    )
}


export function HeroImg() {
    return (
        <div className="max-md:hidden overflow-hidden">
            <img src={HeroImgSrc} alt="Hero Image" className="object-cover w-full h-full" />
        </div>
    )
}

export function Hero({ settings = {} }: { settings?: Record<string, string> }) {
    return (

        <section className="content-container relative flex items-center w-full">

            {/* <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] bg-primary/10 rounded-4xl mask-l-to-transparent mask-l-to-10% overflow-hidden"></div> */}
            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-10% overflow-hidden"></div>

            <div className="relative flex w-full h-full max-md:border md:border-s md:border-y border-muted/25 rounded-4xl">

                <div className="flex w-full h-fit rounded-4xl overflow-hidden">

                    {/* <div className="flex flex-col justify-center gap-4 w-full p-4 md:p-8 bg-linear-0 from-surface/15 to-primary/25 rounded-3xl md:rounded-s-3xl md:rounded-e-none"> */}
                    <div className="flex flex-col justify-center gap-4 w-full p-4 md:p-8">
                        <div className="flex flex-col gap-8 h-full">
                            {/* Content */}
                            <HeroContent settings={settings} />

                            {/* CTA Buttons */}
                            <HeroCTA />
                        </div>

                        {/* Metrics data & Ratings */}
                        {/* <HeroMetrics /> */}

                    </div>

                    {/* Hero Image */}
                    <HeroImg />

                </div>
            </div>

            {/* <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] bg-primary/10 rounded-4xl mask-r-to-transparent mask-r-to-10% overflow-hidden"></div> */}
            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-10% overflow-hidden"></div>

        </section>

    )
}