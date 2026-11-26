import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../story/content";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Ali, I found you through your portfolio.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ali on WhatsApp, +92 311 542 7994"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-2xl bg-fg p-2 text-bg shadow-[0_8px_0_rgba(15,26,58,0.16)] transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] dark:bg-raised dark:text-fg dark:shadow-[0_0_0_1px_rgba(244,245,248,0.2),0_18px_40px_-12px_rgba(0,0,0,0.7)] md:pr-4"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#25d366] text-[#07230f]">
        <MessageCircle size={24} fill="currentColor" strokeWidth={0} aria-hidden />
        {/* "Available" dot */}
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25d366] opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-fg bg-[#25d366] dark:border-raised" />
        </span>
      </span>
      <span className="hidden leading-tight md:block">
        <span className="block text-[0.8rem] opacity-70">Chat on WhatsApp</span>
        <span className="block font-semibold">+92 311 542 7994</span>
      </span>
    </a>
  );
}
