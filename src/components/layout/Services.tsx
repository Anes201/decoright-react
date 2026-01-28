import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service"
import ZoomImage from "../ui/ZoomImage"
import { ICONS } from "@/icons"

export function ServiceCardList() {
    const { i18n } = useTranslation()
    const [services, setServices] = useState<ServiceType[]>([])
    const [loading, setLoading] = useState(true)

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

    const getLocalizedLabel = (service: ServiceType) => {
        const lang = i18n.language
        if (lang === "ar" && service.display_name_ar) return service.display_name_ar
        if (lang === "fr" && service.display_name_fr) return service.display_name_fr
        return service.display_name_en
    }

    if (loading) {
        return (
            <div className="w-full flex justify-center py-20 text-muted">
                <ICONS.cog className="size-10 animate-spin" />
            </div>
        )
    }

    if (services.length === 0) {
        return null
    }

    return (
        <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

            {services.map((service) => (
                <li key={service.id} className="relative p-4">
                    <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-full h-full border border-muted/10 mask-b-to-transparent -z-10 rounded-2xl"></div>
                    <div className="w-full aspect-4/3 mb-4 overflow-hidden shadow-sm rounded-xl bg-muted/5">
                        {service.image_url ? (
                            <ZoomImage src={service.image_url} alt={service.display_name_en} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                <ICONS.photo className="size-12" />
                            </div>
                        )}
                    </div>

                    <h3 className="text-lg font-medium mb-0.5"> {getLocalizedLabel(service)} </h3>
                    <p className="text-2xs md:text-xs text-muted/75"> {service.description} </p>
                </li>
            ))}

        </ul>
    )
}
