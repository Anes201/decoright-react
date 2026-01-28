
// ChatView.tsx (presentational)
import ChatList from '@components/chat/ChatList';
import { Outlet } from 'react-router-dom';
import { ICONS } from '@/icons';
import { useChat } from "@/hooks/useChat";


export default function ChatLayout() {

  const { selectedRoom, roomIdFromUrl } = useChat();
  console.log(roomIdFromUrl, 'url')
  return (
    <div className="flex gap-4 w-full h-full">

      <div className={`${roomIdFromUrl && 'max-md:hidden'} flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 h-full p-2 md:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        <h3 className="font-medium text-sm p-2.5 border border-muted/15 rounded-lg"> Requests </h3>
        <ChatList />
      </div>
      <div className={`${!roomIdFromUrl && 'max-md:hidden'} flex flex-col w-full h-full p-2 sm:p-4 border border-muted/15 bg-surface rounded-2xl`}>
        { roomIdFromUrl || selectedRoom
          ?
          // ChatRoom Outlet
          <Outlet/>

          :
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="p-6 rounded-full bg-primary/5 mb-6">
              <ICONS.chatBubbleOvalLeftEllipsis className="size-16 text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2"> Select a Request </h3>
            <p className="text-muted text-sm max-w-xs"> Choose one of your service requests from the list to view its chat history and send messages. </p>
          </div>
        }
      </div>
    </div>
  );
}
