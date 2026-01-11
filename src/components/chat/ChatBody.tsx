
import React from 'react';
import type { Message } from '@/types/chat';
import MessageItem from '@components/chat/ChatMessageItem';


export default function ChatBody({ messages, messagesEndRef, currentUserId = 1 }:
    {
        messages: Message[];
        messagesEndRef: React.RefObject<HTMLDivElement>;
        currentUserId?: number;
    }) {

    return (
        <div className="relative flex flex-col gap-8 w-full h-full py-4 px-2 overflow-y-scroll min-scrollbar" role="list">
            {messages.length > 0 ? (
                messages.map((m) => (
                    <div role="listitem" key={m.id}>
                        <MessageItem message={m} currentUserId={currentUserId} />
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