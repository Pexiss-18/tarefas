export type Paper = {
  id: string;
  name: string;
  pen: string;
  /** Pontos totais necessários para desbloquear. */
  unlockAt: number;
  /** Folha escura: muda a cor da barra do sistema. */
  dark?: boolean;
  /** Cor de fundo, usada na barra do navegador. */
  bg: string;
};

export const PAPERS: Paper[] = [
  { id: "amassada", name: "Folha amassada", pen: "Bic azul", unlockAt: 0, bg: "#e6e1d3" },
  { id: "fichario", name: "Folha de fichário", pen: "Bic preta", unlockAt: 30, bg: "#f1f0ea" },
  { id: "caderno", name: "Caderno novo", pen: "Gel preta + marca-texto", unlockAt: 80, bg: "#fbfbf7" },
  { id: "kraft", name: "Papel kraft", pen: "Marcador + gel branca", unlockAt: 150, bg: "#bd9465" },
  { id: "engenharia", name: "Quadriculado de engenharia", pen: "Lapiseira + caneta vermelha", unlockAt: 240, bg: "#e1ebd3" },
  { id: "algodao", name: "Papel de algodão", pen: "Caneta-tinteiro", unlockAt: 350, bg: "#f1f0eb" },
  { id: "preto", name: "Caderno preto", pen: "Gel dourada", unlockAt: 480, dark: true, bg: "#1c1b1e" }
];

export function levelFor(xp: number): number {
  let lvl = 0;
  PAPERS.forEach((p, i) => {
    if (xp >= p.unlockAt) lvl = i;
  });
  return lvl;
}

export const XP_HALF = 10;
/** O dia só conta (pontos e fogo) com pelo menos esta quantidade de tarefas. */
export const MIN_TASKS = 4;
export const XP_FULL = 15;
