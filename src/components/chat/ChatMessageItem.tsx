
import { memo } from 'react';
import type { Message } from '@/types/chat';


export default memo(function MessageItem({ message, currentUserId = 1 }:
{ message: Message; currentUserId?: any }) {
const isMe = message.uid === currentUserId;


const containerClass = `flex ${isMe ? 'justify-end' : 'justify-start'}`;
const bubbleClass = `max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-primary text-white' : 'bg-surface/85 text-foreground'}`;


return (
    <div className={containerClass}>
        <div className={bubbleClass}>
        {message.kind === 'text' && <p className="whitespace-pre-wrap">{message.text}</p>}


        {message.kind === 'voice' && (
            <div className="flex items-center gap-2">
                <audio controls src={message.url} className="w-full" />
                {message.duration ? <span className="text-2xs">{message.duration}s</span> : null}
            </div>
        )}


        {message.kind === 'file' && (
            <div className="flex flex-col gap-2">
                <a href={message.url} target="_blank" rel="noreferrer" className="underline">{message.filename ?? 'file'}</a>
                {message.size ? <span className="text-2xs text-muted">{Math.round((message.size||0)/1024)} KB</span> : null}
                {message.url && (/\.(jpe?g|png|gif|webp)$/i).test(message.url) ? (
                    <img src={message.url} alt={message.filename ?? 'attachment'} className="mt-2 w-full rounded-md object-cover" />
                ) : null}
            </div>
        )}

        <div className="text-2xs text-muted mt-2 text-right">{message.timestamp}</div>
        </div>
    </div>
);
});