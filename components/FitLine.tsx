"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Título de uma linha só: começa no tamanho do CSS e diminui até caber na
 * largura disponível (cada caneta tem uma letra de largura diferente). Se o
 * texto completo não couber sem ficar pequeno demais, usa a forma curta.
 * Abaixo do mínimo, deixa quebrar em vez de ficar ilegível.
 */
export default function FitLine({
  text,
  short,
  className,
  min = 0.8
}: {
  text: string;
  short?: string;
  className?: string;
  min?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [useShort, setUseShort] = useState(false);
  const shown = useShort && short ? short : text;

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    // mede numa cópia invisível (não mexe no texto que o React controla)
    const fit = () => {
      const probe = el.cloneNode() as HTMLElement;
      probe.removeAttribute("aria-label");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0;font-size:";
      box.appendChild(probe);
      const base = parseFloat(getComputedStyle(probe).fontSize);
      const room = box.clientWidth;
      const sizeFor = (t: string) => {
        probe.textContent = t;
        let size = base;
        probe.style.fontSize = `${size}px`;
        while (probe.scrollWidth > room && size > base * min) {
          size -= 0.5;
          probe.style.fontSize = `${size}px`;
        }
        return probe.scrollWidth <= room ? size : null;
      };
      let size = sizeFor(text);
      let wantShort = false;
      if (size === null && short) {
        wantShort = true;
        size = sizeFor(short);
      }
      box.removeChild(probe);
      el.style.fontSize = size !== null ? `${size}px` : "";
      el.style.whiteSpace = size !== null ? "nowrap" : "";
      setUseShort(wantShort);
    };
    fit();
    // a letra manuscrita chega depois (font-display: swap) e muda a largura: mede de novo
    let alive = true;
    const refit = () => alive && fit();
    document.fonts?.ready.then(refit);
    document.fonts?.addEventListener("loadingdone", refit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      alive = false;
      document.fonts?.removeEventListener("loadingdone", refit);
      ro.disconnect();
    };
  }, [text, short, min]);

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {shown}
    </h1>
  );
}
