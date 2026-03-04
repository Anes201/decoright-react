
import MessageItem from '@components/chat/ChatMessageItem';
import useAuth from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useCallback, useEffect, useRef } from 'react';
import Spinner from '../common/Spinner';
import { useTranslation } from 'react-i18next';

export default function ChatBody({ messages: propsMessages, messagesEndRef: propsRef, currentUserId }: { messages?: any[], messagesEndRef?: React.RefObject<HTMLDivElement>, currentUserId?: string } = {}) {

    const { t } = useTranslation();
    const { user } = useAuth();
    const { messages: hookMessages, loadingMessages } = useChat();

    const displayMessages = propsMessages || hookMessages;
    const internalRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = propsRef || internalRef;
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [displayMessages, scrollToBottom]);

    if (loadingMessages) return (
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full ">
            <Spinner status={loadingMessages} />
            <span className="text-xs"> {t('chat.getting_ready')} </span>
        </div>
    )

    return (
        <div className="flex flex-col gap-8 w-full px-2 mt-4" role="list">
            {displayMessages.length > 0 ? (
                displayMessages.map((m) => (
                    <div role="listitem" key={m.id}>
                        <MessageItem message={m} currentUserId={currentUserId || user?.id} />
                    </div>
                ))
            ) : (
                <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
                    <h4 className="font-semibold text-2xl mb-1">{t('chat.chat_room')}</h4>
                    <p className="text-sm text-muted">{t('chat.start_chat_hint')}</p>
                </div>
            )}


            {/* anchor for scroll-to-bottom */}
            <div ref={messagesEndRef} />
        </div>
    );
}