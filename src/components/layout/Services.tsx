import 'swiper/swiper.css';
import 'swiper/swiper-bundle.css';

import ZoomImage from "@components/ui/ZoomImage"
import { useEffect, useState, type CSSProperties } from 'react';
import { useTranslation } from "react-i18next"
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service"
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PCTALink, SCTALink } from '../ui/CTA';
import { PATHS } from '@/routers/Paths';
import { Cog, Photo } from '@/icons';

const dummyCardImg = "/living-room.png";
const dummyCardLamps = "/ceiling-lamps.svg";

export function ServiceCardItem({ service }: { service: ServiceType }) {

    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const getLocalizedLabel = (service: ServiceType) => {
        const lang = i18n.language
        if (lang === "ar" && service.display_name_ar) return service.display_name_ar
        if (lang === "fr" && service.display_name_fr) return service.display_name_fr
        return service.display_name_en
    }

    return (
        <li key={service.id} className="relative flex flex-col w-full h-full">

            <div className="flex flex-col gap-3 px-3 ring-1 ring-muted/25 rounded-xl bg-surface overflow-hidden">
                <div className="w-full aspect-4/3 border-t-0 border border-muted/25 rounded-b-lg overflow-clip">
                    {service.image_url ? (
                        <ZoomImage src={service.image_url} alt={service.display_name_en} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                            <Photo className="size-12" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col p-2 border-b-0 border border-muted/25 rounded-t-lg">
                    <h3 className="text-lg font-medium mb-0.5"> {getLocalizedLabel(service)} </h3>
                    <p className="text-2xs md:text-xs text-muted/75 pb-2"> {service.description} </p>
                </div>
            </div>
            <div className="relative flex justify-center mx-3 max-md:mb-8">
                <div className="relative top-0 flex p-3 w-full border-t-0 border border-muted/25 rounded-tl-none rounded-tr-none rounded-b-lg mt-auto">
                    <SCTALink to={`${PATHS.CLIENT.REQUEST_SERVICE}?type=${service.id}`} className="w-full">
                        {t("services.service_card_cta")}
                    </SCTALink>
                </div>
            </div>
        </li>

    )
}

export function ServiceCardList() {
    const [services, setServices] = useState<ServiceType[]>([])
    const [loading, setLoading] = useState(true)

    const [isMdSize, setIsMdSize] = useState(window.innerWidth >= 768);

    const { t } = useTranslation()
    // match Tailwind breakpoints (adjust if your config differs)
    const smQuery = "(min-width: 640px)";  // small screens -> 2 cols
    const lgQuery = "(min-width: 1024px)"; // large screens -> 3 cols (max)
    const getCols = () => {
        if (typeof window === "undefined") return 1;
        if (window.matchMedia(lgQuery).matches) return 3;
        if (window.matchMedia(smQuery).matches) return 2;
        return 1;
    };

    const [cols, setCols] = useState<number>(getCols);

    useEffect(() => {
        const handleResize = () => setIsMdSize(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                const data = await ServiceTypesService.getActive()
                setServices(data)
            } catch (error) {
                console.error("Failed to fetch service types:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return;
        const sm = window.matchMedia(smQuery);
        const lg = window.matchMedia(lgQuery);
        const handler = () => setCols(getCols());

        // modern event listener API
        sm.addEventListener?.("change", handler);
        lg.addEventListener?.("change", handler);
        // fallback for older browsers
        if (!sm.addEventListener) sm.addListener?.(handler);
        if (!lg.addEventListener) lg.addListener?.(handler);

        return () => {
            sm.removeEventListener?.("change", handler);
            lg.removeEventListener?.("change", handler);
            if (!sm.removeEventListener) sm.removeListener?.(handler);
            if (!lg.removeEventListener) lg.removeListener?.(handler);
        };
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-20 text-muted">
                <Cog className="size-10 animate-spin" />
            </div>
        )
    }

    // compute how many slots are missing on the last row
    // missing = 0..(cols-1) ; when services.length === 0 we treat missing as cols (full-span)
    const len = services.length;
    let missing = 0;
    if (len === 0) missing = cols; // empty => take whole row
    else {
        const r = len % cols;
        missing = r === 0 ? 0 : cols - r;
    }

    // decide whether to show the dummy: show when empty OR when there's at least 1 missing slot
    const showDummy = len === 0 || missing > 0;

    // the dummy span: when empty -> cols (full row), otherwise span = missing
    const dummySpan = len === 0 ? cols : missing; // 0..cols

    return (
        <>
            <ul className="max-md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
                {services.map((service) => (
                    <ServiceCardItem key={service.id} service={service} />
                ))}

                {showDummy && (
                <li aria-hidden
                    // use inline style so grid span is always correct regardless of Tailwind classes
                    style={{ gridColumn: `span ${Math.max(1, Math.min(dummySpan, cols))}` }}
                    className={"flex justify-center gap-2 border border-muted/25 rounded-xl bg-surface " + (dummySpan >= 2 ? "flex-row-reverse" : "flex-col")}
                >
                    <div className={"w-full h-full rounded-lg overflow-hidden " + (dummySpan >= 2 ? "aspect-4/3" : "aspect-4/2")}>
                        <img src={dummyCardImg} alt="" className="mt-4 w-full h-full object-cover object-center rtl:rotate-y-180" />
                    </div>

                    <div className="relative flex flex-col">

                        { dummySpan >= 2 &&
                            <div className="max-xl:hidden absolute top-0 start-0 w-55">
                                <img src={dummyCardLamps} alt="" className="w-full h-full object-center object-cover rtl:rotate-y-180" />
                            </div>
                        }

                        <div className="flex flex-col gap-4 p-4 justify-end h-full">
                            <h4 className={`font-medium ${dummySpan >= 2 ? "text-2xl lg:text-4xl" : "text-lg"}`}>
                                {t("services.service_card_title")}
                            </h4>

                            <p className={`text-muted/75 ${dummySpan >= 2 ? "text-xs md:text-sm" : "text-2xs md:text-xs"}`}>
                                {t("services.service_card_description")}
                            </p>
                        </div>

                        <div className="relative flex w-full p-4">
                            <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE} className="w-full">{t("services.service_card_cta")}</PCTALink>
                        </div>
                    </div>
                </li>
            )}
            </ul>
            <Swiper
                hidden={isMdSize}
                loop={services.length > 1}
                modules={[Pagination, Navigation]}
                pagination={{ dynamicBullets: true, clickable: true }}
                className="w-full h-full rounded-xl overflow-hidden"
                style={{ '--swiper-navigation-size': '30px', '--swiper-navigation-color': 'var(--acme-primary)', '--swiper-pagination-color': 'var(--acme-primary)' } as CSSProperties}
            >
                {services.map((service:ServiceType) => (
                    <SwiperSlide key={service.id} className="px-1">
                        <ServiceCardItem service={service} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
