import useAuth from "@/hooks/useAuth";
import MessageItem from '@components/chat/ChatMessageItem';
import { useEffect, useRef, useState } from 'react';
import { ChatService } from '@/services/chat.service';

export default function ChatBody({ request }:any) {

    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);

    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const mountedRef = useRef(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // mark mounted for safety when async resolves
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // Fetch messages for the selected request
    useEffect(() => {
        const fetchMessages = async () => {
        if (!request) return;

        try {
            const data = await ChatService.getMessages(request.id);
            const formattedMessages = data.map((m: any) => ({
            id: m.id,
            kind: m.message_type.toLowerCase() === 'text' ? 'text' :
                m.message_type.toLowerCase() === 'image' ? 'file' :
                m.message_type.toLowerCase() === 'audio' ? 'voice' : 'text',
            uid: m.sender_id,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: m.content,
            url: m.media_url,
            filename: m.content || 'attachment',
            }));
            if (!mountedRef.current) return;
            setMessages(formattedMessages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
        };

        fetchMessages();

        // Subscribe to real-time updates
        let subscription: any;
        if (request) {
        subscription = ChatService.subscribeToRequestChat(request.id, (newMessage: any) => {
            const formattedMsg = {
            id: newMessage.id,
            kind: newMessage.message_type.toLowerCase() === 'text' ? 'text' :
                newMessage.message_type.toLowerCase() === 'image' ? 'file' :
                newMessage.message_type.toLowerCase() === 'audio' ? 'voice' : 'text',
            uid: newMessage.sender_id,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: newMessage.content,
            url: newMessage.media_url,
            filename: newMessage.content || 'attachment',
            };
            setMessages(prev => {
            // Avoid duplicate messages if already present (e.g. from optimistic update or fetch)
            if (prev.find(m => m.id === formattedMsg.id)) return prev;
            return [...prev, formattedMsg];
            });
        });
        }

        // optimistic / local events (text, voice, file)
        const handleOutgoingGeneric = (ev: Event) => {
            const d = (ev as CustomEvent).detail;
            if (!d) return;
            // If event carries requestId and it doesn't match, ignore (best-effort)
            if (d.requestId && request && d.requestId !== request.id) return;

            const optimistic = {
                id: d.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
                kind: d.kind ?? (d.url ? 'file' : d.blob ? 'voice' : 'text'),
                uid: d.uid ?? user?.id ?? 'me',
                timestamp: d.timestamp ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: d.text ?? d.caption ?? '',
                url: d.url ?? null,
                filename: d.name ?? d.filename ?? (d.url ? 'attachment' : undefined),
                meta: { local: true, ...d.meta },
            };
            setMessages(prev => {
                if (prev.find(m => m.id === optimistic.id)) return prev;
                return [...prev, optimistic];
            });
        };

        window.addEventListener('chat:outgoingMessage', handleOutgoingGeneric as EventListener);
        window.addEventListener('chat:outgoingFile', handleOutgoingGeneric as EventListener);
        window.addEventListener('chat:outgoingVoice', handleOutgoingGeneric as EventListener);

        return () => {
        if (subscription) subscription.unsubscribe();
        window.removeEventListener('chat:outgoingMessage', handleOutgoingGeneric as EventListener);
        window.removeEventListener('chat:outgoingFile', handleOutgoingGeneric as EventListener);
        window.removeEventListener('chat:outgoingVoice', handleOutgoingGeneric as EventListener);
        };
    }, [request, user]);

    return (
        <div className="relative flex flex-col gap-8 w-full h-full py-4 px-2 overflow-y-auto min-scrollbar" role="list">
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