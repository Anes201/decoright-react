import React, { useState, useRef, useEffect } from 'react';
import { AutoResizeTextarea } from "@components/ui/Input";
import { ICONS } from "@/icons";
import { useChat } from '@/hooks/useChat';

interface RequestLike { id: string }
interface Props { request?: RequestLike }

export default function ChatForm() {

    const { sendMessage, sendMedia, messageText, setMessageText } = useChat();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setRecordingTime(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (audioChunksRef.current.length > 0) {
                    setIsUploading(true);
                    try {
                        await sendMedia(audioBlob, 'AUDIO');
                    } finally {
                        setIsUploading(false);
                    }
                }
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = (cancel = false) => {
        if (!mediaRecorderRef.current) return;
        if (cancel) audioChunksRef.current = [];
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await sendMedia(file, 'IMAGE');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // const handleMessageSend = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!request || !user) return;

    //     // If there is an active recorder open, attempt to stop it (best-effort).
    //     if (recorderOpen) {
    //         // If VoiceRecorder is listening for this event it should stop and emit onSend -> we capture blob.
    //         window.dispatchEvent(new CustomEvent('voice:stop'));
    //         // wait briefly for recorder to flush the blob to state
    //         await new Promise(resolve => setTimeout(resolve, 300));
    //     }

    //     // If a recorded blob exists - send it instead of text
    //     if (recordedBlob) {
    //         await sendVoiceBlob(recordedBlob);
    //         return;
    //     }

    //     if (message.trim()) {
    //         const content = message.trim();
    //         setSending(true);
    //         setMessage(''); // Clear input early for better UX

    //         try {
    //             await ChatService.sendMessage({ requestId: request.id, content, messageType: 'TEXT' });
    //             // Real-time subscription will handle adding the message to the list
    //         } catch (err) {
    //             console.error('Error sending message:', err);
    //             // Restore message if send failed
    //             setMessage(content);
    //         } finally {
    //             setSending(false);
    //         }
    //     }
    // };


    return (
        <div className="flex flex-col gap-2 w-full">
            <form
                onSubmit={sendMessage}
                className={`flex items-center gap-2 sm:gap-4 w-full h-fit p-1.5 sm:p-2 border border-muted/25 bg-background/50 rounded-xl transition-all ${isRecording ? 'border-primary ring-1 ring-primary/20' : ''}`}
            >
                {isRecording ? (
                    <div className="flex flex-1 items-center gap-3 px-2">
                        <div className="flex items-center gap-2">
                            <span className="size-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium tabular-nums">{formatTime(recordingTime)}</span>
                        </div>
                        <div className="flex-1 text-sm text-muted animate-pulse">Recording voice message...</div>
                        <button
                            type="button"
                            onClick={() => stopRecording(true)}
                            className="p-1 px-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <AutoResizeTextarea
                        value={messageText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageText(e.target.value)}
                        placeholder={isUploading ? "Uploading..." : "Type your message..."}
                        disabled={isUploading}
                        minRows={1}
                        maxRows={5}
                        className="resize-none flex-1 h-fit px-2 outline-0 bg-transparent text-sm disabled:opacity-50"
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                )}

                <div className="flex items-center gap-1 sm:gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {!isRecording && !messageText.trim() && (
                        <>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-2 hover:bg-emphasis rounded-lg text-muted transition-colors disabled:opacity-50"
                                title="Upload Image"
                            >
                                <ICONS.photo className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={startRecording}
                                disabled={isUploading}
                                className="p-2 hover:bg-emphasis rounded-lg text-muted transition-colors disabled:opacity-50"
                                title="Record Voice"
                            >
                                <ICONS.microphone className="size-5" />
                            </button>
                        </>
                    )}

                    {isRecording ? (
                        <button
                            type="button"
                            onClick={() => stopRecording(false)}
                            className="p-2.5 bg-primary text-white rounded-lg shadow-sm hover:scale-105 transition-all"
                        >
                            <ICONS.paperAirplane className="size-5" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!messageText.trim() || isUploading}
                            className={`${(!messageText.trim() || isUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} p-2.5 bg-primary text-white rounded-lg shadow-sm transition-all`}
                        >
                            <ICONS.paperAirplane className="size-5" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
