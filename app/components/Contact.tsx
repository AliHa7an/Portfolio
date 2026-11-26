import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { whatsappLink } from "../story/content";

const channels = [
  { Icon: MessageCircle, label: "WhatsApp", value: "+92 311 542 7994", href: whatsappLink("Hi Ali, I found you through your portfolio.") },
  { Icon: Phone, label: "Phone", value: "+92 311 542 7994", href: "tel:+923115427994" },
  { Icon: GithubIcon, label: "GitHub", value: "AliHa7an", href: "https://github.com/AliHa7an" },
  { Icon: LinkedinIcon, label: "LinkedIn", value: "in/ali-ha7an", href: "https://www.linkedin.com/in/ali-ha7an/" },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="rounded-[2rem] bg-sun px-6 py-12 text-on-sun md:px-14 md:py-20">
          <h2 className="display max-w-4xl text-[clamp(2.5rem,6.4vw,5.25rem)]">
            Have a role or a product in mind? Write to me.
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg">
            I&apos;m open to senior full stack and AI engineering roles, contract work and product builds. Email
            gets the fastest reply.
          </p>
          <a
            href="mailto:alihexan@gmail.com"
            className="btn mt-8 bg-on-sun text-white hover:bg-[#1c2a55] !px-6 !py-4 !text-lg"
          >
            <Mail size={20} aria-hidden />
            alihexan@gmail.com
          </a>
          <ul className="mt-12 grid gap-5 border-t-[1.5px] border-on-sun/25 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ Icon, label, value, href }) => (
              <li key={label}>
                <a href={href} className="group flex items-center gap-3" {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  <Icon size={20} aria-hidden />
                  <span>
                    <span className="block text-sm opacity-70">{label}</span>
                    <span className="font-semibold group-hover:underline">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
