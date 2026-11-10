import type { Task } from "./types";
import { addDays } from "./date";
import { PAPERS, XP_FULL, XP_HALF, levelFor } from "./papers";

export type DayStat = { total: number; done: number };

export type DayResult = "full" | "half" | "fail" | "empty";

export type Progress = {
  xp: number;
  level: number;
  streak: number;
  /** Hoje já passou de 50%? (o fogo de hoje está aceso) */
  litToday: boolean;
  /** O streak quebrou e ainda não houve um dia cumprido depois disso. */
  burnt: boolean;
  /** Dia em que o fogo apagou (o último dia que quebrou o streak). */
  brokeOn: string | null;
  /** Nível perdido na última quebra, se houve queda. */
  droppedFrom: number | null;
  nextAt: number | null;
};

export function dayStats(tasks: Task[]): Map<string, DayStat> {
  const map = new Map<string, DayStat>();
  for (const t of tasks) {
    const s = map.get(t.date) ?? { total: 0, done: 0 };
    s.total++;
    if (t.done) s.done++;
    map.set(t.date, s);
  }
  return map;
}

export function resultOf(s: DayStat | undefined): DayResult {
  if (!s || s.total === 0) return "empty";
  if (s.done === s.total) return "full";
  if (s.done / s.total > 0.5) return "half";
  return "fail";
}

const gainOf = (r: DayResult) => (r === "full" ? XP_FULL : r === "half" ? XP_HALF : 0);

/**
 * Reproduz o histórico dia a dia:
 * - dia com mais de 50% concluído: streak +1 e +10 pontos (100%: +15);
 * - dia abaixo disso (ou sem tarefas) com streak ativo: o fogo apaga,
 *   a folha queima e você volta para o estilo anterior;
 * - hoje só soma quando já passou de 50% — ainda não conta como quebra.
 */
export function computeProgress(tasks: Task[], today: string): Progress {
  const stats = dayStats(tasks);
  let xp = 0;
  let streak = 0;
  let burnt = false;
  let brokeOn: string | null = null;
  let droppedFrom: number | null = null;

  const dates = [...stats.keys()].filter((d) => d < today).sort();
  if (dates.length > 0) {
    for (let d = dates[0]; d < today; d = addDays(d, 1)) {
      const r = resultOf(stats.get(d));
      if (r === "full" || r === "half") {
        streak++;
        xp += gainOf(r);
        burnt = false;
      } else if (streak > 0) {
        const lvl = levelFor(xp);
        const to = Math.max(0, lvl - 1);
        droppedFrom = lvl > 0 ? lvl : null;
        xp = PAPERS[to].unlockAt;
        streak = 0;
        burnt = true;
        brokeOn = d;
      }
    }
  }

  const todayResult = resultOf(stats.get(today));
  const litToday = todayResult === "full" || todayResult === "half";
  if (litToday) {
    streak++;
    xp += gainOf(todayResult);
    burnt = false;
  }

  const level = levelFor(xp);
  return {
    xp,
    level,
    streak,
    litToday,
    burnt,
    brokeOn,
    droppedFrom: burnt ? droppedFrom : null,
    nextAt: PAPERS[level + 1]?.unlockAt ?? null
  };
}
