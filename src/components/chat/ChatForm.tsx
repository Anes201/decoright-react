
import React from 'react';
import { AutoResizeTextarea } from "@components/ui/Input";


export default function ChatForm({ message, setMessage, onSend }:
{
message: string;
setMessage: (v: string) => void;
onSend: (e?: React.FormEvent) => void;
}) {


return (
<form action={'.'} method="post" onSubmit={onSend} className="flex items-center gap-4 w-full h-fit p-2 border border-muted/25 rounded-xl">
<AutoResizeTextarea
value={message}
onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
placeholder="Write a message..."
minRows={1}
maxRows={5}
className="resize-none w-full h-fit px-2 outline-0"
/>


{/* Voice & Upload options */}
<div className="flex items-end gap-2 h-full">


<div className={`${message && 'hidden'} flex gap-2`}>
<button type="button" className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25">{/* ICONS.photo */}</button>
<button type="button" className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25">{/* ICONS.microphone */}</button>
</div>


<button type="submit" className={`${!message && 'hidden'} p-2 h-fit bg-primary rounded-lg `}>{/* ICONS.paperAirplane */}</button>
</div>
</form>
);
}