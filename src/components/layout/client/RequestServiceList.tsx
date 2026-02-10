


import { useEffect, useState } from "react"
import { RequestService } from "@/services/request.service"
import { ICONS } from "@/icons"
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { useTranslation } from "react-i18next";

export function RequestServiceItem({ request }: any) {
    const { t, i18n } = useTranslation();
    const langSuffix = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '_en';

    const statusLabels: Record<string, string> = {
        'PENDING': t('requests.status.pending'),
        'UNDER_REVIEW': t('requests.status.under_review'),
        'APPROVED': t('requests.status.approved'),
        'IN_PROGRESS': t('requests.status.in_progress'),
        'COMPLETED': t('requests.status.completed'),
        'CANCELLED': t('requests.status.cancelled'),
        'REJECTED': t('requests.status.rejected')
    }

    const date = new Date(request.created_at).toLocaleDateString(i18n.language)

    return (
        <li className="flex max-md:flex-col gap-4 md:gap-6 w-full h-fit md:h-28 p-2 ring-1 ring-muted/10 bg-surface rounded-xl">
            <div className="flex max-md:flex-col gap-4 md:gap-12 items-center justify-between w-full md:px-8 font-medium text-sm text-muted">

                <div className="flex md:items-center justify-between w-full h-full">
                    <div className="flex max-md:flex-col justify-between gap-2 w-2/3">

                        <Link
                            to={PATHS.CLIENT.chatRoom(request.id)}
                            className="col col-id hover:underline text-primary font-semibold"
                        >
                            #{request.request_code || request.id.slice(0, 8)}
                        </Link>
                        <div className="col col-project-type capitalize flex gap-1">
                            <span>{request.service_types?.[`display_name${langSuffix}`] || request.service_types?.display_name_en || 'Unknown'}</span>
                            <span className="text-muted/50">•</span>
                            <span>{request.space_types?.[`display_name${langSuffix}`] || request.space_types?.display_name_en || 'Unknown'}</span>
                        </div>
                        <div className="col col-date max-sm:text-xs"><time dateTime={request.created_at}>{date}</time></div>
                    </div>
                    <div className={`col col-status text-xs px-1 py-0.5 xs:px-2 md:px-2.5 xs:py-1 min-w-max h-fit rounded-lg order-status-${request.status.replace(/\s+/g, '-').toLowerCase()}`} data-status={request.status}>
                        {statusLabels[request.status] || request.status}
                    </div>
                </div>

                {/* CTA */}
                <Link
                    to={PATHS.CLIENT.chatRoom(request.id)}
                    className="col flex items-center justify-between md:justify-end gap-8 w-full md:w-1/2 min-w-max hover:text-primary transition-colors"
                >
                    <span className="flex gap-2 items-center">
                        {ICONS.chatBubbleOvalLeftEllipsis({ className: 'size-5' })}
                        <span>{t('requests.open_chat')}</span>
                    </span>
                    <span> {ICONS.chevronRight({ className: 'size-4 rtl:rotate-180' })} </span>
                </Link>

            </div>
        </li>
    )
}


export function RequestServiceList() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation();

    useEffect(() => {
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

        fetchRequests()
    }, [])

    if (loading) return <div className="p-8 text-center text-muted">{t('requests.loading')}</div>
    if (error) return <div className="p-8 text-center text-danger">{t('common.error')}: {error}</div>
    if (requests.length === 0) return <div className="p-8 text-center text-muted">{t('requests.no_requests')}</div>

    return (
        <ol id="orders-table" role="table" aria-label="Your orders" className="flex flex-col gap-2 md:gap-4">
            {requests.map((request) => (
                <RequestServiceItem key={request.id} request={request} />
            ))}
        </ol>
    )
}
