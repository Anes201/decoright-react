
// ChatList.tsx (small presentational)
import type { ClientContact } from "@/types/chat";
export default function ChatList({ contacts, onSelect }: { contacts: ClientContact[], onSelect: (c: ClientContact)=>void }) {
  return (
    <ul className="space-y-2 overflow-y-auto min-scrollbar">
      {contacts.map(c => (
        <li key={c.id} onClick={() => onSelect(c)} className="w-full rounded-lg hover:bg-emphasis p-2">
          <div className="flex items-center gap-2">
            <div className="w-12 aspect-square rounded-full overflow-hidden">
              <img src="/images/avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-sm">{c.name ?? c.id}</h3>
              <p className="text-2xs text-muted">{c.status_label}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
