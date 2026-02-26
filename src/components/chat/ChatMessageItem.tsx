import { memo } from 'react';
import type { Message } from '@/types/chat';
import ZoomImage from '@components/ui/ZoomImage';
import VoiceMessagePlayer from '../ui/VoiceMessagePlayer';
import { useChat } from '@/hooks/useChat';
import useAuth from '@/hooks/useAuth';
import useConfirm from '@components/confirm/useConfirm';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


// src/utils/formatMessageTime.ts
export type FormatOptions = {
    locale?: string;    // e.g. 'en-GB' or undefined to use user locale
    hour12?: boolean;   // true = 12h (AM/PM), false = 24h, undefined = browser default
};

/**
 * Format message timestamp:
 * - Today -> "07:19 PM"
 * - Yesterday -> "Yesterday, 07:19 PM"
 * - Same year -> "Feb 11, 07:19 PM"
 * - Different year -> "2025 Feb 11, 07:19 PM"
 */
export function formatMessageTime(
    dateInput: string | number | Date,
    opts: FormatOptions = {}
): string {
    const { locale, hour12 } = opts;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const now = new Date();

    // start of day helpers (local)
    const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / msPerDay);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12 };
    const timePart = d.toLocaleTimeString(locale, timeOptions);

    if (diffDays === 0) {
        // today -> show only time
        return timePart;
    }

    if (diffDays === 1) {
        // yesterday -> localized "Yesterday" fallback
        // Many locales don't have a built-in "Yesterday" label, so keep English default.
        // If you want localized "yesterday", integrate with your i18n library.
        return `Yesterday, ${timePart}`;
    }

    // same year? omit year
    const sameYear = d.getFullYear() === now.getFullYear();
    const dateOptions: Intl.DateTimeFormatOptions = sameYear
        ? { month: 'short', day: '2-digit', ...timeOptions }               // "Feb 11, 07:19 PM"
        : { year: 'numeric', month: 'short', day: '2-digit', ...timeOptions }; // "2025 Feb 11, 07:19 PM"

    return d.toLocaleString(locale, dateOptions);
}


export default memo(function MessageItem({ message, currentUserId }:
    { message: Message; currentUserId?: string }) {
    const { t } = useTranslation();
    const { isAdmin } = useAuth();
    const { deleteMessage } = useChat();
    const confirm = useConfirm();

    const isMe = message.sender_id === currentUserId;
    const isSystem = message.message_type === 'SYSTEM';
    const canDelete = (isMe || isAdmin) && !isSystem;
    const showSender = isAdmin && !isMe && !isSystem && message.profiles;

    const containerClass = `flex flex-col group ${isSystem ? 'items-center' : isMe ? 'items-end' : 'items-start'}`;
    const bubbleClass = isSystem
        ? 'bg-muted/10 text-muted px-4 py-1.5 rounded-full text-2xs font-medium border border-muted/20'
        : `max-w-[75%] rounded-2xl relative
        ${isMe
            ? 'text-muted border border-muted/30 bg-surface'
            : 'text-foreground border border-muted/10 bg-emphasis'
        }`;

    const handleDelete = async () => {
        const ok = await confirm({
            title: t('chat.delete_title'),
            description: t('chat.delete_confirm'),
            confirmText: t('common.delete'),
            variant: 'destructive'
        });

        if (ok) {
            deleteMessage(message.id);
        }
    };


    return (
        <div className={containerClass}>
            {showSender && (
                <div className="flex items-center gap-1.5 px-2 mb-1.5">
                    <span className="text-3xs font-bold text-muted uppercase tracking-wider">
                        {message.profiles?.full_name}
                    </span>
                    {(message.profiles?.role === 'admin' || message.profiles?.role === 'super_admin') && (
                        <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border
                            ${message.profiles.role === 'super_admin' 
                                ? 'bg-amber-400/10 text-amber-600 border-amber-400/20' 
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                            {message.profiles.role.replace('_', ' ')}
                        </span>
                    )}
                </div>
            )}
            <div className={bubbleClass}>
                {isSystem ? (
                    <p>{message.content}</p>
                ) : (
                    <>
                        {message.message_type === 'TEXT' && <p className="whitespace-pre-wrap text-sm leading-relaxed px-3 py-2">{message.content}</p>}


                        {message.message_type === 'AUDIO' && (
                            <div className="flex flex-col gap-1 p-2 min-w-50 sm:min-w-64">

                                <VoiceMessagePlayer src={message.media_url || ''} />
                                {message.duration_seconds ? <span className="text-3xs opacity-70 px-1">{message.duration_seconds}s</span> : null}
                            </div>
                        )}


                        {message.message_type === 'IMAGE' && (
                            <div className="flex flex-col gap-2 p-2">
                                {message.media_url && (
                                    <div className="rounded-lg overflow-hidden border border-white/10 transition-opacity hover:opacity-95 max-w-full">
                                        <ZoomImage
                                            src={message.media_url}
                                            alt="Chat attachment"
                                            className="block w-full h-auto max-h-[400px] object-contain bg-black/5"
                                            crossOrigin="anonymous"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                {message.content && <p className="text-sm px-1">{message.content}</p>}
                            </div>
                        )}
                    </>
                )}

                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-12' : '-right-12'} 
                            flex items-center justify-center
                            size-9 rounded-full bg-surface border border-muted/20 shadow-lg
                            text-muted opacity-0 group-hover:opacity-100 
                            hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5
                            transition-all duration-200 z-10`}
                        title={t('chat.delete_message')}
                    >
                        <Trash2 size={18} />
                    </button>
                )}

            </div>
            <div className={`text-3xs text-muted px-1.5 mt-2 ${isMe ? 'text-right' : 'text-muted text-left'} hover:text-foreground cursor-default`}>
                <span>{formatMessageTime(message.created_at)}</span>
            </div>
        </div>
    );
});

