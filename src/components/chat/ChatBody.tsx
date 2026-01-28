
import MessageItem from '@components/chat/ChatMessageItem';
import useAuth from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useCallback, useEffect, useRef } from 'react';
import Spinner from '../common/Spinner';

export default function ChatBody() {

    const { user } = useAuth();
    const { messages, loadingMessages } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    console.log(loadingMessages)

    if (loadingMessages) return (
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full ">
            <Spinner status={loadingMessages}/>
            <span className="text-xs"> Getting Ready... </span>
        </div>
    )

    return (
        <div className="relative flex flex-col gap-8 w-full h-full py-4 px-2 overflow-y-scroll min-scrollbar" role="list">
            {messages.length > 0 ? (
                messages.map((m) => (
                    <div role="listitem" key={m.id}>
                        <MessageItem message={m} currentUserId={user?.id} />
                    </div>
                ))
            ) : (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                    <h4 className="font-semibold text-2xl mb-1">Chat Room</h4>
                    <p className="text-sm">Send a message to start a chat</p>
                </div>
            )}


            {/* anchor for scroll-to-bottom */}
            <div ref={messagesEndRef} />
        </div>
    );
}