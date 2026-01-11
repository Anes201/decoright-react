
import { ChatLayout } from "@components/layout/Chat"

export  function ChatPage() {
    return (
        <main>
            <ChatLayout/>
        </main>
    )
}

// pages/client/ChatPage.tsx
import ChatView from '@components/chat/ChatView';
import { useChat } from '@/hooks/chat';
import { requests } from "@/constants";

// pages/admin/ChatPage.tsx
export default function AdminChatPage() {
  // initialize chat state for admin (replace initialContacts with ADMIN_CONTACTS if available)
  const chat = useChat({ initialContacts: [], currentUserId: 1 });

  const commonProps = {
    contacts: chat.contacts,
    selectedContact: chat.selectedContact,
    messages: chat.messages,
    messageText: chat.message,
    onMessageChange: chat.setMessage,
    onSend: chat.sendMessage,
    onSelectContact: chat.selectContact,
    messagesEndRef: chat.messagesEndRef as React.RefObject<HTMLDivElement>,
  };

  return (

    <main>
      <ChatView {...commonProps} contacts={requests} isAdmin renderRightHeaderActions={({selectedContact}) => (
        <div className="flex gap-2">
          {selectedContact} {/* not useable for now */}
          <button onClick={() => {/* open tooling */}}>Inspect</button>
          <button onClick={() => {/* escalate */}}>Escalate</button>
        </div>
      )}
      />
    </main>

  );
}
