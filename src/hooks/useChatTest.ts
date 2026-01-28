import { useCallback, useRef, useState, useEffect } from 'react';
import { ChatService } from '@/services/chat.service';
import type { Message as ChatMessage, Contact } from '@/types/chat';

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
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

/**
 * useChat hook — manages a single chat session (request/contact).
 * Handles message fetching, real-time subscriptions, and sending with optimistic UI.
 */
export function useChat(opts: UseChatOptions = {}): UseChatReturn {
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
    kind: m.message_type?.toLowerCase() === 'text' ? 'text' :
          m.message_type?.toLowerCase() === 'image' ? 'file' :
          m.message_type?.toLowerCase() === 'audio' ? 'voice' : 'text',
    uid: m.sender_id,
    timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: m.content ?? '',
    url: m.media_url ?? null,
    filename: m.filename ?? (m.content || 'attachment'),
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
      kind: 'text',
      uid: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: trimmed,
    };

    setMessages(prev => [...prev, optimistic]);
    setMessageText('');

    try {
      const resp = await ChatService.sendMessage({
        requestId: String(requestId),
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
      kind: 'file',
      uid: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      url,
      filename: file.name,
    };

    setMessages(prev => [...prev, optimistic]);

    try {
      const resp = await ChatService.sendMessage(
        {requestId: String(requestId), file: file, messageType: "IMAGE"});

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
      kind: 'voice',
      uid: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      url,
      filename: 'voice.webm',
    };

    setMessages(prev => [...prev, optimistic]);

    try {
      const resp = await ChatService.sendMessage(
        {requestId:String(requestId), file:blob, messageType:"AUDIO"}
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
