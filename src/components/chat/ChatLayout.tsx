
// ChatLayout.tsx - Main layout for chat pages
import ChatList from '@components/chat/ChatList';
import { Outlet } from 'react-router-dom';
import { useChat } from "@/hooks/useChat";
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatBubbleOvalLeftEllipsis } from '@/icons';
import { useTranslation } from 'react-i18next';

const FILTERS = ['all', 'unread', 'awaiting'] as const;

function ChatLayoutInner() {
  const { selectedRoom, roomIdFromUrl, filter, setFilter, allRooms } = useChat();
  const { t } = useTranslation();

  const allCount = allRooms.length;
  const unreadCount = allRooms.filter(r => r.unread_count && r.unread_count > 0).length;
  const awaitingCount = allRooms.filter(r => {
    const role = r.last_message?.profiles?.role;
    return role !== undefined && role !== 'admin' && role !== 'super_admin';
  }).length;

  const countFor = (f: typeof FILTERS[number]) => {
    if (f === 'unread') return unreadCount;
    if (f === 'awaiting') return awaitingCount;
    return allCount;
  };

  return (
    <div dir="ltr" className="flex gap-4 w-full h-full min-h-0">

      {/* Chat List Panel */}
      <div className={`${roomIdFromUrl && 'max-md:hidden'} flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 min-h-0 p-2 md:p-4 border border-muted/15 bg-surface rounded-2xl`}>

        {/* Filter pills */}
        <div className="flex gap-1 p-1 border border-muted/15 rounded-lg shrink-0">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                ${filter === f
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground hover:bg-primary/5'
                }`}
            >
              {t(`chat.filter_${f}`)}
              <span className={`text-[10px] min-w-[16px] text-center px-1 rounded-full leading-4
                ${filter === f ? 'bg-white/20 text-white' : 'bg-muted/15'}`}>
                {countFor(f)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto min-scrollbar">
          <ChatList />
        </div>
      </div>

      {/* Chat Room Panel */}
      <div className={`${!roomIdFromUrl && 'max-md:hidden'} flex flex-col w-full min-h-0 p-2 sm:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        {roomIdFromUrl || selectedRoom
          ?
          // ChatRoom Outlet
          <Outlet />
          :
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="p-6 rounded-full bg-primary/5 mb-6">
              <ChatBubbleOvalLeftEllipsis className="size-16 text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2"> {t('chat.select_request')} </h3>
            <p className="text-muted text-sm max-w-xs">{t('chat.select_description')}</p>
          </div>
        }
      </div>
    </div>
  );
}

export default function ChatLayout() {
  return (
    <ChatProvider>
      <ChatLayoutInner />
    </ChatProvider>
  );
}
