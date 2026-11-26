export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line-strong">
      <div className="container-x flex flex-col gap-3 px-5 py-8 text-fg-soft sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Ali Hassan</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><a className="link" href="https://github.com/AliHa7an" target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="link" href="https://www.linkedin.com/in/ali-ha7an/" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a className="link" href="mailto:alihexan@gmail.com">alihexan@gmail.com</a></li>
        </ul>
      </div>
    </footer>
  );
}
