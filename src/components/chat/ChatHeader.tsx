
import { Link } from 'react-router-dom';
import { ICONS } from '@/icons';
import { PATHS } from '@/routers/Paths';

export default function ChatHeader({request}: {request: any}) {
    return (
        <div className="flex items-center gap-3 w-full p-2 pb-4 border-b border-muted/15">
            <nav className="w-fit h-fit">
                <Link to={PATHS.CLIENT.CHAT} className="flex p-2 border border-muted/15 bg-surface/25 rounded-full">
                    <ICONS.arrowLeft className="size-5 text-muted"/>
                </Link>
            </nav>

            <div className="flex flex-col w-full h-fit">
                <h3 className="font-medium text-sm"> {request.request_code} </h3>
                <p className="text-2xs text-muted"> {(request.service_type || 'Unknown').replace(/_/g, ' ')} </p>
                <span className="text-2xs text-muted"> {new Date(request.created_at).toLocaleDateString()} </span>
            </div>

            {/* Right actions slot */}
            <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-xs request-status-${request.status.toLowerCase()}`}>
                    {request.status}
                </span>
            </div>
        </div>
    );
}