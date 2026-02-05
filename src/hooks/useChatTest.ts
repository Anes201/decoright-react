import { useCallback, useRef, useState, useEffect } from 'react';
import { ChatService } from '@/services/chat.service';
import type { Message as ChatMessage, ClientContact as Contact, MessageType } from '@/types/chat';

export interface UseChatOptions {
  requestId: string | number;
  autoLoadMessages?: boolean;
  autoScroll?: boolean;
}

export interface UseChatReturn {
  // State
  messages: ChatMessage[];
  selectedContact: Contact | null;
  messageText: string;
  loading: boolean;
  error: string | null;

  // Actions
  setMessageText: (text: string) => void;
  selectContact: (contact: Contact | null) => void;
  sendMessage: (content: string) => Promise<void>;
  sendFile: (file: File) => Promise<void>;
  sendVoice: (blob: Blob) => Promise<void>;
  loadMessages: () => Promise<void>;
  clearError: () => void;

  // Refs
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollToBottom: () => void;
}

/**
 * useChat hook — manages a single chat session (request/contact).
 * Handles message fetching, real-time subscriptions, and sending with optimistic UI.
 */
export function useChat(opts: Partial<UseChatOptions> = {}): UseChatReturn {
  const { requestId, autoLoadMessages = true, autoScroll = true } = opts;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Normalize server message to UI shape
  const normalizeMessage = useCallback((m: any): ChatMessage => ({
    id: m.id,
    message_type: m.message_type as MessageType,
    sender_id: m.sender_id,
    content: m.content ?? '',
    media_url: m.attachment_url ?? undefined,
    created_at: m.created_at,
  }), []);

  // Load messages from server
  const loadMessages = useCallback(async () => {
    if (!requestId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await ChatService.getMessages(String(requestId));
      const normalized = (data || []).map(normalizeMessage);
      setMessages(normalized);
    } catch (err: any) {
      console.error('Error loading messages:', err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [requestId, normalizeMessage]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!requestId || !autoLoadMessages) return;

    loadMessages();

    // Subscribe to new messages
    subscriptionRef.current = ChatService.subscribeToRequestChat(
      String(requestId),
      (newMessage: any) => {
        const normalized = normalizeMessage(newMessage);
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === normalized.id)) return prev;
          return [...prev, normalized];
        });
      }
    );

    return () => {
      subscriptionRef.current?.unsubscribe?.();
    };
  }, [requestId, autoLoadMessages, loadMessages, normalizeMessage]);

  // Send text message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !requestId) return;

    const trimmed = content.trim();
    const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Optimistic add
    const optimistic: ChatMessage = {
      id: localId,
      message_type: 'TEXT',
      sender_id: 'me',
      created_at: new Date().toISOString(),
      content: trimmed,
    };

    setMessages(prev => [...prev, optimistic]);
    setMessageText('');

    try {
      // NOTE: This now requires chatRoomId and senderId. 
      // In a real scenario, you'd fetch the chatRoomId for the requestId first.
      // For now, we'll try to find a way to get it or pass what we have.
      const resp = await ChatService.sendMessage({
        requestId: String(requestId), // Property name should be requestId for the object form
        content: trimmed,
        messageType: 'TEXT',
      });

      if (resp?.id) {
        // Replace optimistic with real message
        setMessages(prev =>
          prev.map(m => m.id === localId ? normalizeMessage(resp) : m)
        );
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err?.message ?? 'Failed to send message');
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== localId));
    }
  }, [requestId, normalizeMessage]);

  // Send file
  const sendFile = useCallback(async (file: File) => {
    if (!file || !requestId) return;

    const localId = `local-file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const url = URL.createObjectURL(file);

    const optimistic: ChatMessage = {
      id: localId,
      message_type: 'IMAGE',
      sender_id: 'me',
      created_at: new Date().toISOString(),
      attachment_url: url,
      content: file.name,
    };

    setMessages(prev => [...prev, optimistic]);

    try {
      const resp = await ChatService.sendMessage(
        { requestId: String(requestId), content: file.name, messageType: "IMAGE", mediaUrl: url });

      if (resp?.id) {
        setMessages(prev =>
          prev.map(m => m.id === localId ? normalizeMessage(resp) : m)
        );
      }
    } catch (err: any) {
      console.error('Error sending file:', err);
      setError(err?.message ?? 'Failed to send file');
      setMessages(prev => prev.filter(m => m.id !== localId));
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }
  }, [requestId, normalizeMessage]);

  // Send voice
  const sendVoice = useCallback(async (blob: Blob) => {
    if (!blob || !requestId) return;

    const localId = `local-voice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const url = URL.createObjectURL(blob);

    const optimistic: ChatMessage = {
      id: localId,
      message_type: 'AUDIO',
      sender_id: 'me',
      created_at: new Date().toISOString(),
      attachment_url: url,
      content: 'voice.webm',
    };

    setMessages(prev => [...prev, optimistic]);

    try {
      const resp = await ChatService.sendMessage(
        { requestId: String(requestId), content: 'voice.webm', messageType: "AUDIO", mediaUrl: url }
      );

      if (resp?.id) {
        setMessages(prev =>
          prev.map(m => m.id === localId ? normalizeMessage(resp) : m)
        );
      }
    } catch (err: any) {
      console.error('Error sending voice:', err);
      setError(err?.message ?? 'Failed to send voice message');
      setMessages(prev => prev.filter(m => m.id !== localId));
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }
  }, [requestId, normalizeMessage]);

  const clearError = useCallback(() => setError(null), []);
  const selectContact = useCallback((contact: Contact | null) => setSelectedContact(contact), []);

  return {
    messages,
    selectedContact,
    messageText,
    loading,
    error,
    setMessageText,
    selectContact,
    sendMessage,
    sendFile,
    sendVoice,
    loadMessages,
    clearError,
    messagesEndRef,
    scrollToBottom,
  };
}
