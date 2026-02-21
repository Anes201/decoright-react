import { useChat } from "@/hooks/useChat";
import type { ChatRoom } from "@/types/chat";
import Spinner from "@components/common/Spinner";
import { PencilSquare } from "@/icons";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";

export default function ChatList({
  contacts,
  onSelect,
  selectedId,
}: {
  contacts?: ChatRoom[],
  onSelect?: (c: ChatRoom) => void,
  selectedId?: string,
} = {}) {

  const { rooms: hookRooms, selectedRoom: hookSelectedRoom, loadingRooms, setSelectedRoom } = useChat();

  const displayRooms = contacts || hookRooms;
  const currentSelectedId = selectedId || hookSelectedRoom?.id;

  const handleSelect = (contact: ChatRoom) => {
    if (onSelect) {
      onSelect(contact);
    } else {
      setSelectedRoom(contact);
    }
  };

  // Determine the correct path based on current route
  const getChatPath = (roomId: string) => {
    // Check if we're in admin context by looking at the current URL
    const isAdminPath = window.location.pathname.startsWith('/admin');
    return isAdminPath ? PATHS.ADMIN.chatRoom(roomId) : PATHS.CLIENT.chatRoom(roomId);
  };

  return (
    <ul className="space-y-2 overflow-y-auto min-scrollbar">

      {loadingRooms && !contacts ? (
        <li className="flex flex-col gap-2 p-4 text-center text-xs">
          <Spinner size="sm" status={loadingRooms} />
          <span>Loading requests...</span>
        </li>

      ) : displayRooms.length > 0 ? (
        displayRooms.map((contact: any) => (
          <li key={contact.id}>
            <Link
              to={getChatPath(contact.id)}
              onClick={() => handleSelect(contact)}
              className={`block w-full rounded-lg cursor-pointer border border-muted/10 hover:border-muted/15 overflow-hidden ${currentSelectedId === contact.id ? 'bg-surface ring-1 ring-primary/20' : 'bg-surface/45 hover:bg-surface'}`}
            >
              <div className="flex items-center gap-2 w-full h-fit p-2">
                {/* Avatar */}
                <div className="h-fit w-12 aspect-square rounded-full border border-muted/45 overflow-hidden bg-emphasis flex items-center justify-center shrink-0">
                  <PencilSquare className="size-6 text-muted" />
                </div>

                {/* Context */}
                <div className="flex flex-col w-full h-fit min-w-0">
                  <h3 className="font-medium text-sm truncate"> {contact?.service_requests?.request_code || 'Request'} </h3>
                  <p className="text-2xs text-muted truncate"> {(contact?.service_requests?.service_type || 'Unknown').replace(/_/g, ' ')} </p>
                  <span className="text-3xs text-muted"> {contact?.created_at ? new Date(contact.created_at).toLocaleDateString() : ''} </span>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${contact?.service_requests?.status === 'Completed' ? 'bg-success/10 text-success' :
                    contact?.service_requests?.status === 'Cancelled' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                    }`}>
                    {contact?.service_requests?.status}
                  </span>
                  {contact.unread_count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                      {contact.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <li className="p-4 text-center text-xs text-muted">No requests found</li>
      )}
    </ul>
  );
}
