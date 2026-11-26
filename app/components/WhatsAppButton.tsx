import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../story/content";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Ali, I found you through your portfolio.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ali on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#25d366] px-4 font-semibold text-[#0b2b17] shadow-[0_6px_0_rgba(15,26,58,0.18)] transition-transform hover:-translate-y-0.5 md:px-5"
    >
      <MessageCircle size={24} fill="currentColor" strokeWidth={0} aria-hidden />
      <span className="hidden md:inline">WhatsApp</span>
    </a>
  );
}
