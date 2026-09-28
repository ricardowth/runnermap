export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="var(--accent)" />
      <path
        d="M20 9c-4.7 0-8.5 3.7-8.5 8.3 0 6.1 8.5 13.7 8.5 13.7s8.5-7.6 8.5-13.7C28.5 12.7 24.7 9 20 9Z"
        fill="#fff"
      />
      <path
        d="M15.8 18.6c1.6-2.9 3.5-.4 4.6-2.2 1-1.7 2.5-1.4 3.8-.6"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">
        Runner<span className="text-accent">Map</span>
      </span>
    </span>
  );
}
