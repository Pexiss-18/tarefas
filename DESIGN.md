---
name: Tarefas
description: As tarefas do dia, escritas à caneta numa folha de caderno que melhora com a constância e queima com o abandono.
colors:
  bic-azul: "#24399a"
  bic-azul-soft: "#46559e"
  desk: "#2b2724"
  amassada-paper: "#e6e1d3"
  amassada-line: "#a7b6c6"
  amassada-margin: "#d49393"
  fichario-paper: "#f1f0ea"
  fichario-ink: "#1f2026"
  fichario-ink-soft: "#4a4c57"
  fichario-line: "#a6bdd6"
  fichario-margin: "#e08a8a"
  caderno-paper: "#fbfbf7"
  caderno-ink: "#15171d"
  caderno-ink-soft: "#474b57"
  caderno-line: "#8fb2df"
  caderno-margin: "#e2777a"
  marca-texto: "#ffe04a"
  kraft-paper: "#bd9465"
  kraft-ink: "#1d140c"
  kraft-ink-soft: "#3b2814"
  kraft-line: "rgb(78 48 18 / 0.3)"
  gel-branca: "#fffaf0"
  engenharia-paper: "#e1ebd3"
  engenharia-ink: "#33373b"
  engenharia-ink-soft: "#4b5156"
  engenharia-line: "#a6c497"
  caneta-vermelha: "#c2352b"
  algodao-paper: "#f1f0eb"
  algodao-ink: "#17465a"
  algodao-ink-soft: "#3d6475"
  algodao-line: "rgb(23 70 90 / 0.09)"
  preto-paper: "#1c1b1e"
  gel-dourada: "#e2c068"
  gel-dourada-soft: "#b9a066"
  preto-line: "rgb(226 192 104 / 0.16)"
  flame-faisca-body: "#e85a24"
  flame-faisca-core: "#ffb03a"
  flame-chama-body: "#e0441c"
  flame-chama-core: "#ff9a2a"
  flame-fogueira-body: "#d9361a"
  flame-fogueira-core: "#5fb4f0"
  flame-azul-body: "#2f66d6"
  flame-azul-core: "#9cc8ff"
  flame-mistico-body: "#6c35cf"
  flame-mistico-core: "#d19bff"
  burn-amarelado: "#7a4416"
  burn-tostado: "#a8743c"
  burn-marrom: "#6b3a14"
  burn-fundo: "#3a1d0a"
  burn-carvao: "#140a04"
  cafe: "#78481c"
  erro: "#b3261e"
  scrim: "rgb(20 16 12 / 0.45)"
typography:
  display:
    fontFamily: "Caveat, cursive"
    fontSize: "2.835rem"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "Caveat, cursive"
    fontSize: "2.106rem"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Caveat, cursive"
    fontSize: "2.025rem"
    fontWeight: 400
  body:
    fontFamily: "Caveat, cursive"
    fontSize: "1.62rem"
    fontWeight: 400
    lineHeight: "46px"
  label:
    fontFamily: "Caveat, cursive"
    fontSize: "1.166rem"
    fontWeight: 400
  numeral:
    fontFamily: "Caveat, cursive"
    fontSize: "1.539rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  sheet: "3px"
  slip: "4px"
  swatch: "2px"
  pill: "999px 900px 999px 950px"
  icon: "50%"
spacing:
  pauta: "46px"
  margem: "52px"
  texto: "68px"
  borda: "20px"
  check: "44px"
components:
  sheet:
    backgroundColor: "{colors.amassada-paper}"
    textColor: "{colors.bic-azul}"
    rounded: "{rounded.sheet}"
    width: "480px"
  task-line:
    textColor: "{colors.bic-azul}"
    typography: "{typography.body}"
    height: "{spacing.pauta}"
    padding: "0 20px 0 10px"
  task-line-done:
    textColor: "{colors.bic-azul-soft}"
    typography: "{typography.body}"
  check:
    textColor: "{colors.bic-azul}"
    width: "{spacing.check}"
    height: "{spacing.pauta}"
  writer:
    textColor: "{colors.bic-azul}"
    typography: "{typography.body}"
    height: "{spacing.pauta}"
    padding: "6px 10px 10px 10px"
  btn-icon:
    textColor: "{colors.bic-azul}"
    rounded: "{rounded.icon}"
    size: "46px"
  pill:
    textColor: "{colors.bic-azul}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  slip:
    backgroundColor: "{colors.amassada-paper}"
    textColor: "{colors.bic-azul}"
    rounded: "{rounded.slip}"
    width: "460px"
  swatch:
    backgroundColor: "{colors.fichario-paper}"
    textColor: "{colors.fichario-ink}"
    rounded: "{rounded.swatch}"
    padding: "14px 16px"
  toast:
    backgroundColor: "{colors.amassada-paper}"
    textColor: "{colors.bic-azul}"
    padding: "10px 16px"
