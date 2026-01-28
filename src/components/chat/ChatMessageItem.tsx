
import { memo } from 'react';
import type { Message } from '@/types/chat';
import ZoomImage from '../ui/ZoomImage';



export default memo(function MessageItem({ message, currentUserId }:
    { message: Message; currentUserId?: string }) {
    const isMe = message.sender_id === currentUserId;
    const isSystem = message.message_type === 'SYSTEM';


    const containerClass = `flex ${isSystem ? 'justify-center' : isMe ? 'justify-end' : 'justify-start'}`;
    const bubbleClass = isSystem
        ? 'bg-muted/10 text-muted px-4 py-1.5 rounded-full text-2xs font-medium border border-muted/20'
        : `max-w-[75%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface border border-muted/10 text-foreground rounded-tl-none'}`;


    return (
        <div className={containerClass}>
            <div className={bubbleClass}>
                {isSystem ? (
                    <p>{message.content}</p>
                ) : (
                    <>
                        {message.message_type === 'TEXT' && <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>}


                        {message.message_type === 'AUDIO' && (
                            <div className="flex flex-col gap-1 min-w-[200px] sm:min-w-[250px] py-1">
                                <audio
                                    controls
                                    src={message.media_url}
                                    className="w-full h-10"
                                    crossOrigin="anonymous"
                                />
                                {message.duration_seconds ? <span className="text-3xs opacity-70 px-1">{message.duration_seconds}s</span> : null}
                            </div>
                        )}


                        {message.message_type === 'IMAGE' && (
                            <div className="flex flex-col gap-2 py-1">
                                {message.media_url && (
                                    <div className="rounded-lg overflow-hidden border border-white/10 shadow-sm transition-opacity hover:opacity-95 max-w-full">
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

                        <div className={`text-3xs mt-2 ${isMe ? 'text-white/70 text-right' : 'text-muted text-left'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});