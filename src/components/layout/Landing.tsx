
const HeroImgSrc = "/hero-image.jpg";
import { ICONS } from "@/icons"
import { PATHS } from "@/routers/Paths"
import { PCTALink, SCTALink } from "../ui/CTA"
import useAuth from "@/hooks/useAuth";
import { Trans, useTranslation } from "react-i18next";

export function HeroContentCheckListItem({ content }: { content: string }) {
    return (
        <li className="text-2xs lg:text-xs text-muted/75 px-1 py-0.5 lg:px-2 lg:py-1 w-fit bg-surface/75 rounded-full"> ✓ {content} </li>
    )
}

export function HeroContent() {

    const { t } = useTranslation('pages')
    const { user } = useAuth();

    return (
        <>
        <div className="flex flex-col justify-center gap-8 h-full">
            <div className="flex flex-col gap-2">
                <h3 className="font-medium text-xs md:text-sm"> { t('pages:landing.hero.tag') } </h3>
                <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    <Trans i18nKey="pages:landing.hero.title" components={[<span className="text-primary" />]} />
                </h1>
            </div>
            <p className="text-2xs lg:text-xs text-muted/75 max-w-lg">
                { t('pages:landing.hero.description') }
            </p>

            {/* Hero Check List */}
            <ul className="flex flex-wrap gap-2 w-full">
                <HeroContentCheckListItem content={ t('pages:landing.hero.features.consultation') } />
                <HeroContentCheckListItem content={ t('pages:landing.hero.features.planning') }  />
                <HeroContentCheckListItem content={ t('pages:landing.hero.features.custom') } />
            </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex max-md:flex-col gap-4">
            { user
                ? <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE}> { t('pages:landing.hero.cta_request_service') } </PCTALink>
                : <PCTALink to={PATHS.SERVICE_LIST}> { t('pages:landing.hero.cta_service_list') }  </PCTALink>
            }
            <SCTALink to={PATHS.PROJECT_LIST} className="flex items-center justify-center gap-2">
                { t('pages:landing.hero.cta_project_list') }
                <ICONS.arrowLongRight className="rtl:rotate-180 size-4 text-foreground"/>
            </SCTALink>

        </div>
        </>
    )
}

export function HeroSection() {
    return (

        <section className="content-container relative flex items-center w-full">

            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-10% overflow-hidden" />
            <div className="relative flex max-md:flex-col w-full h-full max-md:border md:border-s md:border-y border-muted/25 rounded-4xl overflow-hidden">

                <div className="flex flex-col justify-center gap-4 w-full">
                    <div className="flex flex-col gap-8 w-full h-full p-4 md:p-8">
                        {/* Content */}
                        <HeroContent />
                    </div>
                </div>

                {/* Hero Image */}
                <div className="flex w-2/3 h-full">
                    <img src={HeroImgSrc} alt="Hero Image" className="object-cover w-full" />
                </div>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-10% overflow-hidden" />

        </section>

    )
}