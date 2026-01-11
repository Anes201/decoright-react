
// useChat.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { ClientContact as Contact, Message } from '@/types/chat';

export function useChat(opts?: { initialContacts?: Contact[], currentUserId?: number }) {
  const { initialContacts = [], currentUserId = 1 } = opts || {};
  const [contacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Example: load initial messages when selecting a contact
  useEffect(() => {
    if (selectedContact) {
      // Replace this with real fetch if you want
      const initialMessages: Message[] = [
        { id: 'm1', kind: 'text', uid: 2, timestamp: '10:02 AM', text: "I'm on my way!" }
      ];
      setMessages(initialMessages);
    }
  }, [selectedContact]);

  const sendMessage = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !selectedContact) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      kind: 'text',
      uid: currentUserId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: message.trim(),
    };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  }, [message, selectedContact, currentUserId]);

  const selectContact = useCallback((c: Contact) => {
    setSelectedContact(c);
  }, []);

  return {
    contacts, selectedContact, messages, message, setMessage,
    sendMessage, selectContact, messagesEndRef, setMessages
  };
}
