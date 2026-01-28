
export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM';

export type Message = {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  media_url?: string;
  duration_seconds?: number;
  created_at: string;
  attachments?: any;
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
    service_type: string;
    status: string;
    profiles: {
      id: string;
      full_name: string;
    };
  };
  last_message?: Message;
  unread_count?: number;
};

export type ClientContact = ChatRoom;