export default function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
  index?: string;
  kicker?: string;
}) {
  return (
    <header className="rise mb-10 md:mb-14 max-w-3xl">
      <h2 className="display text-[clamp(2.25rem,5.2vw,4rem)]">{title}</h2>
      {description && <p className="mt-5 max-w-[62ch] text-lg text-fg-soft">{description}</p>}
    </header>
  );
}
