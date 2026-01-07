

import type { TextMsg, VoiceMsg, FileMsg } from "@/types/chat";

export const currentUserId = 1; // !!! Change this based on the user auth

/** ---- Text message component ---- */
export function TextMessage({ message, ...props }: { message: TextMsg, props:any }) {

  const messageFrom = message.uid === currentUserId ? 'send' : 'received'

  return (
    <div className={`message message--${messageFrom} flex flex-col gap-0.5 max-w-10/12`} data-kind="text" data-id={message.id} {...props}>
      <div className="message__bubble">
        <div className={`message__text message--text--${messageFrom} w-fit px-3 py-2 text-sm rounded-lg`}>{message.text}</div>
      </div>
      <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{message.timestamp}</div>
    </div>
  );
}

/** ---- Voice message component ----
 *  Using a native <audio> control keeps it tiny and functional.
 */
export function VoiceMessage({ message, ...props }: { message: VoiceMsg, props:any }) {

  const messageFrom = message.uid === currentUserId ? 'send' : 'received'

  return (
    <div className={`message message--${messageFrom}`} data-kind="voice" data-id={message.id} {...props}>
      <div className="message__bubble">
        {/* native audio controls — you can replace with custom UI later */}
        <audio controls src={message.url}>
          Your browser does not support the <code>audio</code> element.
        </audio>

        {/* optional duration display if provided
        {typeof message.duration === "number" && (
          <div className="message__duration text-2xs md:text-xs text-muted">{Math.round(message.duration)}s</div>
        )}*/}
      </div>
      <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{message.timestamp}</div>
    </div>
  );
}



function isImageFile(filename: string) {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(filename);
}

/** ---- File / upload message component ---- */
export function FileMessage({ message }: { message: FileMsg }) {
  const { url, filename, size } = message;
  const messageFrom = message.uid === currentUserId ? 'send' : 'received'

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
        <div className={`message__meta--${messageFrom} text-3xs md:text-2xs text-muted px-1`}>{humanSize(size)} • {message.timestamp}</div>
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
      <div className="message__meta">{message.timestamp}</div>
    </div>
  );
}


/** ---- MessageItem: choose which component to render ---- */
export function MessageItem({ message, ...props}:any) {
  switch (message.kind) {
    case "text":
      return <TextMessage message={message} {...props} />;
    case "voice":
      return <VoiceMessage message={message} {...props} />;
    case "file":
      return <FileMessage message={message} {...props} />;
    default:
      return null;
  }
}


