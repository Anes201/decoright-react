
import ChatLayout from "@components/chat/ChatLayout";

export default function AdminChatPage() {
  return (
    <main className="w-full h-full">
      <section className="flex flex-col w-full h-full md:pt-8 pb-4">
        <h1 className="font-semibold text-lg md:text-2xl mb-4 shrink-0">Requests & Chat</h1>
        <ChatLayout />
      </section>
    </main>
  )
}
