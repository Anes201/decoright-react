import { useChat } from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";
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

  const { user } = useAuth();
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

  const getChatPath = (roomId: string) => {
    const isAdminPath = window.location.pathname.startsWith('/admin');
    return isAdminPath ? PATHS.ADMIN.chatRoom(roomId) : PATHS.CLIENT.chatRoom(roomId);
  };

  const getLastMessagePreview = (contact: ChatRoom) => {
    const lastMsg = contact.last_message;
    if (!lastMsg) return null;

    let prefix = '';
    if (lastMsg.sender_id === user?.id) {
      prefix = 'You: ';
    } else if (lastMsg.profiles?.full_name) {
      prefix = `${lastMsg.profiles.full_name.split(' ')[0]}: `;
    }

    let content = '';
    if (lastMsg.message_type === 'TEXT') content = lastMsg.content;
    else if (lastMsg.message_type === 'IMAGE') content = '📷 Image';
    else if (lastMsg.message_type === 'AUDIO') content = '🎤 Voice message';
    else if (lastMsg.message_type === 'SYSTEM') content = lastMsg.content;

    return (
      <p className="text-2xs text-muted truncate mt-1">
        <span className="font-medium text-foreground/70">{prefix}</span>
        {content}
      </p>
    );
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
                <div className="h-fit w-12 aspect-square rounded-full border border-muted/45 overflow-hidden bg-emphasis flex items-center justify-center shrink-0">
                  <PencilSquare className="size-6 text-muted" />
                </div>
                <div className="flex flex-col w-full h-fit min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-sm truncate"> {contact?.service_requests?.request_code || 'Request'} </h3>
                    <span className="text-3xs text-muted shrink-0"> 
                      {contact?.last_message?.created_at 
                        ? new Date(contact.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : contact?.created_at ? new Date(contact.created_at).toLocaleDateString() : ''} 
                    </span>
                  </div>
                  <p className="text-3xs text-muted truncate"> {(contact?.service_requests?.service_types?.display_name_en || contact?.service_requests?.service_type || 'Unknown').replace(/_/g, ' ')} </p>
                  {getLastMessagePreview(contact)}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-auto">
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
