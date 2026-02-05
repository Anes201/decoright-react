

// ChatView.tsx (presentational)
import ChatHeader from '@components/chat/ChatHeader';
import ChatBody from '@components/chat/ChatBody';
import ChatForm from '@components/chat/ChatForm';



export default function ChatRoom() {

    return (
        <div className="flex flex-col h-full min-h-0">
            <ChatHeader />
            <div className="flex-1 min-h-0 overflow-y-auto">
                <ChatBody />
            </div>
            <div className="shrink-0">
                <ChatForm />
            </div>
        </div>

    )
}
