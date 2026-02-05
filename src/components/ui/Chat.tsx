import type { Message, TextMsg, VoiceMsg, FileMsg } from "@/types/chat";

/** ---- Text message component ---- */
export function TextMessage({ message, currentUserId, ...props }: { message: TextMsg, currentUserId: string, props?: any }) {

  const messageFrom = message.sender_id === currentUserId ? 'send' : 'received'

  return (
    <div className={`message message--${messageFrom} flex flex-col gap-0.5 max-w-10/12`} data-kind="text" data-id={message.id} {...props}>
      <div className="message__bubble">
        <div className={`message__text message--text--${messageFrom} w-fit px-3 py-2 text-sm rounded-lg`}>{message.content}</div>
      </div>
      <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
}

/** ---- Voice message component ----
 *  Using a native <audio> control keeps it tiny and functional.
 */
export function VoiceMessage({ message, currentUserId, ...props }: { message: VoiceMsg, currentUserId: string, props?: any }) {

  const messageFrom = message.sender_id === currentUserId ? 'send' : 'received'

  return (
    <div className={`message message--${messageFrom}`} data-kind="voice" data-id={message.id} {...props}>
      <div className="message__bubble">
        {/* native audio controls — you can replace with custom UI later */}
        <audio controls src={message.media_url}>
          Your browser does not support the <code>audio</code> element.
        </audio>
      </div>
      <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
}



function isImageFile(filename: string) {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(filename);
}

/** ---- File / upload message component ---- */
export function FileMessage({ message, currentUserId }: { message: FileMsg, currentUserId: string }) {
  const { media_url: url, content: filename, attachments } = message;
  const size = attachments?.size; // Assuming size is in attachments jsonb if available
  const messageFrom = message.sender_id === currentUserId ? 'send' : 'received'

  const humanSize = (n?: number) =>
    !n ? '' : n > 1_000_000 ? `${Math.round(n / 1_000_000)} MB` : `${Math.round(n / 1000)} KB`;

  if (isImageFile(filename)) {
    // Image preview
    return (
      <div className={`message message--${messageFrom}`} data-kind="file" data-id={message.id}>
        <div className="message__bubble">
          <img
            src={url}
            alt={filename}
            loading="lazy"
            className="block max-w-80 rounded-xl"
          />
        </div>
        <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{humanSize(size)} • {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    );
  }

  // Non-image file fallback
  return (
    <div className={`message message--${messageFrom}`} data-kind="file" data-id={message.id}>
      <div className="message__bubble">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div>{filename}</div>
          <div>{humanSize(size)}</div>
        </a>
      </div>
      <div className="message__meta">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
}


/** ---- MessageItem: choose which component to render ---- */
export function MessageItem({ message, currentUserId, ...props }: { message: Message, currentUserId: string, [key: string]: any }) {
  switch (message.message_type) {
    case "TEXT":
      return <TextMessage message={message} currentUserId={currentUserId} {...props} />;
    case "AUDIO":
      return <VoiceMessage message={message} currentUserId={currentUserId} {...props} />;
    case "IMAGE":
    case "SYSTEM":
      return <FileMessage message={message} currentUserId={currentUserId} {...props} />;
    default:
      return null;
  }
}


