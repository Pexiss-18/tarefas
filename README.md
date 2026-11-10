# Tarefas

As tarefas do dia escritas numa folha de caderno, que melhora conforme você cumpre.

No ar em **https://pexiss-18.github.io/tarefas/**

## Stack

- Next.js 15 (App Router) exportado como site estático (`output: "export"`), React 19 + TypeScript, Tailwind CSS v4
- Firebase (projeto `px-financeiro`, o mesmo do px_financeiro):
  - **Authentication** por e-mail e senha
  - **Firestore** com as tarefas em `tarefas/{uid}/tasks/{id}`, cache local (abre rápido e funciona sem internet)
- Hospedagem no GitHub Pages: cada push na `main` publica sozinho (`.github/workflows/deploy.yml`)

## Como rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000/tarefas/ (o app vive em `/tarefas`, igual no GitHub Pages). O login e as tarefas são os mesmos do site publicado.

## Login

E-mail e senha do Firebase. Pode ser a mesma conta do px_financeiro, ou dá pra criar uma em "criar conta". Cada aparelho entra uma vez e continua logado.

## Regras do Firestore

As regras ficam em [`firestore.rules`](firestore.rules) e valem para o **projeto Firebase inteiro**: o arquivo traz as do px_financeiro e as do Tarefas juntas. Para publicar: console do Firebase → Firestore Database → Regras → cole o arquivo completo → Publicar. Colar só um bloco derruba o outro app.

## No celular

Abra https://pexiss-18.github.io/tarefas/, entre, e no menu do navegador use **"Adicionar à tela inicial"**. Como o site é HTTPS, ele abre como app, em janela própria.

## Como funciona

Uma tela só, feita pro celular: as tarefas do dia escritas numa folha de caderno.

- **Escrever** na linha de baixo e Enter adiciona a tarefa em hoje.
- **Tocar** na tarefa risca/desrisca. **Arrastar pra esquerda** apaga (com "desfazer").
- **Calendário** (ícone ou toque no fogo): veja qualquer dia anterior, corrija o que marcou e copie pendentes pra hoje.
- **Fogo (streak):** dias seguidos com **4 tarefas ou mais** e **mais de 50%** delas feitas. A chama muda com o tamanho do streak (faísca → chama → fogueira → fogo azul → fogo místico). Enquanto hoje não passou de 50%, ela fica apagadinha esperando.
- **Pontos:** dia que conta (4+ tarefas) com mais de 50% = **+10**, com 100% = **+15**. Os pontos desbloqueiam folhas e canetas novas:

| Pontos | Folha | Caneta |
| --- | --- | --- |
| 0 | Folha amassada | Bic azul |
| 30 | Folha de fichário | Bic preta |
| 80 | Caderno novo | Gel preta + marca-texto |
| 150 | Papel kraft | Marcador + gel branca |
| 240 | Quadriculado de engenharia | Lapiseira + caneta vermelha |
| 350 | Papel de algodão | Caneta-tinteiro |
| 480 | Caderno preto | Gel dourada |

- **Fogo apagou:** se um dia passa sem chegar a mais de 50%, com menos de 4 tarefas ou sem tarefas, o streak zera, a folha fica **queimada** e você **volta uma folha**. Ao fazer mais da metade de novo, o fogo reacende e a queimadura some.
- No ícone de folhas dá pra escolher qualquer folha já desbloqueada.

Tudo é calculado a partir do histórico de tarefas, então computador e celular mostram sempre o mesmo progresso.
