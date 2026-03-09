import ChatLayout from "@components/chat/ChatLayout";
import { useTranslation } from "react-i18next";

export default function AdminChatPage() {
  const { t } = useTranslation();
  return (
    <main className="w-full h-full">
      <section className="flex flex-col w-full h-full md:pt-8 pb-4">
        <h1 className="font-semibold text-lg md:text-2xl mb-4 shrink-0">{t('admin.chat.title')}</h1>
        <ChatLayout />
      </section>
    </main>
  );
}
