

import { Link } from "react-router-dom"
import { requests } from "@/constants"
import { ICONS } from "@/icons"

export function ServiceRequestItem({request}:any){
    return (
        <li className="flex max-md:flex-col gap-4 md:gap-6 w-full h-fit md:h-28 p-2 ring-1 ring-muted/10 bg-surface rounded-xl">


            <Link to={request.chat_url} className="flex max-md:flex-col gap-4 md:gap-12 items-center justify-between w-full  md:px-8 font-medium text-sm text-muted">

                <div className="flex md:items-center justify-between w-full h-full">

                    <div className="flex max-md:flex-col justify-between gap-2 w-2/3">
                        <div className="col col-id hover:underline">#{request.id}</div>
                        <div className="col col-project-type">{request.projectType}</div>
                        <div className="col col-date max-sm:text-xs"><time dateTime={request.date}>{request.date}</time></div>
                    </div>
                    <div className={`col col-status text-xs px-1 py-0.5 xs:px-2 md:px-2.5 xs:py-1 min-w-max h-fit rounded-lg order-status-${request.status}`} data-status="in_progress">{request.status_label}</div>
                </div>

                {/* CTA */}
                <div className="col flex items-center justify-between md:justify-end gap-8 w-full md:w-1/2 min-w-max">
                    <span className="flex gap-2"> <span><ICONS.chatBubbleOvalLeftEllipsis/></span> Open Chat </span>
                    <span> {ICONS.chevronRight({})} </span>
                </div>

            </Link>

        </li>
    )
}

export function RequestServiceList(){
    return (
        <ol id="orders-table" role="table" aria-label="Your orders" className="flex flex-col gap-2 md:gap-4">
            {requests.map((request) => (
                <ServiceRequestItem key={request.id} request={request} />
            ))}
        </ol>
    )
}

