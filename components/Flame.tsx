import { useId } from "react";

/**
 * Fogo do streak, desenhado na própria folha: contorno de caneta (duas
 * passadas tremidas, na tinta da folha) preenchido com hachura de lápis de cor.
 * Cresce e muda de cor conforme o streak.
 */
const TIERS = [
  { min: 1, scale: 0.7, c: ["#e85a24", "#ffb03a"], name: "faísca" },
  { min: 3, scale: 0.82, c: ["#e0441c", "#ff9a2a"], name: "chama" },
  { min: 7, scale: 0.94, c: ["#d9361a", "#5fb4f0"], name: "fogueira" },
  { min: 14, scale: 1.04, c: ["#2f66d6", "#9cc8ff"], name: "fogo azul" },
  { min: 30, scale: 1.14, c: ["#6c35cf", "#d19bff"], name: "fogo místico" }
];

export function flameTier(streak: number) {
  let t = -1;
  TIERS.forEach((x, i) => {
    if (streak >= x.min) t = i;
  });
  return t;
}

export function flameName(streak: number) {
  const t = flameTier(streak);
  return t < 0 ? null : TIERS[t].name;
}

const OUTER =
  "M32 4.5C36.4 16.4 50.2 24.6 52 44.2C53.6 62.4 44 76 32.2 76C19 76 10.2 64.6 12 48.4C13.2 38.2 19 33.4 22.4 24.4C24.2 32 27 35.8 30 37C28 26.4 28.2 14.4 32 4.5Z";
const INNER =
  "M32.4 30C35 38 43 43 43.2 55C43.4 66 38.6 73.4 32 73.4C25 73.4 20.4 67 21 58.4C21.4 52.6 24.8 49.6 26.4 44.8C27.8 48.2 29.2 50 31 50.4C29.8 44 30 37 32.4 30Z";

/** Gerador determinístico (mesmo desenho no servidor e no cliente). */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

type Stroke = { d: string; w: number; o: number };

/** Traços de lápis: diagonais paralelas com leve tremor de espaçamento e pressão. */
function hatch(seed: number, from: number, to: number, step: number, rise: number, x0: number, x1: number): Stroke[] {
  const r = rng(seed);
  const out: Stroke[] = [];
  for (let y = from; y < to; y += step + (r() - 0.5) * 0.8) {
    const j = (r() - 0.5) * 1.4;
    out.push({
      d: `M${x0} ${(y + j).toFixed(1)}L${x1} ${(y + rise + j + (r() - 0.5)).toFixed(1)}`,
      w: 1.2 + r() * 0.7,
      o: 0.55 + r() * 0.35
    });
  }
  return out;
}

type Props = { streak: number; lit: boolean; burnt: boolean; size?: number; outline?: boolean };

export default function Flame({ streak, lit, burnt, size = 56, outline = true }: Props) {
  const id = useId().replace(/:/g, "");
  const tier = flameTier(streak);

  if (tier < 0) {
    // sem fogo: fumaça se acabou de apagar, contorno tracejado se nunca acendeu
    return (
      <svg viewBox="0 0 64 80" width={size} height={size * 1.25} className="flame" aria-hidden>
        {burnt ? (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.8} opacity={0.55}>
            <path d="M30 72C26 62 36 58 32 48C28 38 38 34 34 24C32 18 34 12 38 8" />
            <path d="M24 74C24 68 28 66 26 60" opacity={0.6} />
            <path d="M22 75.5C28 74 36 74 43 75.4" strokeWidth={2.4} opacity={0.9} />
          </g>
        ) : (
          <path d={OUTER} fill="none" stroke="currentColor" strokeWidth={1.6} strokeDasharray="3 5" strokeLinecap="round" opacity={0.6} />
        )}
      </svg>
    );
  }

  const t = TIERS[tier];
  // pequeno (calendário): desenho simplificado, poucos traços grossos e um contorno só
  const tiny = size < 24;
  const body = tiny ? hatch(11 + tier, 6, 84, 9, -30, -4, 70).map((x) => ({ ...x, w: 5, o: 0.9 })) : hatch(11 + tier, -10, 90, 3.1, -30, -4, 70);
  const core = tiny ? [] : hatch(31 + tier, 30, 80, 3.4, 14, 10, 60);

  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={size * 1.25}
      className={`flame${lit ? "" : " waiting"}`}
      style={lit ? undefined : { opacity: 0.72, filter: "saturate(0.6)" }}
      aria-hidden
    >
      <defs>
        <clipPath id={`o${id}`}>
          <path d={OUTER} />
        </clipPath>
        <clipPath id={`i${id}`}>
          <path d={INNER} />
        </clipPath>
        <filter id={`w${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed={3 + tier} />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
      <g transform={`translate(32 78) scale(${t.scale}) translate(-32 -78)`}>
        <g className="f-body">
          <g clipPath={`url(#o${id})`} strokeLinecap="round" fill="none">
            {body.map((s, i) => (
              <path key={i} d={s.d} stroke={t.c[0]} strokeWidth={s.w} opacity={s.o} />
            ))}
          </g>
          <g className="f-core" clipPath={`url(#i${id})`} strokeLinecap="round" fill="none">
            {core.map((s, i) => (
              <path key={i} d={s.d} stroke={t.c[1]} strokeWidth={1.5} opacity={0.8} />
            ))}
          </g>
          {outline && tiny && (
            <path d={OUTER} fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinejoin="round" />
          )}
          {outline && !tiny && (
            <g filter={`url(#w${id})`} fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
              <path d={OUTER} strokeWidth={1.5} />
              <path d={OUTER} strokeWidth={0.8} opacity={0.55} transform="translate(.9 -.6) rotate(1.2 32 40)" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
