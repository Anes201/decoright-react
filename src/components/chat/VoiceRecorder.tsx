// src/components/VoiceRecorder.tsx
import { useEffect, useMemo, useState } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { ICONS } from "@/icons";

export default function VoiceRecorder({
  onSend, onStart, onEnd, onCancel,
}: {
  onSend: (blob: Blob) => void | Promise<void>;
  onStart: () => void;
  onEnd: () => void;
  onCancel?: () => void;
}) {
  const { start, stop, reset, isRecording, audioBlob, error } = useAudioRecorder();
  const [sendAfterStop, setSendAfterStop] = useState(false);

  // create object URL for preview and revoke on change/unmount
  const audioUrl = useMemo(() => (audioBlob ? URL.createObjectURL(audioBlob) : null), [audioBlob]);
  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl);};
  }, [audioUrl]);

  // Listen for a global event that requests the recorder to stop and auto-send
  useEffect(() => {
    const handler = () => {
      // set flag so when audioBlob becomes available we auto-send
      setSendAfterStop(true);
      // best-effort stop the recorder
      try {
        stop();
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('voice:stop', handler as EventListener);
    return () => window.removeEventListener('voice:stop', handler as EventListener);
  }, [stop]);

  // When audioBlob appears and sendAfterStop is true, send it automatically
  useEffect(() => {
    if (sendAfterStop && audioBlob) {
      (async () => {
        try {
          await onSend(audioBlob);
          onEnd(); // call onEnd after successful send
        } catch (err) {
          console.error('VoiceRecorder auto-send failed', err);
        } finally {
          setSendAfterStop(false);
          reset();
        }
      })();
    }
  }, [sendAfterStop, audioBlob, onSend, reset, onEnd]);

  return (
    <div className="flex items-center gap-2">
      {!isRecording && (
        <button type="button" onClick={() => {start(); onStart();}} aria-label="Start voice recording"
        className="p-2 rounded-md ring-1 ring-muted/25 bg-emphasis">
          <ICONS.microphone />
        </button>
      )}

      {isRecording && (
        <>
            <button type="button" onClick={() => {stop(); reset(); onCancel?.(); }}
                className="bg-danger/10 p-2 rounded-lg ring-1 ring-danger/25"
            >
                <ICONS.trash className="size-5 text-danger"/>
            </button>

            <button type="button" onClick={() => {setSendAfterStop(true); try { stop(); } catch (err) { /* ignore */ } }} aria-label="Send recording"
            className="p-2 rounded-lg bg-primary"
            >
              <ICONS.paperAirplane className="size-5 text-white"/>
            </button>

        </>
      )}


      {error && <div role="alert" className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