---

# Design System: Tarefas

## Overview

**Creative North Star: "A Folha do Dia"**

Tudo o que aparece na tela é uma folha de papel de verdade, deitada numa mesa escura, escrita à mão com uma caneta só. Não há interface por cima do papel: a pauta é a grade, a margem vermelha é o alinhamento, a caneta é a cor do texto e dos ícones, e o estado do sistema aparece no próprio material. A folha melhora conforme o dono cumpre o que escreveu (amassada, fichário, caderno novo, kraft, engenharia, algodão, caderno preto) e queima quando ele larga.

A densidade é a de um caderno: uma tarefa por linha de pauta de 46px, texto grande e manuscrito, muito papel em branco. Cada folha é um mundo fechado com sua própria cor de papel, pauta, margem, tinta e letra, todos trocados juntos por `data-paper`. Os desenhos (caixinhas, risco, fogo, ícones, anel do dia no calendário) são traços SVG tremidos em `currentColor`, gerados de forma determinística, pra o mesmo desenho sair igual no servidor e no cliente.

O movimento imita a mão: o texto novo aparece da esquerda pra direita como se fosse escrito, o risco é desenhado em 0,42s, o visto em 0,32s, o fogo tremula devagar. Bilhetes (calendário, coleção de folhas) sobem como papel solto, levemente tortos. `prefers-reduced-motion` desliga tudo.

**Key Characteristics:**
- Uma folha, uma caneta, uma letra manuscrita por mundo; nunca misturadas.
- Pauta de 46px como grade única; todo texto de tarefa cai na linha.
- Margem a 52px; o texto começa a 68px.
- Desenho à mão em SVG, traço irregular, sempre na tinta da folha.
- Nenhum texto em negrito.
- Profundidade só de papel sobre a mesa.

## Colors

A paleta é feita de tintas de caneta sobre papéis reais, mais duas famílias de matéria: o fogo (lápis de cor) e a queimadura (tostado e carvão).

### Primary
- **Bic Azul** (`bic-azul`): a tinta da folha amassada, o mundo de entrada e o da tela de login. Texto, caixinhas, risco, contorno do fogo, ícones e barra de progresso. `bic-azul-soft` é a mesma caneta mais fraca: status, placeholder, tarefas riscadas, legendas.

### Secondary
- **As tintas de cada folha**: Bic preta do fichário (`fichario-ink`), gel preta do caderno novo (`caderno-ink`), marcador do kraft (`kraft-ink`), lapiseira da engenharia (`engenharia-ink`), tinteiro azul-petróleo do algodão (`algodao-ink`) e gel dourada do caderno preto (`gel-dourada`). Cada uma tem a sua versão `-soft` para o texto secundário.
- **Canetas de destaque**: o visto (`--accent`) usa uma segunda caneta só em três folhas: gel branca no kraft (`gel-branca`), caneta vermelha na engenharia (`caneta-vermelha`) e marca-texto amarelo no caderno novo (`marca-texto`), que pinta a tarefa feita por trás do texto em vez de riscar.

### Tertiary
- **Fogo de lápis de cor** (`flame-*-body` / `flame-*-core`): cinco degraus do streak, cada um com uma cor de corpo e uma de miolo. Faísca e chama são laranjas, a fogueira ganha miolo azul, depois fogo azul e fogo místico violeta. É o único lugar onde laranja existe.
- **Queimadura** (`burn-amarelado` → `burn-tostado` → `burn-marrom` → `burn-fundo` → `burn-carvao`): o papel amarela a partir da borda, passa por uma faixa tostada e escurece até o carvão da beirada. Marrom e preto, nunca brasa.
- **Café** (`cafe`): o anel de caneca da folha amassada.

