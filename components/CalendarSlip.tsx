"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/types";
import { parseDateStr, toDateStr } from "@/lib/date";
import { dayStats, resultOf } from "@/lib/progress";
import { Arrow, Close, Cross, Ring, Tick } from "./Icons";
import Flame from "./Flame";
import TaskLine from "./TaskLine";

type Props = {
  paper: string;
  tasks: Task[];
  today: string;
  brokeOn: string | null;
  onToggle: (t: Task) => void;
  onCopyToToday: (titles: string[]) => void;
  onClose: () => void;
};

const WD = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function CalendarSlip({ paper, tasks, today, brokeOn, onToggle, onCopyToToday, onClose }: Props) {
  const t = parseDateStr(today);
  const [month, setMonth] = useState({ y: t.getFullYear(), m: t.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);
  const stats = useMemo(() => dayStats(tasks), [tasks]);

  const first = new Date(month.y, month.m, 1);
  const daysIn = new Date(month.y, month.m + 1, 0).getDate();
  const cells: (string | null)[] = Array(first.getDay()).fill(null);
  for (let d = 1; d <= daysIn; d++) cells.push(toDateStr(new Date(month.y, month.m, d)));

  const monthLabel = first.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const shift = (n: number) => {
    const d = new Date(month.y, month.m + n, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(null);
  };
  const isCurrentMonth = month.y === t.getFullYear() && month.m === t.getMonth();

  const dayTasks = selected ? tasks.filter((x) => x.date === selected) : [];
  const pending = dayTasks.filter((x) => !x.done);
  const s = selected ? stats.get(selected) : undefined;
  const selLabel = selected
    ? parseDateStr(selected).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="slip paper" data-paper={paper} role="dialog" aria-label="Calendário">
        <div className="slip-head">
          <span className="slip-title">Dias anteriores</span>
          <button className="btn" onClick={onClose} aria-label="Fechar">
            <Close />
          </button>
        </div>
        <div className="slip-body">
          <div className="cal-nav">
            <button className="btn" onClick={() => shift(-1)} aria-label="Mês anterior">
              <Arrow dir="left" />
            </button>
            <span>{monthLabel}</span>
            <button className="btn" onClick={() => shift(1)} disabled={isCurrentMonth} aria-label="Próximo mês" style={isCurrentMonth ? { opacity: 0.25 } : undefined}>
              <Arrow dir="right" />
            </button>
          </div>

          <div className="cal-grid">
            {WD.map((w, i) => (
              <div key={i} className="cal-wd">
                {w}
              </div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />;
              const r = resultOf(stats.get(d));
              const future = d > today;
              return (
                <button
                  key={d}
                  className="cal-day"
                  disabled={future}
                  onClick={() => setSelected(d === selected ? null : d)}
                  aria-label={`${parseDateStr(d).getDate()}: ${
                    r === "full" ? "tudo feito" : r === "half" ? "mais da metade" : r === "fail" ? "menos da metade" : "sem tarefas"
                  }`}
                  aria-pressed={d === selected}
                >
                  {(d === today || d === selected) && (
                    <Ring className="day-ring" />
                  )}
                  <span>{parseDateStr(d).getDate()}</span>
                  {r === "full" && (
                    <span className="mark" style={{ marginTop: -4 }}>
                      <Flame streak={3} lit burnt={false} size={17} />
                    </span>
                  )}
                  {r === "half" && <Tick className="mark" />}
                  {r === "fail" && d !== today && <Cross className="mark" />}
                  {d === brokeOn && r !== "fail" && <Cross className="mark" />}
                </button>
              );
            })}
          </div>

          <p className="note" style={{ marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <Flame streak={3} lit burnt={false} size={13} /> tudo feito
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <Tick className="mark" /> mais da metade
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <Cross className="mark" /> fogo apagou
            </span>
          </p>

          {selected && (
            <div className="cal-list">
              <div style={{ fontSize: "var(--fs)", lineHeight: 1.2, textTransform: "lowercase" }}>
                {selected === today ? "hoje" : selLabel}
              </div>
              {s && (
                <div className="note">
                  {s.done} de {s.total} feitas · {Math.round((s.done / s.total) * 100)}%
                </div>
              )}
              {dayTasks.length === 0 ? (
                <p className="note" style={{ marginTop: 8 }}>
                  Nada escrito neste dia.
                </p>
              ) : (
                <ul className="tasks" style={{ paddingBottom: 0 }}>
                  {dayTasks.map((x, i) => (
                    <TaskLine key={x.id} task={x} index={i} onToggle={onToggle} />
                  ))}
                </ul>
              )}
              {selected < today && pending.length > 0 && (
                <button className="pill" onClick={() => onCopyToToday(pending.map((p) => p.title))}>
                  copiar {pending.length === 1 ? "a pendente" : `as ${pending.length} pendentes`} pra hoje
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
