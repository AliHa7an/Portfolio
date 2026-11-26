import { FaWhatsapp } from "react-icons/fa6";
import { whatsappLink } from "../story/content";

/** The familiar round WhatsApp button; the label slides out on hover. */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Ali, I found you through your portfolio.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ali on WhatsApp, +92 311 542 7994"
      className="group fixed bottom-5 right-5 z-40 flex h-[60px] items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.65),0_4px_10px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95 md:bottom-7 md:right-7"
    >
      <span className="grid max-w-0 grid-cols-1 overflow-hidden whitespace-nowrap pl-0 text-[0.95rem] font-semibold transition-[max-width,padding] duration-300 ease-out group-hover:max-w-[14rem] group-hover:pl-5 group-focus-visible:max-w-[14rem] group-focus-visible:pl-5">
        Chat on WhatsApp
      </span>
      <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center">
        <FaWhatsapp size={34} aria-hidden />
      </span>
    </a>
  );
}