### Neutral
- **Mesa** (`desk`): o fundo atrás da folha no desktop, o furo do fichário e a cor que aparece pelo carvão.
- **Papéis** (`*-paper`): do cinza-creme amassado ao branco do caderno novo, kraft, verde-claro de engenharia e o preto do último caderno. O `theme-color` do navegador acompanha o papel em uso.
- **Pauta e margem** (`*-line`, `*-margin`): azul-acinzentado e rosa nas folhas pautadas; verde no quadriculado; pontos dourados no caderno preto. Kraft, engenharia, algodão e preto não têm margem.
- **Erro** (`erro`): o vermelho da mensagem de senha errada no login.
- **Scrim** (`scrim`): sombra quente sobre a mesa quando um bilhete está aberto.

### Named Rules
**A Regra de Uma Caneta por Folha.** Cada folha tem exatamente uma tinta principal, uma versão fraca e no máximo uma caneta de destaque. Uma tela nova herda as variáveis da folha (`--ink`, `--ink-soft`, `--accent`, `--line`, `--margin`, `--paper`) e nunca escreve cor fixa.

**A Regra do Fogo Sem Brasa.** O laranja pertence só ao fogo do streak. A folha queimada é tostado, marrom e carvão; nada de brasa, borda laranja ou brilho.

## Typography

**Display Font:** a letra da folha em uso (com `cursive` de fallback)
**Body Font:** a mesma letra
**Label/Mono Font:** a mesma letra, com `tabular-nums` nos números

Uma folha, uma letra: Caveat (amassada), Kalam (fichário), Patrick Hand (caderno novo), Gochi Hand (kraft), Architects Daughter (engenharia), Dancing Script (algodão) e Shadows Into Light (caderno preto), todas via `next/font/google`. Cada letra tem o seu tamanho base `--fs` (de 1.12rem na engenharia a 1.62rem na amassada), ajustado pra largura da letra, e toda a escala é múltipla de `--fs`. Os valores do frontmatter são os da folha amassada.

### Hierarchy
- **Display** (400, `--fs` × 1.75, 1): o nome "Tarefas" no login. O nome da folha no desbloqueio usa `--fs` × 1.45.
- **Headline** (400, `--fs` × 1.3, 1.15): a data no topo, "terça, 10 de novembro", numa linha só. Ela encolhe até 80% pra caber e, se não couber, troca pela forma curta "terça, 10 nov.". Abaixo disso, quebra em vez de ficar ilegível.
- **Title** (400, `--fs` × 1.25): o título dos bilhetes ("Dias anteriores", "Suas folhas").
- **Body** (400, `--fs`, altura de linha = pauta de 46px): tarefas, campo de escrever, texto de folha vazia.
- **Label** (400, `--fs` × 0.72 a 0.78): status, "apagar", dias do calendário, botões-pílula, notas (0.74, altura de linha 1.35).
- **Numeral** (400, `--fs` × 0.95, tabular): o contador "6 dias" sob o fogo, com "dias" a 0.7em na tinta fraca.

### Named Rules
**A Regra da Bic.** Bic não escreve em negrito: todo texto tem peso 400. A ênfase vem da tinta (`--ink` contra `--ink-soft`), nunca do peso. `<strong>` herda o peso e só troca para a tinta forte.

**A Regra da Pauta.** O texto de tarefa sempre tem altura de linha igual à pauta (`--lh`), pra cada linha visual cair numa linha do papel e o risco ter onde passar.

## Layout

Coluna única de até 480px, altura de tela inteira (`100dvh`) no celular. A folha é a tela; a lista rola dentro dela e a pauta rola junto (`background-attachment: local`). O cabeçalho (data à esquerda, fogo à direita), o status e a barra feita à mão ficam no topo; o campo de escrever fica fixo no pé, com caneta, calendário e folhas.

Ritmo horizontal fixo: margem vermelha a 52px, conteúdo a 68px, borda direita a 20px. Na linha de tarefa, a caixinha ocupa uma coluna de 44px dentro do recuo, de modo que ela fica antes da margem e o texto depois dela. Ritmo vertical: múltiplos da pauta de 46px; a lista termina com duas pautas vazias de folga.

A partir de 560px a folha vira um objeto sobre a mesa: centralizada, até 920px de altura, girada -0.6°, com sombra. Os bilhetes passam de folha que sobe do pé para bilhete centralizado. Na folha queimada o conteúdo recua da beirada (topo +6px, direita 26px; tarefas 40px) e o campo de escrever mantém a largura.

