
// ChatLayout.tsx - Main layout for chat pages
import ChatList from '@components/chat/ChatList';
import { Outlet } from 'react-router-dom';
import { useChat } from "@/hooks/useChat";
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatBubbleOvalLeftEllipsis } from '@/icons';
import { useTranslation } from 'react-i18next';

function ChatLayoutInner() {
  const { selectedRoom, roomIdFromUrl } = useChat();
  const { t } = useTranslation();

  return (
    <div dir="ltr" className="flex gap-4 w-full h-full min-h-0">

      {/* Chat List Panel */}
      <div className={`${roomIdFromUrl && 'max-md:hidden'} flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 min-h-0 p-2 md:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        <h3 className="font-medium text-sm p-2.5 border border-muted/15 rounded-lg shrink-0"> {t('chat.requests')} </h3>
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
