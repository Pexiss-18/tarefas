# Product

**Tarefas**: a checklist do dia escrita numa folha de caderno, que melhora conforme você cumpre o que escreveu.

> O PRODUCT.md do portfólio pessoal que morava aqui foi movido para `portfolio/PRODUCT.md`.

## Platform

web

PWA instalável (manifest + ícones), feita pro celular primeiro. Funciona no navegador do computador, com a folha centralizada sobre a mesa.

## Stack

- Next.js 15 (App Router) exportado como site estático, React 19 + TypeScript, Tailwind CSS v4 (o visual vive em `app/globals.css`)
- Firebase no projeto `px-financeiro` (o mesmo do px_financeiro): Authentication por e-mail e senha e Firestore em `tarefas/{uid}/tasks/{id}`, com cache local
- Hospedado no GitHub Pages em https://pexiss-18.github.io/tarefas/, com deploy a cada push na `main`
- Fontes manuscritas via `next/font/google`: uma por folha/caneta

## Users

Uma pessoa só: o dono do caderno. Usa no celular ao longo do dia (anotar, riscar) e às vezes no computador. Os dois veem sempre os mesmos dados.

## Product Purpose

Reduzir a fricção de planejar o dia e combater a procrastinação com um motivo visível pra cumprir: a folha e o fogo. Uma tela só, sem caixa de entrada, projetos ou pomodoro.

## Positioning

Não é um gerenciador de tarefas. É uma folha de caderno de verdade: amassada, escrita à caneta, que vai ficando mais bonita com a constância e queima quando você larga.

## Operating Context

- Abrir, escrever na linha de baixo e dar Enter adiciona em hoje. Tocar risca e desrisca. Arrastar pra esquerda apaga, com "desfazer".
- Calendário (ícone ou toque no fogo): ver e corrigir dias anteriores e copiar pendentes pra hoje. As cópias não alteram o resultado do dia original.
- Coleção de folhas: escolher qualquer folha já desbloqueada.

## Capabilities and Constraints

Regras confirmadas pelo dono:

- **Streak (o fogo):** dias seguidos com **mais de 50%** das tarefas feitas. Hoje só conta quando passa de 50% e ainda não conta como quebra.
- **Pontos:** dia com mais de 50% = **+10**, dia com 100% = **+15**.
- **Quebra:** um dia que não passa de 50% apaga o fogo, queima a folha e **volta uma folha**. **Dia sem nenhuma tarefa também quebra.**
- **Reacender:** fazer mais da metade de novo reacende o fogo e a queimadura some.
- **Login e nuvem:** e-mail e senha do Firebase (pode ser a mesma conta do px_financeiro). Os dados ficam no Firestore, pra computador e celular ficarem sincronizados, e cada aparelho continua logado.
- As regras do Firestore (`firestore.rules`) valem pro projeto inteiro e trazem as do px_financeiro junto.
- Todo o progresso é recalculado a partir do histórico de tarefas. Não existe estado de pontos guardado à parte.
- Folhas e limiares de pontos ficam em `lib/papers.ts`, as regras em `lib/progress.ts`.

## Brand Commitments

- Tudo é feito à mão: caneta, lápis de cor, papel. Nada de ícone de sistema, emoji ou efeito plástico.
- Cada folha tem a sua caneta e a sua letra.
- Bic não escreve em negrito, então nenhum texto de caneta usa negrito.
- Escrita em português do Brasil, coloquial e curta ("pra", "faça mais da metade").

## Evidence on Hand

Sem métricas, depoimentos ou números de uso. Não inventar.

## Product Principles

1. Uma tela, uma folha, o dia de hoje.
2. O progresso aparece no material: a folha melhora com a constância e queima com o abandono.
3. Errar é recuperável. Apagar tem "desfazer", e o fogo reacende no dia seguinte.
4. Nenhum controle cobre o que você escreveu.

## Accessibility & Inclusion

- Toques de 44px ou mais, foco visível e checkboxes com nome (o título da tarefa).
- Texto de caneta com contraste de 4.5:1 ou mais sobre cada folha, inclusive nas folhas bloqueadas.
- O fogo tem rótulo falado ("6 dias seguidos. Abrir calendário"), e o status usa `aria-live`.
- `prefers-reduced-motion` desliga as animações.
