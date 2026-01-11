
import { ChatLayout } from "@components/layout/Chat"

export function ClientChatPage() {
    return (
        <main>
            <ChatLayout/>
        </main>
    )
}

// pages/client/ChatPage.tsx
import ChatView from '@components/chat/ChatView';
import { useChat } from '@/hooks/chat';

export default function ChatPage() {
  const chat = useChat({ initialContacts: [], currentUserId: 1 });
    return (
        <main>
            <ChatView
                contacts={chat.contacts}
                selectedContact={chat.selectedContact}
                messages={chat.messages}
                messageText={chat.message}
                onMessageChange={chat.setMessage}
                onSend={chat.sendMessage}
                onSelectContact={chat.selectContact}
                messagesEndRef={chat.messagesEndRef as React.RefObject<HTMLDivElement>}
                isAdmin={false}
            />
        </main>
    );
}
