
// src/hooks/useAudioRecorder.ts
import { useEffect, useRef, useState } from "react";

export function useAudioRecorder() {
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        try { mediaRef.current.stop(); } catch {}
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      chunksRef.current = [];
    };
  }, []);

  const start = async () => {
    setError(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        chunksRef.current = [];
        // stop tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mr.onerror = (ev) => {
        setError("Recording error");
        console.error(ev);
      };

      mr.start();
      setIsRecording(true);
    } catch (err: any) {
      setError(err?.message || "Could not access microphone");
      setIsRecording(false);
    }
  };

  const stop = () => {
    try {
      mediaRef.current?.stop();
    } catch (e) {
      console.warn("stop error", e);
    } finally {
      setIsRecording(false);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setError(null);
    chunksRef.current = [];
  };

  return { start, stop, reset, isRecording, audioBlob, error };
}
