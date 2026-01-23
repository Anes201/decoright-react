
import ChatLayout  from "@components/chat/ChatLayout";

export default function AdminChatPage() {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8">
              <div className="relative flex flex-col gap-8 h-full">
                <h1 className="font-semibold text-lg md:text-2xl"> Admin Chat </h1>
                <ChatLayout/>
              </div>
            </section>
        </main>
    )
}


