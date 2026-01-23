

// pages/client/ChatPage.tsx
import ChatLayout from '@components/chat/ChatLayout';

export default function ChatPage() {
    return (
        <main>
            <section className="h-hero content-container w-full px-3 sm:px-6 md:px-8">
                <div className="content-container w-full h-full">
                    <ChatLayout />
                </div>
            </section>
        </main>
    );
}
