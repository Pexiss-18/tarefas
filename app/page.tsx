"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Task } from "@/lib/types";
import { parseDateStr, todayStr } from "@/lib/date";
import { computeProgress } from "@/lib/progress";
import { PAPERS, levelFor } from "@/lib/papers";
import { deleteTask, newTask, restoreTask, saveTask, watchTasks, watchUser } from "@/lib/cloud";
import LoginView from "@/components/LoginView";
import TaskLine from "@/components/TaskLine";
import Flame from "@/components/Flame";
import Burn from "@/components/Burn";
import CalendarSlip from "@/components/CalendarSlip";
import PapersSlip from "@/components/PapersSlip";
import { CalendarIcon, PapersIcon, Pen } from "@/components/Icons";
import FitLine from "@/components/FitLine";

const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string | null) {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {}
  }
};

export default function Home() {
  // undefined = ainda verificando; null = sem login
  const [uid, setUid] = useState<string | null | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState(todayStr);
  const [draft, setDraft] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const [sheet, setSheet] = useState<"calendar" | "papers" | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [unlocked, setUnlocked] = useState<{ level: number; again: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // folha vista por último: usada até o histórico chegar, pra não piscar a folha inicial
  const [lastLevel, setLastLevel] = useState(0);
  useEffect(() => {
    setChosen(store.get("tarefas.paper"));
    setLastLevel(Math.max(0, Number(store.get("tarefas.seenLevel") ?? "0") || 0));
  }, []);

  const showToast = useCallback((text: string, undo?: () => void) => {
    clearTimeout(toastTimer.current);
    setToast({ text, undo });
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);
  const saveFailed = useCallback(() => showToast("Não deu pra salvar. Confira a conexão e tente de novo."), [showToast]);

  useEffect(() => watchUser((u) => setUid(u?.uid ?? null)), []);

  // tarefas ao vivo: chegam na hora, de qualquer aparelho, e funcionam sem internet
  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setLoaded(false);
      return;
    }
    const stop = watchTasks(
      uid,
      (t) => {
        setTasks(t);
        setLoaded(true);
      },
      () => showToast("Não deu pra abrir o caderno. Confira a conexão.")
    );
    // vira o dia com o app aberto (ou ao voltar pra ele)
    const onVis = () => document.visibilityState === "visible" && setToday(todayStr());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [uid, showToast]);

  const progress = useMemo(() => computeProgress(tasks, today), [tasks, today]);

  // folha em uso: a escolhida (se desbloqueada) ou a melhor disponível
  const chosenIdx = PAPERS.findIndex((p) => p.id === chosen);
  const level = loaded ? progress.level : Math.min(lastLevel, PAPERS.length - 1);
  const paperIdx = chosenIdx >= 0 && chosenIdx <= level ? chosenIdx : level;
  const paper = PAPERS[paperIdx];

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paper.bg);
  }, [paper.bg]);

  // nova folha desbloqueada?
  useEffect(() => {
    if (!loaded) return;
    const seen = Number(store.get("tarefas.seenLevel") ?? "-1");
    const best = Number(store.get("tarefas.bestLevel") ?? "-1");
    if (seen >= 0 && progress.level > seen) setUnlocked({ level: progress.level, again: progress.level <= best });
    store.set("tarefas.seenLevel", String(progress.level));
    store.set("tarefas.bestLevel", String(Math.max(best, progress.level)));
  }, [loaded, progress.level]);

  // as gravações aparecem na tela na hora (cache local) e sobem em segundo plano
  const toggle = useCallback(
    (t: Task) => {
      if (uid) saveTask(uid, t.id, { done: !t.done }).catch(saveFailed);
    },
    [uid, saveFailed]
  );

  const create = (title: string) => {
    if (!uid) return null;
    const { task, saved } = newTask(uid, title, today);
    saved.catch(saveFailed);
    return task;
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setDraft("");
    const task = create(title);
    if (task) setFresh(task.id);
  };

  const remove = (t: Task) => {
    if (!uid) return;
    deleteTask(uid, t.id).catch(saveFailed);
    showToast("Tarefa apagada.", () => {
      restoreTask(uid, t).catch(saveFailed);
      setToast(null);
    });
  };

  const copyToToday = (titles: string[]) => {
    for (const t of titles) create(t);
    setSheet(null);
    showToast(titles.length === 1 ? "Tarefa copiada pra hoje." : `${titles.length} tarefas copiadas pra hoje.`);
  };

  const pick = (id: string) => {
    const auto = PAPERS.findIndex((p) => p.id === id) === progress.level;
    store.set("tarefas.paper", auto ? null : id);
    setChosen(auto ? null : id);
  };

  if (uid === null) return <LoginView />;

  const todays = tasks.filter((t) => t.date === today);
  const done = todays.filter((t) => t.done).length;
  const pct = todays.length ? done / todays.length : 0;
  const d = parseDateStr(today);
  // "terça, 10 de novembro": como se escreve no topo da página
  const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" }).replace(/-feira$/, "");
  const dayLabel = `${weekday}, ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`;
  // forma curta pra telas estreitas: "terça, 10 nov."
  const dayShort = `${weekday}, ${d.getDate()} ${d.toLocaleDateString("pt-BR", { month: "short" }).replace(/.$/, "")}.`;

  let status: React.ReactNode;
  if (!loaded) status = "abrindo o caderno…";
  else if (progress.burnt && !progress.litToday)
    status = progress.droppedFrom !== null ? (
      <>
        O fogo apagou e a folha queimou. Você voltou pra <strong>{PAPERS[levelFor(progress.xp)].name.toLowerCase()}</strong>. Faça
        mais da metade hoje pra reacender.
      </>
    ) : (
      <>O fogo apagou. Faça mais da metade hoje pra reacender.</>
    );
  else if (progress.litToday)
    status =
      done === todays.length ? (
        <>Tudo feito hoje. +15 pontos garantidos.</>
      ) : (
        <>Fogo de hoje aceso. Termine tudo pra ganhar mais pontos.</>
      );
  else if (progress.streak > 0) status = <>Faça mais da metade hoje pra manter o fogo.</>;
  else if (todays.length === 0) status = <>Escreva o que você quer fazer hoje.</>;
  else status = <>Faça mais da metade pra acender o fogo.</>;

  const burntNow = loaded && progress.burnt && !progress.litToday;
  const toNext = progress.nextAt !== null ? progress.nextAt - progress.xp : null;

  return (
    <div className="desk">
      <main className={`sheet paper${burntNow ? " is-burnt" : ""}`} data-paper={paper.id}>
        <div className="margin-line" aria-hidden />
        <div className="holes" aria-hidden />

        <header className="head">
          <div className="head-date">
            <FitLine className="head-day" text={dayLabel} short={dayShort} />
          </div>
          <button
            className="fire"
            style={loaded ? undefined : { visibility: "hidden" }}
            onClick={() => setSheet("calendar")}
            aria-label={
              progress.streak > 0
                ? `${progress.streak} ${progress.streak === 1 ? "dia" : "dias"} seguidos. Abrir calendário`
                : "Sem fogo. Abrir calendário"
            }
          >
            <Flame streak={progress.streak} lit={progress.litToday} burnt={progress.burnt} />
            <span className="fire-count">
              {progress.streak} <small>{progress.streak === 1 ? "dia" : "dias"}</small>
            </span>
          </button>
        </header>

        <p className="status" aria-live="polite">
          {status}
        </p>

        {!loaded ? (
          <div className="meter" aria-hidden />
        ) : todays.length > 0 && (
          <svg className="meter" viewBox="0 0 300 18" preserveAspectRatio="none" role="img" aria-label={`${done} de ${todays.length} feitas`}>
            <defs>
              <clipPath id="meter-fill">
                <rect x="0" y="0" width="300" height="18" className="meter-clip" style={{ transform: `scaleX(${pct})` }} />
              </clipPath>
            </defs>
            <path d="M2 10C60 9 120 11 180 9.6C230 8.6 270 10.4 298 9.6" stroke="var(--line)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            <path d="M150 3.5L150.6 15.5" stroke="var(--ink-soft)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <path
              d="M2 10C60 9 120 11 180 9.6C230 8.6 270 10.4 298 9.6"
              stroke="var(--ink)"
              strokeWidth={3}
              clipPath="url(#meter-fill)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        <div className="lines">
          {loaded && todays.length === 0 ? (
            <p className="empty">
              Folha em branco.
              <br />
              Escreva a primeira tarefa aí embaixo.
            </p>
          ) : (
            <ul className="tasks">
              {todays.map((t, i) => (
                <TaskLine key={t.id} task={t} index={i} fresh={t.id === fresh} onToggle={toggle} onDelete={remove} />
              ))}
            </ul>
          )}
        </div>

        <form className="writer" onSubmit={add}>
          <Pen className="writer-pen" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="escrever tarefa…"
            aria-label="Nova tarefa"
            enterKeyHint="done"
            autoComplete="off"
            maxLength={140}
          />
          <button type="button" className="btn" onClick={() => setSheet("calendar")} aria-label="Calendário">
            <CalendarIcon />
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setSheet("papers")}
            aria-label={toNext !== null ? `Folhas. Faltam ${toNext} pontos para a próxima` : "Folhas"}
          >
            <PapersIcon />
          </button>
        </form>

        {burntNow && <Burn />}
      </main>

      {sheet === "calendar" && (
        <CalendarSlip
          paper={paper.id}
          tasks={tasks}
          today={today}
          brokeOn={progress.brokeOn}
          onToggle={toggle}
          onCopyToToday={copyToToday}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "papers" && (
        <PapersSlip paper={paper.id} xp={progress.xp} level={progress.level} onPick={pick} onClose={() => setSheet(null)} />
      )}

      {unlocked !== null && (
        <>
          <div className="scrim" onClick={() => setUnlocked(null)} />
          <div className="unlock paper" data-paper={PAPERS[unlocked.level].id} role="dialog" aria-label="Nova folha desbloqueada">
            <h2>{PAPERS[unlocked.level].name}</h2>
            <p className="note">
              {unlocked.again ? "Reconquistada" : "Desbloqueada"}, com {PAPERS[unlocked.level].pen.toLowerCase()}.
            </p>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 14 }}>
              <button
                className="pill"
                onClick={() => {
                  pick(PAPERS[unlocked.level].id);
                  setUnlocked(null);
                }}
              >
                usar agora
              </button>
              <button
                className="pill"
                style={{ borderColor: "transparent" }}
                onClick={() => {
                  if (chosen === null) pick(PAPERS[unlocked.level - 1].id);
                  setUnlocked(null);
                }}
              >
                depois
              </button>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="toast paper" data-paper={paper.id} role="status">
          <span>{toast.text}</span>
          {toast.undo && <button onClick={toast.undo}>desfazer</button>}
        </div>
      )}
    </div>
  );
}
