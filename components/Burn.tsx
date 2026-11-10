"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Gerador determinístico: a borda queimada é sempre a mesma para a mesma folha. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

type Bite = { at: number; depth: number; width: number };

/**
 * Contorno irregular da beirada carbonizada: o fogo come pouco na maior parte
 * da borda (4 a 10 px, com ondulação lenta) e morde fundo em poucos lugares:
 * o canto superior esquerdo, a parte de baixo da lateral direita e, menor, o canto
 * inferior esquerdo (abaixo da caneta, sem chegar no campo de escrever).
 * Os cantos são arcos próprios ligando as duas bordas, pra o contorno nunca se
 * cruzar (cruzar deixava uma ilha de papel solta no meio do carvão).
 */
function charEdge(w: number, h: number, seed: number) {
  const r = rng(seed);
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28, r() * 6.28];
  const bite = (t: number, bites: Bite[]) =>
    bites.reduce((m, b) => Math.max(m, b.depth * Math.exp(-((t - b.at) ** 2) / (2 * b.width ** 2))), 0);
  // ondulação lenta + rugosidade fina, para a borda não ser uniforme
  const base = (t: number, k: number, len: number) =>
    4 + 3 * (1 + Math.sin((t * len) / 37 + ph[k])) + 2 * Math.sin((t * len) / 11 + ph[k] * 2) + r() * 2.5;
  const right: Bite[] = [{ at: 0.74, depth: 30, width: 0.035 }];
  const RT = 50; // raio da mordida do canto superior esquerdo
  const RB = 32; // raio da mordida do canto inferior esquerdo
  const pts: string[] = [];
  const p = (x: number, y: number) => pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  /**
   * Arco irregular de canto, de a0 até a1 (radianos). O centro fica recuado pra
   * dentro (na altura média da borda) e a irregularidade some nas pontas, então
   * o arco encosta nas bordas laterais sem deixar emenda.
   */
  const IN = 8;
  const arc = (cx: number, cy: number, R: number, a0: number, a1: number) => {
    const n = 16;
    const ox = cx === 0 ? IN : -IN;
    const oy = cy === 0 ? IN : -IN;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = a0 + (a1 - a0) * t;
      const fade = Math.sin(Math.PI * t); // 0 nas pontas, 1 no meio
      const rr = R - IN + fade * (5 * Math.sin(a * 7 + ph[0]) + (r() - 0.5) * 4);
      p(cx + ox + Math.cos(a) * rr, cy + oy + Math.sin(a) * rr);
    }
  };
  const step = 5;
  for (let x = RT; x <= w; x += step) p(x, base(x / w, 0, w));
  for (let y = 0; y <= h; y += step) p(w - base(y / h, 1, h) - bite(y / h, right), y);
  for (let x = w; x >= RB; x -= step) p(x, h - base(x / w, 2, w));
  arc(0, h, RB, 0, -Math.PI / 2); // canto inferior esquerdo: da borda de baixo até a lateral
  for (let y = h - RB; y >= RT; y -= step) p(base(y / h, 3, h), y);
  arc(0, 0, RT, Math.PI / 2, 0); // canto superior esquerdo: da lateral até a borda de cima
  const inner = `M${pts.join("L")}Z`;
  return { hole: `M-40 -40H${w + 40}V${h + 40}H-40Z ${inner}`, inner };
}

/**
 * Folha chamuscada quando o fogo apaga: o papel amarela e escurece a partir da
 * borda, e a beirada fica carbonizada e irregular. Nada de brasa laranja; o
 * conteúdo continua livre (a folha recua o texto com `.is-burnt`).
 */
export default function Burn() {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = size?.w ?? 0;
  const h = size?.h ?? 0;
  const edge = size ? charEdge(w, h, 5) : null;

  return (
    <svg
      ref={ref}
      className="burn"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={size ? `0 0 ${w} ${h}` : undefined}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="burn-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="burn-mid" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="burn-near" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="burn-rag" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </defs>
      {size && (
        <>
          {/* papel amarelado a partir da borda (largo e fraco) */}
          <rect x="0" y="0" width={w} height={h} fill="none" stroke="#7a4416" strokeWidth="90" opacity="0.2" filter="url(#burn-soft)" />
          {/* faixa chamuscada que acompanha o contorno: tostado claro -> marrom escuro junto do carvão */}
          <path d={edge!.inner} fill="none" stroke="#a8743c" strokeWidth="44" opacity="0.32" filter="url(#burn-mid)" />
          <path d={edge!.inner} fill="none" stroke="#6b3a14" strokeWidth="20" opacity="0.55" filter="url(#burn-near)" />
          <path d={edge!.inner} fill="none" stroke="#3a1d0a" strokeWidth="8" opacity="0.8" filter="url(#burn-rag)" />
          {/* beirada carbonizada */}
          <path d={edge!.hole} fillRule="evenodd" fill="#140a04" filter="url(#burn-rag)" />
        </>
      )}
    </svg>
  );
}