**A Regra da Pauta Reta.** A pauta e a margem são retas e contínuas mesmo sobre os vincos da folha amassada. É uma adaptação aceita: legibilidade da linha antes da física do papel.

## Elevation & Depth

Profundidade é papel sobre a mesa, e nada mais. A folha principal é plana no celular (ela é a tela); no desktop e em todo papel solto (bilhetes, amostras de folha, aviso, desbloqueio, login), uma sombra difusa e escura a separa da mesa. Dentro da folha não existe camada: o relevo vem da textura (grão, fibra, vincos, anel de café), mesclada em `multiply` (ou `normal` na amassada, pra luz dos vincos não sumir, e `screen` no caderno preto).

### Shadow Vocabulary
- **Folha na mesa** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.25), 0 24px 60px -12px rgb(0 0 0 / 0.6)`): a folha no desktop e o cartão de login.
- **Bilhete** (`box-shadow: 0 -10px 40px rgb(0 0 0 / 0.35)`): calendário e coleção subindo do pé.
- **Amostra** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.2), 0 6px 14px -6px rgb(0 0 0 / 0.35)`): folhas desbloqueadas na coleção.
- **Aviso** (`box-shadow: 0 8px 24px rgb(0 0 0 / 0.35)`): o toast de "desfazer".
- **Desbloqueio** (`box-shadow: 0 20px 60px rgb(0 0 0 / 0.5)`): a folha nova que cai na mesa.

### Named Rules
**A Regra da Folha Deitada.** Só papel levantado tem sombra. Uma folha bloqueada fica deitada na mesa: sem sombra, só um fio de 1px na tinta a 18% e cor meio apagada (`grayscale(0.45)`), com o texto em contraste total.

## Shapes

Papel cortado: cantos quase retos (2 a 4px), nunca arredondados como cartão de app. O que não é papel é traço de caneta, com contorno tremido desenhado à mão. Papel solto entra torto (bilhete -0.8°, aviso -1°, desbloqueio -1.5°, amostras alternando +0.5° e -0.6°). O único elemento oval é a pílula, com raios desiguais (`999px 900px 999px 950px`) pra parecer contornada à mão. O fichário tem três furos que interrompem a pauta.

A folha queimada perde a forma retangular: uma beirada carbonizada irregular, com ondulação lenta de 4 a 10px na maior parte da borda e mordidas fundas em três lugares: o canto superior esquerdo (raio 50px), a parte baixa da lateral direita (a 74% da altura, 30px de fundo) e, menor, o canto inferior esquerdo (raio 32px), abaixo da caneta e sem chegar no campo de escrever.

## Components

### Buttons
Traço de caneta, sem caixa.
- **Shape:** área de toque circular de 46px, sem fundo nem borda; o ícone de 28px é o botão.
- **Primary:** ícones desenhados à mão (caneta, calendário, folhas, fechar, setas) em `currentColor`, traço 1.8 com pontas redondas.
- **Hover / Focus:** foco visível em contorno tracejado de 2px na tinta fraca, a 2px de distância. Ao toque, encolhe pra 0.92.
- **Pílula:** contorno de 1.5px na tinta, raios desiguais, padding 6px 14px, label em `--fs` × 0.78. A variante "depois" tem borda transparente. Desativada a 50%.

### Cards / Containers
- **Bilhete (slip):** um pedaço da folha em uso (`.paper` com o mesmo `data-paper`), largura até 460px, até 88% da altura, cantos de 4px em cima, girado -0.8°, sobe do pé em 0,42s sobre o scrim.
- **Amostra de folha (swatch):** cada amostra é a própria folha com a sua textura, tinta e letra. Mostra nome, caneta e "usar" / "em uso" / "faltam N pts". Cadeado desenhado quando bloqueada.
- **Aviso (toast):** tira de papel girada -1°, 84px acima do pé, com "desfazer" sublinhado (afastado 4px).

### Inputs / Fields
- **Campo de escrever:** sem caixa; é a linha de baixo da folha, com a caneta desenhada antes da margem e o placeholder "escrever tarefa…" na tinta fraca. Fio de 1.5px na cor da pauta separa o pé da lista, com o papel a 70% por trás. Em telas até 360px o placeholder encolhe pra 0.86em.
- **Senha (login):** linha de pauta de 1.5px embaixo, sem caixa.
- **Focus:** o mesmo tracejado de 2px; o campo de escrever mostra só o cursor na tinta.
- **Erro:** frase curta na cor `erro`, em `--fs` × 0.75.

