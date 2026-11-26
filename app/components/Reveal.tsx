/**
 * These used to fade every block in on scroll. The page now keeps its motion
 * for the avatar and the story, so they render their children as they are.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealText({
  text,
  className = "",
  as = "span",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const Tag = as;
  return <Tag className={className}>{text}</Tag>;
}
