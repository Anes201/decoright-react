
// ChatView.tsx (presentational)
import React from 'react';
import type { Contact, Message } from '@/types/chat';
import ChatList from '@components/chat/ChatList';
import ChatHeader from '@components/chat/ChatHeader';
import ChatBody from '@components/chat/ChatBody';

import ChatForm from '@components/chat/ChatForm';
import { ICONS } from '@/icons';


export function ChatRoom(props: {
  selectedContact: Contact | null;
  messages: Message[];
  messageText: string;
  onMessageChange: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
  onSendMedia: (file: File | Blob, type: any) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentUserId?: string;
  // slots/overrides
  renderRightHeaderActions?: (args: { selectedContact: Contact | null }) => React.ReactNode;
}) {
  const {
    selectedContact, messages, messageText, onMessageChange,
    onSend, onSendMedia, messagesEndRef, renderRightHeaderActions, currentUserId
  } = props;

  if (!selectedContact) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 border border-muted/15 bg-surface/50 rounded-xl text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <ICONS.chatBubbleOvalLeftEllipsis className="size-10 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Select a Conversation</h3>
        <p className="text-sm text-muted max-w-[250px]">
          Choose a client request from the list to start messaging or view history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-2 sm:p-4 border border-muted/15 bg-surface rounded-xl">
      <ChatHeader
        selected={selectedContact}
        rightActions={renderRightHeaderActions ? renderRightHeaderActions({ selectedContact }) : null}
      />
      <ChatBody messages={messages} messagesEndRef={messagesEndRef} currentUserId={currentUserId} />
      <ChatForm
        message={messageText}
        setMessage={(v: string) => onMessageChange(v)}
        onSend={onSend}
        onSendMedia={onSendMedia}
      />
    </div>
  )
}



export default function ChatView(props: {
  contacts: Contact[];
  selectedContact: Contact | null;
  messages: Message[];
  messageText: string;
  onMessageChange: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
  onSendMedia: (file: File | Blob, type: any) => Promise<void>;
  onSelectContact: (c: Contact) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  filter?: string;
  setFilter?: (v: 'all' | 'unread') => void;
  currentUserId?: string;
  // slots/overrides
  renderRightHeaderActions?: (args: { selectedContact: Contact | null }) => React.ReactNode;
}) {
  const {
    contacts, onSelectContact, selectedContact, filter, setFilter
  } = props;

  return (
    <section className="h-hero content-container w-full">
      <div className="flex gap-4 w-full h-full">

        {/* Conversation List Pane */}
        <div className="max-md:hidden flex flex-col w-full lg:w-1/3 xl:w-1/4 h-full border border-muted/15 bg-surface rounded-xl overflow-hidden">
          <div className="p-4 border-b border-muted/15 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base">Conversations</h2>
              {setFilter && (
                <div className="flex gap-1 p-1 bg-background rounded-lg border border-muted/10">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2 py-1 text-3xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-2 py-1 text-3xs font-medium rounded-md transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}
                  >
                    Unread
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-scrollbar p-2">
            <ChatList
              contacts={contacts}
              onSelect={onSelectContact}
              selectedId={selectedContact?.id}
            />
          </div>
        </div>

        {/* Active Chat Pane */}
        <div className="flex-1 h-full">
          <ChatRoom {...props} />
        </div>

      </div>
    </section>
  );
}
