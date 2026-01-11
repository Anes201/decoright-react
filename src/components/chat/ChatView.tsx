
// ChatView.tsx (presentational)
import React from 'react';
import type { ClientContact as Contact, Message } from '@/types/chat';
import ChatList from '@components/chat/ChatList';
import ChatHeader from '@components/chat/ChatHeader';
import ChatBody from '@components/chat/ChatBody';
import ChatForm from '@components/chat/ChatForm';

export default function ChatView(props: {
  contacts: Contact[];
  selectedContact: Contact | null;
  messages: Message[];
  messageText: string;
  onMessageChange: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
  onSelectContact: (c: Contact) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isAdmin?: boolean;
  // slots/overrides
  renderRightHeaderActions?: (args: { selectedContact: Contact | null }) => React.ReactNode;
}) {
  const {
    contacts, selectedContact, messages, messageText, onMessageChange,
    onSend, onSelectContact, messagesEndRef, isAdmin, renderRightHeaderActions
  } = props;

  return (
    <section className="h-hero w-full px-3 sm:px-6 md:px-8">
      <div className="content-container w-full h-full">
        <div className="flex gap-4 w-full h-full">
          <div className="max-md:hidden flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 h-full p-2 md:p-4 border border-muted/15 bg-surface rounded-xl">
            <h3 className="font-medium text-sm p-2.5 border border-muted/15 rounded-lg"> Requests & Chats </h3>
            <ChatList contacts={contacts} onSelect={onSelectContact} />
          </div>

          <div className="flex flex-col w-full h-full p-2 sm:p-4 border border-muted/15 bg-surface rounded-xl">
            <ChatHeader
              selected={selectedContact}
              isAdmin={isAdmin}
              rightActions={renderRightHeaderActions ? renderRightHeaderActions({ selectedContact }) : null}
            />
            <ChatBody messages={messages} messagesEndRef={messagesEndRef} />
            <ChatForm
              message={messageText}
              setMessage={(v: string) => onMessageChange(v)}
              onSend={onSend}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
