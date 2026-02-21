
import { useEffect, useState } from "react"
import { RequestService } from "@/services/request.service"
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { useTranslation } from "react-i18next";
import { ChatBubbleOvalLeftEllipsis, ChevronRight, Eye, Trash, MapPin, Calendar, Squares2x2 } from "@/icons";
import useConfirm from "@/components/confirm/useConfirm";
import RequestDetailsModal from "./RequestDetailsModal";
import toast from "react-hot-toast";

export function RequestServiceItem({ request, onDelete }: { request: any, onDelete: (id: string) => void }) {
    const { t, i18n } = useTranslation();
    const confirm = useConfirm();
    const [detailsOpen, setDetailsOpen] = useState(false);

    const langSuffix = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '_en';

    const statusLabels: Record<string, string> = {
        'Submitted': t('requests.status.pending'),
        'Under Review': t('requests.status.under_review'),
        'Approved': t('requests.status.approved'),
        'In Progress': t('requests.status.in_progress'),
        'Completed': t('requests.status.completed'),
        'Cancelled': t('requests.status.cancelled'),
        'Rejected': t('requests.status.rejected')
    }

    const date = new Date(request.created_at).toLocaleDateString(i18n.language)

    const handleDelete = async () => {
        const isConfirmed = await confirm({
            title: t('common.delete'),
            description: t('requests.delete_confirm'),
            confirmText: t('common.delete'),
            cancelText: t('common.cancel'),
            variant: 'destructive'
        });

        if (isConfirmed) {
            try {
                await RequestService.deleteRequest(request.id);
                toast.success(t('requests.delete_success'));
                onDelete(request.id);
            } catch (err: any) {
                toast.error(err.message || t('common.error'));
            }
        }
    };

    return (
        <>
            <li className="group relative flex flex-col gap-4 w-full p-4 md:p-6 bg-surface border border-muted/10 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all">
                {/* ID and Status Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-primary/80 px-2 py-0.5 bg-primary/5 rounded">
                            #{request.request_code || request.id.slice(0, 8)}
                        </span>
                        <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full order-status-${request.status.replace(/\s+/g, '-').toLowerCase()}`}>
                            {statusLabels[request.status] || request.status}
                        </div>
                    </div>
                    <time className="text-[11px] text-muted font-medium" dateTime={request.created_at}>{date}</time>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <h3 className="text-base md:text-lg font-bold text-foreground">
                            {request.service_types?.[`display_name${langSuffix}`] || request.service_types?.display_name_en || 'Unknown Service'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-3.5" />
                                <span>{request.location || t('common.location') + ': ' + t('profile.not_provided')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Squares2x2 className="size-3.5" />
                                <span>{request.space_types?.[`display_name${langSuffix}`] || request.space_types?.display_name_en}</span>
                            </div>
                            {request.completion_date && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5" />
                                    <span>{new Date(request.completion_date).toLocaleDateString(i18n.language)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setDetailsOpen(true)}
                            className="p-2.5 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            title={t('requests.view_details')}
                        >
                            <Eye className="size-5" />
                        </button>
                        <Link
                            to={PATHS.CLIENT.chatRoom(request.chat_rooms?.[0]?.id || request.id)}
                            className="p-2.5 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            title={t('requests.open_chat')}
                        >
                            <ChatBubbleOvalLeftEllipsis className="size-5" />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="p-2.5 text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                            title={t('common.delete')}
                        >
                            <Trash className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Actions */}
                <div className="grid grid-cols-3 gap-2 md:hidden pt-4 border-t border-muted/5">
                    <button
                        onClick={() => setDetailsOpen(true)}
                        className="flex flex-col items-center gap-1 p-2 text-muted active:text-primary active:bg-primary/5 rounded-lg transition-all"
                    >
                        <Eye className="size-5" />
                        <span className="text-[10px] font-bold uppercase">{t('requests.view_details')}</span>
                    </button>
                    <Link
                        to={PATHS.CLIENT.chatRoom(request.chat_rooms?.[0]?.id || request.id)}
                        className="flex flex-col items-center gap-1 p-2 text-muted active:text-primary active:bg-primary/5 rounded-lg transition-all"
                    >
                        <ChatBubbleOvalLeftEllipsis className="size-5" />
                        <span className="text-[10px] font-bold uppercase">{t('nav.messages')}</span>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex flex-col items-center gap-1 p-2 text-muted active:text-danger active:bg-danger/5 rounded-lg transition-all"
                    >
                        <Trash className="size-5" />
                        <span className="text-[10px] font-bold uppercase">{t('common.delete')}</span>
                    </button>
                </div>

                {/* Decorative background element on hover */}
                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-primary/5 to-transparent rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </li>

            <RequestDetailsModal
                requestId={request.id}
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
            />
        </>
    )
}


export function RequestServiceList() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation();

    const fetchRequests = async () => {
        try {
            const data = await RequestService.getMyRequests()
            setRequests(data)
        } catch (err: any) {
            setError(err.message || t('requests.error_load'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleItemDeleted = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted font-medium">{t('requests.loading')}</p>
        </div>
    );

    if (error) return (
        <div className="p-12 text-center bg-danger/5 border border-danger/10 rounded-2xl">
            <p className="text-danger font-medium">{t('common.error')}: {error}</p>
            <button onClick={() => fetchRequests()} className="mt-4 text-sm font-bold text-primary hover:underline">
                Try again
            </button>
        </div>
    );

    if (requests.length === 0) return (
        <div className="flex flex-col items-center justify-center p-12 md:p-20 text-center border-2 border-dashed border-muted/10 rounded-3xl bg-surface/50">
            <div className="size-16 rounded-2xl bg-muted/5 flex items-center justify-center mb-6">
                <ChatBubbleOvalLeftEllipsis className="size-8 text-muted/30" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t('requests.no_requests')}</h3>
            <p className="text-sm text-muted max-w-xs mb-8">
                Request your first design service and our team will get back to you shortly.
            </p>
            <Link
                to={PATHS.CLIENT.REQUEST_SERVICE}
                className="inline-flex items-center gap-2 px-8 h-12 bg-primary text-on-primary font-bold rounded-2xl hover:opacity-90 transition-opacity active:scale-95 duration-200"
            >
                <span>{t('requests.no_requests_cta')}</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
            </Link>
        </div>
    );

    return (
        <ol id="orders-table" role="table" aria-label="Your orders" className="flex flex-col gap-4 md:gap-6">
            {requests.map((request) => (
                <RequestServiceItem key={request.id} request={request} onDelete={handleItemDeleted} />
            ))}
        </ol>
    )
}
