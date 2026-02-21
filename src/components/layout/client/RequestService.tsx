
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
import { CheckCircle } from "@/icons";


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

                if (services.length === 1) setServiceType(services[0].id);
                if (spaces.length === 1) setSpaceType(spaces[0].id);
            } catch (err) {
                console.error("Failed to fetch form options:", err);
            }
        };
        fetchOptions();
    }, []);

    if (authLoading) return (
        <div className="flex flex-col items-center justify-center gap-4 h-64">
            <Spinner status={authLoading} />
            <span className="text-xs text-muted">{t('common.loading')}</span>
        </div>
    )
    if (!user) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!spaceType || !serviceType) {
            setError(t('request_form.error_fields'))
            return
        }

        setLoading(true)
        setError(null)

        try {
            const uploading = files.some(f => f.status === 'uploading');
            if (uploading) {
                setError(t('request_form.error_uploading'));
                setLoading(false);
                return;
            }

            const payload: any = {
                service_type_id: serviceType,
                space_type_id: spaceType,
            };

            if (location) payload.location = location;

            const parsedWidth = width ? parseFloat(width) : null;
            const parsedHeight = height ? parseFloat(height) : null;

            if (parsedWidth !== null && parsedWidth < 0) {
                setError('Width cannot be negative.');
                setLoading(false);
                return;
            }
            if (parsedHeight !== null && parsedHeight < 0) {
                setError('Height cannot be negative.');
                setLoading(false);
                return;
            }

            if (parsedWidth !== null) payload.width = parsedWidth;
            if (parsedHeight !== null) payload.height = parsedHeight;
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
        <div className="w-full flex flex-col gap-8 mb-16 py-2">

            {/* ── Page Header ─────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h2 className="font-bold text-2xl tracking-tight">{t('request_form.form_title')}</h2>
                    <p className="text-sm text-muted max-w-xl">{t('request_form.form_description')}</p>
                </div>
            </div>

            {/* ── Error Banner ─────────────────────────────────── */}
            {error && (
                <div className="flex items-center gap-3 px-4 py-3 bg-danger/8 border border-danger/20 rounded-xl text-sm text-danger">
                    <span className="shrink-0">⚠</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} id="service-request-form" className="flex flex-col gap-10">

                {/* ── Row: two-column on desktop ───────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                    {/* Left Column */}
                    <div className="flex flex-col gap-8">

                        {/* Service & Space */}
                        <div className="flex flex-col gap-6 p-6 bg-surface border border-muted/15 rounded-2xl">
                            <p className="text-xs font-bold text-muted tracking-widest uppercase">Service Details</p>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-service-type" className="flex items-center justify-between text-xs text-muted font-medium px-0.5">
                                    <span>{t('request_form.service_type')}</span>
                                    <span className="text-[10px] text-danger/60 font-bold uppercase tracking-tighter">Required</span>
                                </label>
                                <SelectMenu
                                    options={serviceTypes.map(s => ({ label: s[`display_name${langSuffix}`] || s.display_name_en, value: s.id }))}
                                    placeholder={t('request_form.service_type_placeholder')}
                                    id="select-service-service-type"
                                    value={serviceTypes.find(s => s.id === serviceType) ? { label: serviceTypes.find(s => s.id === serviceType)![`display_name${langSuffix}`] || serviceTypes.find(s => s.id === serviceType)!.display_name_en, value: serviceType } : undefined}
                                    onChange={(option: any) => setServiceType(option.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-space-type" className="flex items-center justify-between text-xs text-muted font-medium px-0.5">
                                    <span>{t('request_form.space_type')}</span>
                                    <span className="text-[10px] text-danger/60 font-bold uppercase tracking-tighter">Required</span>
                                </label>
                                <SelectMenu
                                    options={spaceTypes.map(s => ({ label: s[`display_name${langSuffix}`] || s.display_name_en, value: s.id }))}
                                    placeholder={t('request_form.space_type_placeholder')}
                                    id="select-service-space-type"
                                    value={spaceTypes.find(s => s.id === spaceType) ? { label: spaceTypes.find(s => s.id === spaceType)![`display_name${langSuffix}`] || spaceTypes.find(s => s.id === spaceType)!.display_name_en, value: spaceType } : undefined}
                                    onChange={(option: any) => setSpaceType(option.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Location & Date */}
                        <div className="flex flex-col gap-6 p-6 bg-surface border border-muted/15 rounded-2xl">
                            <p className="text-xs font-bold text-muted tracking-widest uppercase">Location & Timeline</p>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="request-location" className="text-xs text-muted font-medium px-0.5">
                                    {t('request_form.location')}
                                </label>
                                <Input
                                    id="request-location"
                                    placeholder={t('request_form.location_placeholder')}
                                    value={location}
                                    onChange={(e: any) => setLocation(e.target.value)}
                                />
                                <p className="text-[11px] text-muted/60 px-0.5">Optional — leave blank if not applicable.</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="service-request-date" className="text-xs text-muted font-medium px-0.5">
                                    {t('request_form.completion_date')}
                                </label>
                                <DateInput
                                    name="service-request-date"
                                    id="service-request-date"
                                    className="h-12 w-full px-3 text-sm text-muted bg-emphasis/75 border border-muted/15 rounded-lg outline-0 focus:outline-1 focus:outline-primary/45 hover:border-muted/30 transition-colors cursor-pointer"
                                />
                                <p className="text-[11px] text-muted/60 px-0.5">Optional — leave blank if you're flexible on timing.</p>
                            </div>

                            {/* Dimensions */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-muted font-medium px-0.5">
                                    {t('request_form.area_dimensions')}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        id="request-width"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder={t('request_form.width')}
                                        value={width}
                                        onChange={(e: any) => setWidth(e.target.value)}
                                    />
                                    <Input
                                        id="request-height"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder={t('request_form.height')}
                                        value={height}
                                        onChange={(e: any) => setHeight(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">

                        {/* Description */}
                        <div className="flex flex-col gap-6 p-6 bg-surface border border-muted/15 rounded-2xl">
                            <p className="text-xs font-bold text-muted tracking-widest uppercase">Additional Details</p>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="request-service-description" className="text-xs text-muted font-medium px-0.5">
                                    {t('request_form.description')}
                                </label>
                                <textarea
                                    name="description"
                                    id="request-service-description"
                                    rows={7}
                                    placeholder={t('request_form.description_placeholder')}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 text-sm bg-emphasis/75 border border-muted/15 rounded-lg outline-0 focus:outline-1 focus:outline-primary/45 hover:border-muted/30 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="flex flex-col gap-6 p-6 bg-surface border border-muted/15 rounded-2xl">
                            <p className="text-xs font-bold text-muted tracking-widest uppercase">Attachments</p>
                            <FileUploadPanel stagedFiles={stagedFiles} />
                        </div>

                    </div>
                </div>

                {/* ── Submit Actions ────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-muted/10">
                    <PButton
                        type="submit"
                        form="service-request-form"
                        loading={loading}
                        className="w-full sm:w-auto px-10"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="size-4" />
                            {t('request_form.submit')}
                        </div>
                    </PButton>
                    <SCTALink to={-1} className="w-full sm:w-auto">{t('request_form.cancel')}</SCTALink>
                </div>

            </form>
        </div>
    )
}
