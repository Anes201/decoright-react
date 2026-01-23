
/** ---- Types ---- */
export type BaseMessage = {
  id: string;
  uid: string;
  timestamp: string; // ISO or human string
};

export type TextMsg = BaseMessage & {
  kind: "text";
  text: string;
};

export type VoiceMsg = BaseMessage & {
  kind: "voice";
  url: string;       // audio file URL
  duration?: number; // seconds
  filename: string;
};

export type FileMsg = BaseMessage & {
  kind: "file";
  url: string;       // file URL
  filename: string;
  size?: number;     // bytes
};

export type Message = TextMsg | VoiceMsg | FileMsg;

export type Contact = any;