### Linha de tarefa (assinatura)
Uma tarefa por pauta. A caixinha é um quadrado tremido (três variações que se alternam), o visto é desenhado na caneta de destaque em 0,32s. Tocar risca e desrisca.
- **Risco:** um traço ondulado à mão por linha visual do texto, medido no layout real e com semente estável por tarefa; traço de 2.1 na tinta, desenhado em 0,42s, com 0,18s de atraso entre linhas. A tarefa riscada passa pra tinta fraca.
- **Caderno novo:** em vez do risco, o marca-texto amarelo pinta 52% da altura da linha por trás do texto, que continua na tinta forte.
- **Apagar:** arrastar pra esquerda revela "apagar" e, depois de 96px, "solte pra apagar"; o aviso oferece "desfazer".
- **Tarefa nova:** aparece escrita da esquerda pra direita em 0,55s.

### Fogo (assinatura)
Contorno de caneta com duas passadas tremidas na tinta da folha, preenchido com hachura diagonal de lápis de cor no corpo e no miolo. Cresce de 0.7 a 1.14 de escala pelos cinco degraus do streak. Tremula sempre; antes de bater a meta do dia, tremula devagar, mais apagado e menos saturado. Sem streak: contorno tracejado (nunca aceso) ou um fio de fumaça (acabou de apagar). Abaixo de 24px (calendário, legenda) vira forma simplificada: poucos traços grossos e um contorno único de 4.5.

### Barra do dia
Uma linha de caneta levemente ondulada: o trilho na cor da pauta, um tracinho vertical marcando a metade, e a parte feita em traço de 3 na tinta, revelada em 0,5s.

### Folha amassada (assinatura)
Placa SVG gerada por `scripts/gen-amassada.mjs`: sete vincos longos de borda a borda, cada um com face de sombra e face de luz (mudança dura no vinco, esmaecendo pra longe), mais vincos curtos que saem deles e afinam até sumir. No canto inferior direito, um anel de café irregular e incompleto (contorno tracejado com falhas, um segundo anel deslocado e um pingo). Vinheta suave nas bordas. Não editar o SVG à mão; regenerar pelo script.

### Folha queimada (assinatura)
Camada SVG sobre a folha, medida no tamanho real: amarelado largo a partir da borda, faixa tostada clara, faixa marrom e fio quase preto acompanhando o contorno, e o carvão por fora da beirada irregular (ver Shapes). Entra em 1,6s. Sem laranja.

### Calendário
Grade de sete colunas no bilhete. Hoje e o dia selecionado ganham um círculo feito à mão. Marcas sob o número: fogo pequeno (tudo feito), visto (mais da metade), xis na tinta fraca (fogo apagou). Dias futuros a 45%.

## Do's and Don'ts

### Do:
- **Do** ler toda cor, letra e tamanho das variáveis da folha (`--paper`, `--ink`, `--ink-soft`, `--accent`, `--line`, `--margin`, `--font`, `--fs`).
- **Do** alinhar o texto de tarefa à pauta de 46px, com margem a 52px e texto a 68px.
- **Do** desenhar todo ícone e marca como SVG tremido em `currentColor`, com pontas redondas e semente determinística.
- **Do** dar sombra só ao papel levantado da mesa e girar levemente o papel solto (-0.6° a -1.5°).
- **Do** manter a pauta e a margem retas sobre os vincos.
- **Do** usar a forma simplificada do fogo abaixo de 24px.
- **Do** manter toques de 44px ou mais e foco em tracejado de 2px na tinta fraca.

### Don't:
- **Don't** usar negrito em nenhum texto: peso 400 sempre (Bic não escreve em negrito).
- **Don't** usar ícone de sistema, emoji, checkbox nativo, barra de progresso de app, card arredondado ou badge de gamificação.
- **Don't** pôr laranja, brasa ou brilho na folha queimada; o laranja é só do fogo.
- **Don't** misturar duas letras ou duas tintas principais na mesma folha.
- **Don't** cobrir o que foi escrito com controles; o conteúdo recua da beirada queimada em vez de ficar sob ela.
- **Don't** editar `public/tex/amassada.svg` à mão; regenerar pelo script.
