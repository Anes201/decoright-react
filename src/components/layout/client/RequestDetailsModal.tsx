
import { useEffect, useState } from "react"
import { RequestService } from "@/services/request.service"
import { useTranslation } from "react-i18next";
import { XMark, Calendar, MapPin, Squares2x2, DocumentText, PaperClip, ArrowLongRight } from '@/icons';
import Spinner from '@/components/common/Spinner';

interface RequestDetailsModalProps {
    requestId: string;
    isOpen: boolean;
    onClose: () => void;
}

const RequestDetailsModal = ({ requestId, isOpen, onClose }: RequestDetailsModalProps) => {
    const { t, i18n } = useTranslation();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const langSuffix = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '_en';

    useEffect(() => {
        if (isOpen && requestId) {
            fetchRequestDetails();
        }
    }, [isOpen, requestId]);

    const fetchRequestDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await RequestService.getRequestById(requestId);
            setRequest(data);
        } catch (err: any) {
            setError(err.message || t('requests.error_load'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const statusLabels: Record<string, string> = {
        'Submitted': t('requests.status.pending'),
        'Under Review': t('requests.status.under_review'),
        'Approved': t('requests.status.approved'),
        'In Progress': t('requests.status.in_progress'),
        'Completed': t('requests.status.completed'),
        'Cancelled': t('requests.status.cancelled'),
        'Rejected': t('requests.status.rejected')
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-surface border border-muted/20 rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-muted/10">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-foreground">
                            {t('requests.request_details')}
                        </h2>
                        {request && (
                            <span className="text-xs text-muted font-mono mt-1">
                                #{request.request_code || request.id.slice(0, 8)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-emphasis/10 rounded-full transition-colors"
                    >
                        <XMark className="size-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Spinner status={true} size="lg" />
                            <p className="text-sm text-muted font-medium">{t('requests.loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <p className="text-danger font-medium">{error}</p>
                            <button onClick={fetchRequestDetails} className="mt-4 text-primary font-bold hover:underline">
                                {t('common.retry')}
                            </button>
                        </div>
                    ) : request ? (
                        <>
                            {/* Service and Status */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted/60 flex items-center gap-2">
                                    <DocumentText className="size-4" />
                                    {t('requests.details.service_info')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/5 p-6 rounded-2xl border border-muted/10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted">{t('request_form.service_type')}</span>
                                        <span className="font-bold text-foreground">
                                            {request.service_types?.[`display_name${langSuffix}`] || request.service_types?.display_name_en}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted">{t('request_form.space_type')}</span>
                                        <span className="font-bold text-foreground">
                                            {request.space_types?.[`display_name${langSuffix}`] || request.space_types?.display_name_en}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted">{t('requests.request_details')}</span>
                                        <div className={`w-fit text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full order-status-${request.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                            {statusLabels[request.status] || request.status}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted">{t('request_form.completion_date')}</span>
                                        <span className="font-bold text-foreground flex items-center gap-2">
                                            <Calendar className="size-4 text-primary" />
                                            {request.completion_date ? new Date(request.completion_date).toLocaleDateString(i18n.language) : t('profile.not_provided')}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Location and Dimensions */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted/60 flex items-center gap-2">
                                    <MapPin className="size-4" />
                                    {t('requests.details.location_timeline')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted uppercase font-bold tracking-tight">{t('request_form.location')}</span>
                                            <span className="text-foreground font-medium">{request.location || t('profile.not_provided')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1">
                                            <Squares2x2 className="size-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted uppercase font-bold tracking-tight">{t('request_form.area_dimensions')}</span>
                                            <span className="text-foreground font-medium">
                                                {request.width && request.height ? `${request.width}m x ${request.height}m` : t('profile.not_provided')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Description */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted/60 flex items-center gap-2">
                                    <DocumentText className="size-4" />
                                    {t('requests.details.additional_details')}
                                </h3>
                                <div className="p-6 bg-muted/5 border border-muted/10 rounded-2xl">
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                        {request.description || t('request_form.description_placeholder')}
                                    </p>
                                </div>
                            </section>

                            {/* Attachments */}
                            {request.request_attachments && request.request_attachments.length > 0 && (
                                <section className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted/60 flex items-center gap-2">
                                        <PaperClip className="size-4" />
                                        {t('requests.details.attachments')}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {request.request_attachments.map((file: any) => (
                                            <a
                                                key={file.id}
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group aspect-square relative rounded-2xl overflow-hidden border border-muted/10 bg-muted/5 hover:border-primary/50 transition-all shadow-sm"
                                            >
                                                {file.content_type?.startsWith('image/') ? (
                                                    <img
                                                        src={file.file_url}
                                                        alt={file.file_name}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
                                                        <DocumentText className="size-8 text-muted/50" />
                                                        <span className="text-[10px] text-muted font-bold truncate w-full text-center">
                                                            {file.file_name}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ArrowLongRight className="size-6 text-white" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-muted/10 bg-emphasis/25 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-8 h-12 text-sm font-bold rounded-2xl border border-muted/15 hover:bg-surface transition-all active:scale-95"
                    >
                        {t('common.cancel')}
                    </button>
                    {request && (
                        <a
                            href={`/client/chat/${request.chat_rooms?.[0]?.id || request.id}`}
                            className="px-8 h-12 text-sm font-bold bg-primary text-on-primary rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <span>{t('requests.open_chat')}</span>
                            <ArrowLongRight className="size-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;
