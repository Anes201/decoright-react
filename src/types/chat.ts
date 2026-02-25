
/** ---- Types ---- */
export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM';

export type Message = {
  id: string;
  request_id: string;
  chat_room_id?: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  media_url?: string;
  duration_seconds?: number;
  created_at: string;
  attachments?: any;
  profiles?: {
    id: string;
    full_name: string;
    role: string;
  } | null;
};

export type ChatRoom = {
  id: string;
  request_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  service_requests: {
    id: string;
    request_code: string;
    service_type_id: string;
    status: string;
    service_types: {
      name: string;
      display_name_en: string;
    };
    profiles: {
      id: string;
      full_name: string;
    };
  };
  last_message?: Message;
  unread_count?: number;
};

// For backward compatibility while refactoring components
export type ClientContact = ChatRoom;
export type Contact = ChatRoom;
export type TextMsg = Message;
export type VoiceMsg = Message;
export type FileMsg = Message;