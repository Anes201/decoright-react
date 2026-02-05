
import ChatLayout from "@components/chat/ChatLayout";

export default function AdminChatPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <section className="flex flex-col flex-1 w-full p-4 md:p-6 overflow-hidden">
        <h1 className="font-semibold text-lg md:text-2xl mb-4 shrink-0">Admin Chat</h1>
        <div className="flex-1 min-h-0">
          <ChatLayout />
        </div>
      </section>
    </main>
  )
}
