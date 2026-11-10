"use client";

import { MIN_TASKS, PAPERS, XP_FULL, XP_HALF } from "@/lib/papers";
import { Close, Lock } from "./Icons";

type Props = {
  paper: string;
  xp: number;
  level: number;
  onPick: (id: string) => void;
  onClose: () => void;
};

export default function PapersSlip({ paper, xp, level, onPick, onClose }: Props) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="slip paper" data-paper={paper} role="dialog" aria-label="Coleção de folhas">
        <div className="slip-head">
          <span className="slip-title">Suas folhas</span>
          <button className="btn" onClick={onClose} aria-label="Fechar">
            <Close />
          </button>
        </div>
        <div className="slip-body">
          <p className="note">
            Dia com {MIN_TASKS} tarefas ou mais e mais da metade feita: <strong>+{XP_HALF}</strong> pontos. Tudo feito: <strong>+{XP_FULL}</strong>. Se o fogo
            apagar, a folha queima e você volta uma folha. Você tem <strong>{xp}</strong> pontos.
          </p>
          <div className="papers">
            {PAPERS.map((p, i) => {
              const locked = i > level;
              const current = p.id === paper;
              return (
                <button
                  key={p.id}
                  className={`swatch paper${locked ? " locked" : ""}${current ? " current" : ""}`}
                  data-paper={p.id}
                  disabled={locked}
                  onClick={() => onPick(p.id)}
                  aria-pressed={current}
                >
                  {locked && <Lock className="lock" />}
                  <div style={{ minWidth: 0 }}>
                    <div className="swatch-name">{p.name}</div>
                    <div className="swatch-pen">{p.pen}</div>
                  </div>
                  <div className="swatch-tag">
                    {locked ? `faltam ${p.unlockAt - xp} pts` : current ? "em uso" : "usar"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
