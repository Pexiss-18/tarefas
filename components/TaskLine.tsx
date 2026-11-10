"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Task } from "@/lib/types";
import { CheckBox } from "./Icons";

type Props = {
  task: Task;
  index: number;
  fresh?: boolean;
  onToggle: (t: Task) => void;
  onDelete?: (t: Task) => void;
};

const ERASE_AT = 96;

/** Semente estável a partir do id da tarefa: o risco é sempre o mesmo para a mesma tarefa. */
function seedOf(id: string) {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 2147483647;
  return h || 7;
}

/** Traço ondulado à mão de x0 a x1, na altura y, com ondas irregulares. */
function wave(x0: number, x1: number, y: number, seed: number) {
  let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const len = x1 - x0;
  const n = Math.max(2, Math.round(len / 22));
  const step = len / n;
  let d = `M${(x0 - 3).toFixed(1)} ${(y + (r() - 0.5) * 3).toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const x = x0 + step * i + (i === n ? 3 : 0);
    d += ` Q${(x - step / 2).toFixed(1)} ${(y + (r() - 0.5) * 7).toFixed(1)} ${x.toFixed(1)} ${(y + (r() - 0.5) * 4).toFixed(1)}`;
  }
  return d;
}

/** Risco de caneta: um traço por linha visual do texto, medido no layout real. */
function Strike({ target, seed }: { target: React.RefObject<HTMLSpanElement | null>; seed: number }) {
  const [paths, setPaths] = useState<string[]>([]);
  useLayoutEffect(() => {
    const span = target.current;
    const box = span?.parentElement;
    if (!span || !box) return;
    // a altura vem da linha (o texto sempre cai na pauta), não do retângulo medido:
    // a folha é girada no desktop e isso distorce as medidas verticais
    const measure = () => {
      const b = box.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(box).lineHeight) || 46;
      const rects = [...span.getClientRects()];
      const top0 = rects[0]?.top ?? 0;
      setPaths(
        rects.map((rc, i) => {
          const line = Math.round((rc.top - top0) / lh);
          return wave(rc.left - b.left, rc.right - b.left, line * lh + lh * 0.45, seed + i * 97);
        })
      );
    };
    measure();
    // a fonte manuscrita troca as métricas quando termina de carregar: mede de novo
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [target, seed]);
  return (
    <svg className="strike" aria-hidden>
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ transitionDelay: `${i * 0.18}s` }} />
      ))}
    </svg>
  );
}

/** Uma linha da folha: toque para riscar, arraste para a esquerda para apagar. */
export default function TaskLine({ task, index, fresh, onToggle, onDelete }: Props) {
  const [dx, setDx] = useState(0);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiping = useRef(false);
  const dxRef = useRef(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const move = (v: number) => {
    dxRef.current = v;
    setDx(v);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!onDelete) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiping.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const mx = e.clientX - s.x;
    const my = e.clientY - s.y;
    if (!swiping.current) {
      if (Math.abs(my) > 10) {
        start.current = null;
        return;
      }
      if (mx < -12) {
        swiping.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
    }
    if (swiping.current) move(Math.min(0, mx));
  };
  const onPointerUp = () => {
    if (swiping.current && dxRef.current < -ERASE_AT && onDelete) {
      move(-window.innerWidth);
      setTimeout(() => onDelete(task), 180);
    } else if (dxRef.current !== 0) {
      move(0);
    }
    start.current = null;
    setTimeout(() => (swiping.current = false), 0);
  };

  const toggle = () => {
    if (!swiping.current) onToggle(task);
  };

  return (
    <li
      className={`task${task.done ? " done" : ""}${fresh ? " fresh" : ""}${dx !== 0 ? " dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {onDelete && (
        <div className="task-erase" aria-hidden style={{ opacity: Math.min(1, -dx / ERASE_AT) }}>
          {dx < -ERASE_AT ? "solte pra apagar" : "apagar"}
        </div>
      )}
      <div className="task-row" style={dx ? { transform: `translateX(${dx}px)`, background: "var(--paper)" } : undefined}>
        <button
          type="button"
          className="check"
          role="checkbox"
          aria-checked={task.done}
          aria-label={task.title}
          onClick={toggle}
          onKeyDown={(e) => {
            if (onDelete && (e.key === "Delete" || e.key === "Backspace")) onDelete(task);
          }}
        >
          <CheckBox seed={index} />
        </button>
        <div className="task-text" onClick={toggle}>
          <span ref={textRef}>{task.title}</span>
          <Strike target={textRef} seed={seedOf(task.id)} />
        </div>
      </div>
    </li>
  );
}
