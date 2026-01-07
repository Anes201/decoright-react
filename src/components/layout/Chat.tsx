import { Link, NavLink } from "react-router-dom";
import { images } from "@/constants";
import { ICONS } from "@/icons";
import { AutoResizeTextarea } from "@components/ui/Input" ;
import React, { useState, useEffect, useRef } from "react";
import { currentUserId, MessageItem } from "../ui/Chat";

import type { ClientContact, Message, TextMsg } from "@/types/chat";
import { PATHS } from "@/routers/Paths";


export function ChatLayout() {

  const [selectedContact, setSelectedContact] = useState<ClientContact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const contacts = [
    {
      id: '1',
      type: 'Johnson',
      style: 'Johnson',
      status: 'Cardiologist',
      lastMessage: 'Thank you for the patient update',
      lastMessageTime: '2 min ago',
      isRead: true,
      isOnline: true,
    },

    {
      id: '2',
      type: 'Johnson',
      style: 'Johnson',
      status: 'Cardiologist',
      lastMessage: 'Thank you for the patient update',
      lastMessageTime: '2 min ago',
      isRead: true,
      isOnline: false,
    },

    {
      id: '3',
      type: 'Johnson',
      style: 'Johnson',
      status: 'Cardiologist',
      lastMessage: 'Thank you for the patient update',
      lastMessageTime: '2 min ago',
      isRead: false,
      isOnline: false,
    },

    {
      id: '4',
      type: 'Johnson',
      style: 'Johnson',
      status: 'Cardiologist',
      lastMessage: 'Thank you for the patient update',
      lastMessageTime: '2 min ago',
      isRead: false,
      isOnline: true,
    },
  ];
  const initialMessages: Message[] = [
    {
      id: "m1",
      kind: "text",
      uid: 2,
      timestamp: "10:02 AM",
      text: "I'm on my way! What's the address?",
    },
    {
      id: "m2",
      kind: "text",
      uid: 1,
      timestamp: "10:03 AM",
      text: "We're at 118 68th Ave.",
    },
    {
      id: "m99",
      kind: "text",
      uid: 2,
      timestamp: "10:02 AM",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, repellendus beatae, inventore modi aperiam repudiandae, eos nesciunt hic molestiae debitis odio tenetur. Nisi modi impedit non unde harum officia obcaecati!",
    },
    {
      id: "m98",
      kind: "text",
      uid: 1,
      timestamp: "09:02 AM",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, repellendus beatae, inventore modi aperiam repudiandae, eos nesciunt hic molestiae debitis odio tenetur. Nisi modi impedit non unde harum officia obcaecati!",
    },
    {
      id: "m3",
      kind: "voice",
      uid: 2,
      timestamp: "10:04 AM",
      url: "/samples/voice-12s.mp3",
      duration: 12,
    },
    {
      id: "m4",
      kind: "file",
      uid: 1,
      timestamp: "10:05 AM",
      url: images[2],
      filename: "living-room-before.jpg",
      size: 254_321,
    },
    {
      id: "m5",
      kind: "text",
      uid: 2,
      timestamp: "10:07 AM",
      text: "Ok - stay there I'll come down and grab you in a moment",
    },
    {
      id: "m6",
      kind: "text",
      uid: 2,
      timestamp: "10:02 AM",
      text: "I'm on my way! What's the address?",
    },
    {
      id: "m7",
      kind: "text",
      uid: 1,
      timestamp: "10:03 AM",
      text: "We're at 118 68th Ave.",
    },
    {
      id: "m8",
      kind: "voice",
      uid: 2,
      timestamp: "10:04 AM",
      url: "/samples/voice-12s.mp3",
      duration: 12,
    },
    {
      id: "m9",
      kind: "file",
      uid: 1,
      timestamp: "10:05 AM",
      url: images[6],
      filename: "living-room-before.jpg",
      size: 254_321,
    },
    {
      id: "m10",
      kind: "text",
      uid: 2,
      timestamp: "10:07 AM",
      text: "Ok - stay there I'll come down and grab you in a moment",
    },
  ];

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior:'smooth'})
  }
  useEffect(() => {scrollToBottom()}, [messages]);


  // Initialize messages when a contact is selected
  React.useEffect(() => {
    if (selectedContact) {
      setMessages(initialMessages);
    }
  }, [selectedContact]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedContact) {
      const newMessage: TextMsg = {
        id: Date.now().toString(),
        uid : currentUserId,
        kind: "text",
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  }

  const handleContactSelect = (contact:any) => {
    setSelectedContact(contact);
    // Load initial messages for the selected contact
    if (contact.id === '1') {
      setMessages(initialMessages);
    } else {
      setMessages([]);
    }

  };

  return (
      <section className="h-hero w-full px-3 sm:px-6 md:px-8">
          <div className="content-container w-full h-full">

              <div className="flex gap-4 w-full h-full">

                  {/* Chat List */}
                  <div className="max-md:hidden flex flex-col gap-2 md:gap-4 w-full lg:w-2/3 xl:w-1/3 h-full p-2 md:p-4 border border-muted/25 bg-surface/25 rounded-2xl">
                    <h3 className="font-medium text-sm p-2.5 border border-muted/15 rounded-lg"> My Requests & Chats </h3>
                        <ul className="space-y-2 overflow-y-auto min-scrollbar">
                        {contacts.map((request:any) => (
                          <li key={request.id} onClick={handleContactSelect} className="w-full rounded-lg bg-surface/45 hover:bg-surface border border-muted/10 hover:border-muted/15 overflow-hidden">
                              <NavLink to={PATHS.CLIENT.chatRoom(request.id)} className="flex items-center gap-2 w-full h-fit p-2">

                                  {/* Avatar */}
                                  <div className="h-fit w-12 aspect-square rounded-full border border-muted/45 overflow-hidden">
                                      <img src={images[7]} alt="User Profile" className="w-full h-full object-cover" />
                                  </div>

                                  {/* Context */}
                                  <div className="flex flex-col w-full h-fit">
                                      <h3 className="font-medium text-sm"> {request.id} </h3>
                                      <p className="text-2xs text-muted"> {request.status_label}  </p>
                                      <span className="text-2xs text-muted"> {request.date} </span>
                                  </div>
                              </NavLink>
                          </li>
                        ))}
                      </ul>
                  </div>

                  {/* Chat DM */}
                  <div className="flex flex-col w-full h-full p-2 sm:p-4 border border-muted/25 bg-surface/25 rounded-2xl">
                      {/* Chat Header & Details */}
                      <div className="flex items-center gap-3 w-full p-2 pb-4 border-b border-muted/15">

                          <nav className="w-fit h-fit">
                              <Link to={PATHS.CLIENT.CHAT} className="flex p-2 border border-muted/15 bg-surface/25 rounded-full"> {ICONS.arrowLeft({})} </Link>
                          </nav>

                          <div className="flex items-center gap-2 w-full h-full">
                              {/* Avatar */}
                              <div className="w-12 aspect-square rounded-full border border-muted/45 overflow-hidden">
                                  <img src={images[7]} alt="User Profile" className="w-full h-full object-cover rounded-full" />
                              </div>

                              {/* Context */}
                              <div className="flex flex-col w-full h-fit">
                                  <h3 className="font-medium text-sm"> Michael Pearson </h3>
                                  <span className="text-2xs text-muted"> Admin </span>
                              </div>
                          </div>
                      </div>

                      {/* Chat Body & Content */}
                      <div className="relative flex flex-col gap-8 w-full h-full py-4 px-2 overflow-y-scroll min-scrollbar" role="list">
                        {
                          messages.length > 0 ? messages.map((m) => (<div role="listitem" key={m.id}><MessageItem message={m} ref={messagesEndRef} /></div>))
                          :
                          <div className="relative flex flex-col items-center justify-center w-full h-full">
                            <h4 className="font-semibold text-2xl mb-1"> Chat Room  </h4>
                            <p className="text-sm"> Send a message to start a chat </p>
                          </div>
                        }

                      </div>

                      {/* Chat Form */}
                      <form action={'.'} method="post" onSubmit={handleSendMessage} className="flex items-center gap-4 w-full h-fit p-2 border border-muted/25 rounded-xl">
                        <AutoResizeTextarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a message..."
                            minRows={1}
                            maxRows={5}
                            className="resize-none w-full h-fit px-2 outline-0"
                        />

                        {/* Voice & Upload options */}
                        <div className="flex items-end gap-2 h-full">

                            <div className={`${message && 'hidden'} flex gap-2`}>
                                <button type="button" className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25"> {ICONS.photo({className:'size-6 text-foreground'})} </button>
                                <button type="button" className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25"> {ICONS.microphone({className:'size-6 text-foreground'})} </button>
                            </div>

                            <button type="submit" className={`${ !message && 'hidden' } p-2 h-fit bg-primary rounded-lg `}> {ICONS.paperAirplane({className:'size-6 text-white'})} </button>
                        </div>
                    </form>

                  </div>
              </div>

          </div>
      </section>
  )
}