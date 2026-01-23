import React, { useState, useRef } from 'react';
import useAuth from "@/hooks/useAuth";
import VoiceRecorder from "@/components/chat/VoiceRecorder";
import Spinner from "@components/common/Spinner";
import { AutoResizeTextarea } from "@components/ui/Input";
import { ICONS } from "@/icons";
import { ChatService } from "@/services/chat.service";

interface RequestLike { id: string }
interface Props { request?: RequestLike }

export default function ChatForm({ request }: Props) {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [recorderOpen, setRecorderOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const sendVoiceBlob = async (blob: Blob) => {
        if (!request || !user) return;
        setSending(true);
        try {
            if ((ChatService as any).sendVoice) {
                await (ChatService as any).sendVoice({ requestId: request.id, file: blob, messageType: 'VOICE' });
                return;
            }

            // Fallback optimistic local dispatch
            const url = URL.createObjectURL(blob);
            const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const detail = {
                id: tempId,
                kind: 'voice',
                uid: user.id ?? 'me',
                url,
                duration: undefined,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                meta: { local: true },
            };
            window.dispatchEvent(new CustomEvent('chat:outgoingVoice', { detail }));

            // Revoke temp URL after some time
            setTimeout(() => URL.revokeObjectURL(url), 30_000);
        } catch (err) {
            console.error('Error sending voice message:', err);
        } finally {
            setSending(false);
            setRecordedBlob(null);
            setRecorderOpen(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request || !user) return;

        // If there is an active recorder open, attempt to stop it (best-effort).
        if (recorderOpen) {
            // If VoiceRecorder is listening for this event it should stop and emit onSend -> we capture blob.
            window.dispatchEvent(new CustomEvent('voice:stop'));
            // wait briefly for recorder to flush the blob to state
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // If a recorded blob exists - send it instead of text
        if (recordedBlob) {
            await sendVoiceBlob(recordedBlob);
            return;
        }

        if (message.trim()) {
            const content = message.trim();
            setSending(true);
            setMessage(''); // Clear input early for better UX

            try {
                await ChatService.sendMessage({ requestId: request.id, content, messageType: 'TEXT' });
                // Real-time subscription will handle adding the message to the list
            } catch (err) {
                console.error('Error sending message:', err);
                // Restore message if send failed
                setMessage(content);
            } finally {
                setSending(false);
            }
        }
    };

    // Handler passed to VoiceRecorder so it only stores the blob (we send on submit)
    const handleRecorded = (blob: Blob) => {
        setRecordedBlob(blob);
        setRecorderOpen(false);
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        const url = URL.createObjectURL(file);
        const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const detail = {
            id: tempId,
            kind: 'file',
            uid: user.id ?? 'me',
            url,
            name: file.name,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            meta: { local: true },
        };
        window.dispatchEvent(new CustomEvent('chat:outgoingFile', { detail }));
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
        // reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-4 w-full h-fit p-2 border border-muted/25 rounded-xl">

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />

            {!recorderOpen && (
                <AutoResizeTextarea value={message} minRows={1} maxRows={5}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="resize-none w-full h-fit px-2 outline-0"
                    aria-label="Message text"
                />
            )}

            <div className="flex items-end gap-2 h-full">
                {/* Voice & Upload options */}
                <div className={`${message ? 'hidden' : ''} flex gap-2`}>

                    {/* Upload photo/file button */}
                    {!recorderOpen && (
                        <button type="button" aria-label="Attach file" onClick={handleFileButtonClick} className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25"><ICONS.photo/></button>
                    )}

                    {/* Toggle recorder UI */}
                    <VoiceRecorder onSend={handleRecorded} onStart={() => setRecorderOpen(true)} onEnd={() => setRecorderOpen(false)} onCancel={() => setRecorderOpen(false)} />

                </div>
                {message && !recorderOpen &&
                    <button type="submit" disabled={sending} aria-label="Send message" className={`p-2 h-fit bg-primary rounded-lg ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        {sending ? <Spinner size='sm'/> : <ICONS.paperAirplane className="size-5 text-white"/>}
                    </button>
                }
            </div>
        </form>
    );
}