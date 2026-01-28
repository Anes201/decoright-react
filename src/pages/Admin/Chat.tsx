
import ChatLayout  from "@components/chat/ChatLayout";

export default function AdminChatPage() {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8">
              <div className="relative flex flex-col gap-8 h-full">
                <h1 className="font-semibold text-lg md:text-2xl"> Admin Chat </h1>
                <ChatLayout/>
              </div>
            </section>
        </main>
    )
}


// export function ChatPage() {
//   return (
//     <main>
//       <ChatLayout />
//     </main>
//   )
// }



// import ChatView from '@components/chat/ChatView';
// import { useAdminChat } from '@/hooks/useAdminChat';
// import useAuth from '@/hooks/useAuth';

// export default function AdminChatPage() {
//   const { user } = useAuth();
//   const {
//     rooms,
//     selectedRoom,
//     setSelectedRoom,
//     messages,
//     messageText,
//     setMessageText,
//     sendMessage,
//     sendMedia,
//     messagesEndRef,
//     filter,
//     setFilter,
//     loading
//   } = useAdminChat();

//   const commonProps = {
//     contacts: rooms,
//     selectedContact: selectedRoom,
//     messages: messages,
//     messageText: messageText,
//     onMessageChange: setMessageText,
//     onSend: sendMessage,
//     onSendMedia: sendMedia,
//     onSelectContact: setSelectedRoom,
//     messagesEndRef: messagesEndRef as React.RefObject<HTMLDivElement>,
//     isAdmin: true,
//     currentUserId: user?.id,
//     filter,
//     setFilter,
//   };

//   if (loading && rooms.length === 0) {
//     return <div className="p-10 text-center text-muted">Loading conversations...</div>;
//   }

//   return (
//     <main className="h-full">
//       <ChatView
//         {...commonProps}
//       />
//     </main>
//   );
// }
