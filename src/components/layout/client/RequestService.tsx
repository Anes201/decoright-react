
import useAuth from "@/hooks/useAuth";
import FileUploadPanel from '@components/ui/FileUploadPanel'
import Spinner from '@components/common/Spinner'
import { useState, useEffect } from 'react'
import { useStagedFiles } from '@/hooks/useStagedFiles'
import { PButton } from '@components/ui/Button'
import { SCTALink } from '@components/ui/CTA'
import { SelectMenu } from '@components/ui/Select'
import { DateInput, Input } from '@components/ui/Input'
import { RequestService as ReqSvc } from '@/services/request.service'
import { ServiceTypesService, type ServiceType } from '@/services/service-types.service'
import { SpaceTypesService, type SpaceType } from '@/services/space-types.service'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routers/Paths'
import { useTranslation } from "react-i18next";


export default function RequestServiceLayout() {
    const { user, loading: authLoading } = useAuth()

    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([])
    const [spaceType, setSpaceType] = useState<string>("")
    const [serviceType, setServiceType] = useState<string>("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [width, setWidth] = useState("")
    const [height, setHeight] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const langSuffix = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '_en';

    const stagedFiles = useStagedFiles(ReqSvc.uploadAttachment);
    const { files } = stagedFiles;

    useEffect(() => {
        if (!authLoading && !user) {
            navigate(PATHS.SIGNUP)
        }
    }, [user, authLoading, navigate])

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [services, spaces] = await Promise.all([
                    ServiceTypesService.getActive(),
                    SpaceTypesService.getActive(),
                ]);
                setServiceTypes(services);
                setSpaceTypes(spaces);

                // Auto-select if there's only one option
                if (services.length === 1) setServiceType(services[0].id);
                if (spaces.length === 1) setSpaceType(spaces[0].id);
            } catch (err) {
                console.error("Failed to fetch form options:", err);
            }
        };
        fetchOptions();
    }, []);

    if (authLoading) return <div className="flex flex-col gap-4"> <Spinner status={authLoading} /> <span className="text-sm">{t('common.loading')}</span> </div>
    if (!user) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!spaceType || !serviceType || !location) {
            setError(t('request_form.error_fields'))
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Check if all files are uploaded
            const uploading = files.some(f => f.status === 'uploading');
            if (uploading) {
                setError(t('request_form.error_uploading'));
                setLoading(false);
                return;
            }

            const payload: any = {
                service_type_id: serviceType,
                space_type_id: spaceType,
                location: location,
            };

            if (width) payload.width = parseFloat(width);
            if (height) payload.height = parseFloat(height);
            if (description) payload.description = description;

            const request = await ReqSvc.createRequest(payload);

            const attachments = files
                .filter(f => f.status === 'complete' && f.url)
                .map(f => ({
                    name: f.name,
                    url: f.url as string,
                    size: f.size,
                    type: f.mime
                }));

            if (attachments.length > 0) {
                await ReqSvc.addRequestAttachments(request.id, attachments);
            }

            navigate(PATHS.CLIENT.REQUEST_SERVICE_LIST)
        } catch (err: any) {
            setError(err.message || t('request_form.error_submit'))
            console.error("Submit error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="relative flex flex-col gap-6 w-full h-full p-3 md:p-8 mb-20">
            <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl bg-surface -z-10 mask-b-to-transparent mask-b-to-100%"></div>

            {/* Header */}

            <div className="flex justify-between gap-4">
                <div className="space-y-2 w-full">
                    <h2 className='font-semibold text-lg'> {t('request_form.form_title')} </h2>
                    <p className='text-2xs md:text-xs'> {t('request_form.form_description')} </p>
                </div>

                {/* CTA */}
                <div className="hidden md:flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-fit">
                    <PButton type="submit" form="service-request-form"
                        disabled={loading}
                        title={t('request_form.submit')}
                        className="w-fit h-fit"
                    >
                        <Spinner status={loading}> {t('request_form.submit')} </Spinner>
                    </PButton>
                </div>
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full h-fit" id="service-request-form">

                {error && <p className="text-xs text-danger"> {error} </p>}
                {/* Input Data */}
                <div className="flex max-md:flex-col gap-8 w-full h-full">

                    <div className="flex flex-col gap-6 w-full h-full">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="select-service-design-style" className="font-medium text-xs text-muted px-1"> {t('request_form.service_type')} </label>
                            <SelectMenu
                                options={serviceTypes.map(s => ({ label: s[`display_name${langSuffix}`] || s.display_name_en, value: s.id }))}
                                placeholder={t('request_form.service_type_placeholder')}
                                id="select-service-service-type"
                                value={serviceTypes.find(s => s.id === serviceType) ? { label: serviceTypes.find(s => s.id === serviceType)![`display_name${langSuffix}`] || serviceTypes.find(s => s.id === serviceType)!.display_name_en, value: serviceType } : undefined}
                                onChange={(option: any) => setServiceType(option.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">

                            <label htmlFor="select-service-space-type" className="font-medium text-xs text-muted px-1"> {t('request_form.space_type')} </label>
                            <SelectMenu
                                options={spaceTypes.map(s => ({ label: s[`display_name${langSuffix}`] || s.display_name_en, value: s.id }))}
                                placeholder={t('request_form.space_type_placeholder')}
                                id="select-service-space-type"
                                value={spaceTypes.find(s => s.id === spaceType) ? { label: spaceTypes.find(s => s.id === spaceType)![`display_name${langSuffix}`] || spaceTypes.find(s => s.id === spaceType)!.display_name_en, value: spaceType } : undefined}
                                onChange={(option: any) => setSpaceType(option.value)}
                                required
                            />
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <label htmlFor="select-service-design-style" className="group/date font-medium text-xs text-muted px-1"> {t('request_form.completion_date')} </label>
                            <DateInput name="service-request-date" id="service-request-date"
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />

                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="request-location" className="font-medium text-xs text-muted px-1"> {t('request_form.location')} </label>
                            <Input
                                id="request-location"
                                placeholder={t('request_form.location_placeholder')}
                                value={location}
                                onChange={(e: any) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-xs text-muted px-1"> {t('request_form.area_dimensions')} </label>
                            <div className="flex gap-4">
                                <Input
                                    id="request-width"
                                    type="number"
                                    placeholder={t('request_form.width')}
                                    value={width}
                                    onChange={(e: any) => setWidth(e.target.value)}
                                />
                                <Input
                                    id="request-height"
                                    type="number"
                                    placeholder={t('request_form.height')}
                                    value={height}
                                    onChange={(e: any) => setHeight(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-4">
                            <PButton type="submit" form="service-request-form"
                                className="w-full h-fit"
                                disabled={loading}
                            >
                                <Spinner status={loading}> {t('request_form.submit')} </Spinner>
                            </PButton>
                            <SCTALink to={-1} className="w-full"> {t('request_form.cancel')} </SCTALink>
                        </div>

                    </div>

                    {/* Second Form Column */}
                    <div className="flex flex-col gap-6 w-full h-full">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="request-service-description" className="font-medium text-xs text-muted px-1"> {t('request_form.description')} </label>
                            <textarea
                                name="description"
                                id="request-service-description"
                                rows={6}
                                placeholder={t('request_form.description_placeholder')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45"
                            >

                            </textarea>
                        </div>

                        <FileUploadPanel stagedFiles={stagedFiles} />
                    </div>

                </div>
            </form>

        </div>
    )
}
