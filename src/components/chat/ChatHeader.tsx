
import { Link } from 'react-router-dom';
import { PATHS } from '@/routers/Paths';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft, Eye } from '@/icons';

export default function ChatHeader({ selected, rightActions }: { selected?: any, rightActions?: React.ReactNode } = {}) {

    const { selectedRoom: hookContact } = useChat();
    const contact = selected || hookContact;

    // Determine the correct paths based on current route
    const isAdminPath = window.location.pathname.startsWith('/admin');
    const backPath = isAdminPath ? PATHS.ADMIN.CHAT : PATHS.CLIENT.CHAT;
    const requestDetailsPath = isAdminPath && contact?.service_requests?.id
        ? PATHS.ADMIN.requestServiceDetail(contact.service_requests.id)
        : null;

    return (
        <div className="flex items-center gap-3 w-full p-2 pb-4 border-b border-muted/15 shrink-0">
            <nav className="w-fit h-fit">
                <Link to={backPath} className="flex p-2 border border-muted/15 bg-surface/25 rounded-full hover:bg-emphasis transition-colors">
                    <ArrowLeft className="size-5 text-muted" />
                </Link>
            </nav>

            <div className="flex flex-col w-full h-fit min-w-0">
                <h3 className="font-medium text-sm truncate"> {contact?.service_requests?.request_code || 'Chat Room'} </h3>
                <p className="text-2xs text-muted truncate">
                    {contact?.service_requests?.service_types?.display_name_en || contact?.service_requests?.service_type_id?.replace(/_/g, ' ') || 'Unknown Service'}
                </p>
                {contact?.service_requests?.profiles?.full_name && (
                    <span className="text-3xs text-muted">Client: {contact.service_requests.profiles.full_name}</span>
                )}
            </div>

            {/* Right actions slot */}
            <div className="flex items-center gap-3 shrink-0">
                {rightActions ? rightActions : (
                    <>
                        <span className={`px-2.5 p-1 md:py-1.5 rounded-full text-xs font-medium cursor-default select-none
                            ${
                                contact?.service_requests?.status === 'Completed' ? 'bg-success/10 text-success border border-success/25' :
                                contact?.service_requests?.status === 'Cancelled' ? 'bg-muted/10 text-muted border border-muted/25' :
                                'bg-sky-400/10 text-sky-800 border border-sky-400/25'
                            }`}>
                            {contact?.service_requests?.status}
                        </span>
                        {requestDetailsPath && (
                            <Link
                                to={requestDetailsPath}
                                className="flex items-center gap-1.5 px-2.5 p-1 md:py-1.5 text-xs font-medium border border-muted/25 rounded-full hover:bg-emphasis transition-colors"
                                title="View Request Details"
                            >
                                <Eye className="size-4" />
                                <span className="hidden sm:inline">View Request</span>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}