


import { useEffect, useState } from "react"
import { RequestService } from "@/services/request.service"
import { ICONS } from "../../icons"
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"

export function RequestServiceItem({ request }: any) {
    const statusLabels: Record<string, string> = {
        'PENDING': 'Pending',
        'UNDER_REVIEW': 'Under Review',
        'APPROVED': 'Approved',
        'IN_PROGRESS': 'In Progress',
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled',
        'REJECTED': 'Rejected'
    }

    const date = new Date(request.created_at).toLocaleDateString()

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
                            <span>{request.service_types?.display_name_en || 'Unknown'}</span>
                            <span className="text-muted/50">•</span>
                            <span>{request.space_types?.display_name_en || 'Unknown'}</span>
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
                        <span>Open Chat</span>
                    </span>
                    <span> {ICONS.chevronRight({ className: 'size-4' })} </span>
                </Link>

            </div>
        </li>
    )
}


export function RequestServiceList() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await RequestService.getMyRequests()
                setRequests(data)
            } catch (err: any) {
                setError(err.message || "Failed to load requests")
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    if (loading) return <div className="p-8 text-center text-muted">Loading requests...</div>
    if (error) return <div className="p-8 text-center text-danger">Error: {error}</div>
    if (requests.length === 0) return <div className="p-8 text-center text-muted">No service requests found.</div>

    return (
        <ol id="orders-table" role="table" aria-label="Your orders" className="flex flex-col gap-2 md:gap-4">
            {requests.map((request) => (
                <RequestServiceItem key={request.id} request={request} />
            ))}
        </ol>
    )
}
