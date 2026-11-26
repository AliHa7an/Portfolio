import { Check, MessageCircle } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { whatsappLink } from "../story/content";

const sites = ["Portfolio site", "Business or company website", "Shopify store", "WooCommerce store"];
const ai = ["AI agents", "Website chatbots", "WhatsApp bots", "Voice assistants", "Workflow automation"];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <SectionHeader
          title="Need something built? Hire me directly."
          description="Two things I take on as fixed projects, outside my full-time work. Message me on WhatsApp and I reply the same day."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rise flex flex-col rounded-[2rem] bg-sun p-7 text-on-sun md:p-10">
            <h3 className="display text-4xl md:text-5xl">Websites and online stores</h3>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="display text-7xl md:text-8xl">$120</span>
              <span className="text-lg font-medium">fixed price, unlimited revisions</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-lg">
              One price for the whole site. I keep revising it until you are happy with it.
            </p>
            <ul className="mb-8 mt-6 space-y-2 text-lg">
              {sites.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={20} strokeWidth={3} className="mt-1 shrink-0" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("Hi Ali, I'd like a website or store for $120. Here is what I need:")}
              target="_blank"
              rel="noreferrer"
              className="btn mt-auto self-start !bg-on-sun !px-6 !py-4 !text-lg !text-white hover:!bg-[#1c2a55] md:mt-auto"
            >
              <MessageCircle size={20} aria-hidden />
              Order on WhatsApp
            </a>
          </article>

          <article className="rise flex flex-col rounded-[2rem] bg-[#0f1a3a] p-7 text-white dark:bg-raised dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(244,245,248,0.14)] md:p-10">
            <h3 className="display text-4xl md:text-5xl">AI agents and bots</h3>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="display text-5xl md:text-6xl">Quoted per project</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-lg text-white/80">
              Tell me what the bot should do and where it should live. I send a price and a timeline before any
              work starts.
            </p>
            <ul className="mb-8 mt-6 space-y-2 text-lg">
              {ai.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={20} strokeWidth={3} className="mt-1 shrink-0 text-sun" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("Hi Ali, I'd like a quote for an AI agent or bot. Here is what it should do:")}
              target="_blank"
              rel="noreferrer"
              className="btn mt-auto self-start !bg-sun !px-6 !py-4 !text-lg !text-on-sun hover:!bg-[#ffd75e] md:mt-auto"
            >
              <MessageCircle size={20} aria-hidden />
              Ask for a quote on WhatsApp
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
