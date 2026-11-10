// Ícones desenhados à mão: traço irregular, sempre na cor da caneta (currentColor).

type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

export function CheckBox({ seed = 0 }: { seed?: number }) {
  // pequenas variações para cada caixinha não parecer carimbada
  const v = [
    "M4 5.2C9.5 3.8 17.6 4.6 23.6 4.1C24.4 10.2 23.3 17.6 24.3 23.8C17.2 24.7 10.1 23.4 4.6 24.4C3.7 17.4 4.7 11.2 4 5.2Z",
    "M4.6 4.4C10.7 4.9 17 3.6 24 4.6C23.4 11 24.6 17.2 23.7 24.2C16.6 23.5 11 24.9 4.2 23.9C4.9 16.8 3.6 10.6 4.6 4.4Z",
    "M3.8 4.8C10 4.1 16.4 5 24.2 4.3C24 10.5 23.9 18.4 24.1 23.6C17.6 24.3 9.8 23.9 4.4 24.6C4.2 18.2 4.4 10.4 3.8 4.8Z"
  ][seed % 3];
  return (
    <svg viewBox="0 0 28 28" aria-hidden>
      <path d={v} {...base} strokeWidth={1.7} />
      <path className="tick" pathLength={1} d="M7.5 14.8C9.4 16.6 11 18.6 12.6 21.4C15.4 14.2 19.6 7.6 26.5 1.8" {...base} strokeWidth={2.6} />
    </svg>
  );
}

export function Pen({ className }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M22.5 4.5C24.4 4.9 26.6 7.1 27 8.9L12.2 23.8L6.4 25.6L8 19.6L22.5 4.5Z" {...base} />
      <path d="M19.8 7.4L24.3 11.7M8 19.6C10.4 20.1 11.6 21.4 12.2 23.8" {...base} />
    </svg>
  );
}

export function CalendarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M5 8.4C12 7.6 20 8.2 27.2 7.8C27.6 14.2 26.8 21 27.4 27C20.4 27.6 12.2 26.9 5.2 27.4C4.6 21 5.4 14.6 5 8.4Z" {...base} />
      <path d="M5.4 13.4C12.4 12.8 20.4 13.6 27 13.1M11 4.6L11.2 10.4M21.2 4.4L21 10.2" {...base} />
      <path d="M10.6 18.4l.2.1M16 18.2l.2.1M21.4 18.3l.2.1M10.7 22.6l.2.1M16.1 22.5l.2.1" {...base} strokeWidth={2.6} />
    </svg>
  );
}

export function PapersIcon({ className }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M9.6 9.2C14.6 8.4 20.2 8.8 25.2 8.4C25.8 14.4 25.4 21.4 26 27.2C20.4 27.6 15.2 27.2 9.8 27.8C9.2 21.6 10 15.2 9.6 9.2Z" {...base} />
      <path d="M6.2 23.8C5.8 18 6.4 11 5.8 5.2C10.8 4.6 16 5.2 21.6 4.6" {...base} />
      <path d="M13.4 15C16.4 14.7 19 15.1 21.8 14.8M13.4 19.4C16.2 19.1 18.4 19.5 20 19.2" {...base} />
    </svg>
  );
}

export function Close({ className }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M8.4 8C13.2 12.6 18.6 18.8 23.8 24.2M23.6 7.6C18.6 12.8 13.4 18.4 8 24.6" {...base} strokeWidth={2} />
    </svg>
  );
}

export function Arrow({ className, dir }: P & { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M6 16.4C12 15.8 18.4 16.6 25 16M19 9.6C21.4 12 23.4 14 25.4 16.2C23 18.4 21 20.4 18.6 22.8" {...base} strokeWidth={2} />
    </svg>
  );
}

export function Lock({ className }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M8 14.4C13.2 13.8 19 14.4 24.4 14C24.8 18.6 24.2 23.4 24.6 27.4C19.2 27.8 13.6 27.2 8.2 27.6C7.6 23.2 8.4 18.8 8 14.4Z" {...base} />
      <path d="M11.4 14C11 8.2 13.2 5.2 16.4 5.2C19.8 5.2 21.4 8.4 21 14M16.2 19.4L16.3 22.6" {...base} />
    </svg>
  );
}

export function Tick({ className }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M3.6 10.8C5.2 12.2 6.6 13.8 7.8 15.8C10 10.6 13 6.4 17 3" {...base} strokeWidth={2.2} style={{ stroke: "var(--accent)" }} />
    </svg>
  );
}

export function Cross({ className }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M5.4 5.2C8.4 8.4 11.6 11.8 14.8 15M14.4 5C11.6 8.4 8.6 11.6 5.4 15.2" {...base} strokeWidth={1.6} style={{ stroke: "var(--ink-soft)" }} />
    </svg>
  );
}

/** Círculo feito à mão em volta de algo (dia de hoje, folha em uso). */
export function Ring({ className }: P) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M58 6C30 3 6 12 5.5 30C5 48 30 56 54 55C78 54 96 44 95 28C94 13 74 5 46 7.5" {...base} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
