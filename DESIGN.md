# DESIGN.md

Fonte única do sistema visual dos dois jogos do stand. Os tokens abaixo estão implementados em `compartilhado/tokens.css`; nenhum outro arquivo define cor, tamanho de fonte, espaçamento ou raio fora deles.

**Direção:** documentação técnica sóbria com a linguagem de uma tela de revisão de código. Alinhamento à esquerda, densidade média, bordas de 1px, sem sombras e sem gradientes. A hierarquia vem de espaço, alinhamento e peso tipográfico.

## Reaproveitamento

| Item | Onde está | Decisão | Motivo |
|---|---|---|---|
| Verde institucional `#2F9E41` | `css/tema.css` dos dois jogos, logo provisório | Adaptar | Matiz reaproveitado no token `--success` (`#62bd73`), clareado para 7,1:1 sobre `--surface`. Não virou acento porque seleção e acerto ficariam com a mesma cor. |
| Vermelho institucional `#CD191E` | `css/tema.css`, logo provisório | Adaptar | Matiz reaproveitado em `--danger` (`#ec8584`), clareado para 6,5:1 sobre `--surface`. |
| Acentos extras (roxo `#8B6CFF`, rosa, ciano, laranja, amarelo) | `quiz/css/tema.css`, `quiz/src/dados/areas.js` (`cor`) | Descartar | Vários destaques ao mesmo tempo; o roxo está na lista de proibidos. O campo `cor` das áreas continua nos dados, mas a interface não o usa mais. |
| Gradientes, blobs, grade de fundo, brilho | `css/app.css` dos dois jogos | Descartar | Proibidos (seção 8). |
| Cores do editor (`#0D1117`, `#FF7B72`, `#D2A8FF` etc.) | `bug/css/tema.css` | Descartar | Cópia de tema de terceiros, com cinco cores de sintaxe e lilás. Substituídas por quatro cores derivadas da paleta. |
| Fontes | `--fonte-texto` e `--fonte-mono` em `tema.css` | Descartar | Eram só fontes do sistema (Roboto, Segoe UI, Arial), todas proibidas. Substituídas por IBM Plex Sans e IBM Plex Mono, embutidas em `compartilhado/fontes/` (os jogos precisam funcionar offline). |
| Logo do curso / IFBA | SVG provisório inline no `index.html` | Adaptar | Não há logo oficial nem imagem no projeto, só o provisório criado na primeira versão. Virou marca pequena e monocromática no cabeçalho. **Sinalização:** não existe manual de identidade visual no projeto; ao trocar pelo logo oficial, confirmar com a comunicação do IFBA a versão para fundo escuro. |
| Fotos e imagens do instituto | nenhuma | Não há | Nada a reaproveitar. |
| Ícones | `quiz/src/ui/icones.js` (6 ícones de área em círculo), `bug/src/ui/icones.js` (certo, errado, troféu) | Adaptar / Descartar | Mantidos só check e x (comunicam resultado). Ícones de área em círculo e troféu removidos; o arquivo de ícones do quiz foi apagado por não ter mais uso. |
| Bibliotecas de componentes | nenhuma | Não há | JavaScript e CSS próprios. |
| Conteúdo: 7 perguntas, 6 áreas, 15 trechos de Python | `src/dados/` | Reutilizar | Sentido mantido. Reescritos apenas os textos de "incentivo" das áreas (eram frases motivacionais). |
| Microcopy com exclamação ou elogio | telas do jogo | Adaptar | "Achou o bug!", "NOVO RECORDE!", "Você tem 90 segundos!" e similares viraram frases neutras. |
| Telas, navegação, inatividade, ranking, administrador | `src/ui/`, `compartilhado/` | Reutilizar | Estrutura e ciclo de vida mantidos; estilos refeitos com tokens. Botões já eram elementos nativos com foco; faltavam foco visível, grupo de rádio e anúncio do feedback, agora adicionados. |
| Animações (pulso, entrada de tela, balanço, cursor piscando, confete visual do recorde) | `base.css`, `app.css` | Descartar | Proibidas. Restam transições de 140ms em cor e borda. |

## Tipografia

- **IBM Plex Sans** (interface e texto), pesos 400 e 500; 600 só no título da tela.
- **IBM Plex Mono** (código, tempo, contadores, números, rótulos técnicos), pesos 400 e 500.
- Arquivos `woff2` (subconjunto latino, cobre o português) em `compartilhado/fontes/`, licença SIL OFL 1.1.

| Token | Tamanho | Uso |
|---|---|---|
| `--t-apoio` | 0,875rem (14px na base) | rótulos, apoio, código |
| `--t-corpo` | 1rem (16px na base) | corpo |
| `--t-titulo` | 1,375rem (22px na base) | enunciado e título de tela |

Line-height 1,5 no texto e 1,6 no código. Largura máxima de leitura de 68ch. Sem caixa-alta e sem rótulos "eyebrow".

**Escala da base (desvio consciente):** os jogos rodam em tablet, num stand, e o requisito original pede texto legível a distância. A fonte raiz do documento é `clamp(100%, 0.5rem + 1.25vmin, 125%)`: 16px no celular, cerca de 18px num tablet de 800px e até 20px em telas maiores. Os três tamanhos continuam sendo os únicos, na mesma proporção.

## Cor

| Token | Valor | Função | Contraste |
|---|---|---|---|
| `--bg` | `#15171b` | fundo | |
| `--surface` | `#1c1f24` | painéis, código, alternativa selecionada | |
| `--surface-selecao` | `#23272d` | linha selecionada, hover de linha | |
| `--border` | `#2e3239` | divisórias (decorativas) | |
| `--border-control` | `#6b727d` | contorno de campo, alternativa e botão secundário | 3,7:1 sobre `--bg`, 3,4:1 sobre `--surface`, 3,1:1 sobre `--surface-selecao` |
| `--text` | `#e6e8eb` | texto | 13,5:1 sobre `--surface` |
| `--text-muted` | `#a3aab4` | apoio | 7,1:1 sobre `--surface` |
| `--accent` | `#d9a441` | foco, seleção e botão primário (único acento) | 7,4:1 sobre `--surface` |
| `--accent-texto` | `#15171b` | texto sobre o botão primário | 8,0:1 |
| `--success` | `#62bd73` | correto (sempre com check e texto) | 7,1:1 |
| `--danger` | `#ec8584` | incorreto (sempre com x e texto) | 6,5:1 |
| `--grafico` | `#8fbbe3` | forma do gráfico de radar do quiz | 8,2:1 |

Realce de sintaxe (4 cores, medidas sobre `--surface`): palavra-chave `#8fbbe3` (8,2:1), string `#a9cc8c` (9,2:1), número `#9fd3d0` (10,0:1), comentário `--text-muted` em itálico (7,1:1). Nomes de função ficam na cor do texto.

Tema claro: não implementado. Os jogos rodam em tablet num ambiente fixo, e o escuro é o padrão pedido.

## Forma, espaço e movimento

- Raio `--raio` de 3px. Bordas de 1px. Nenhuma sombra.
- Espaçamento: `--e-1` 4, `--e-2` 8, `--e-3` 12, `--e-4` 16, `--e-6` 24, `--e-8` 32, `--e-12` 48 (px na base).
- Alvo de toque mínimo `--alvo`: 2,75rem (44px na base).
- Larguras: coluna do quiz `--largura-coluna` 42,5rem (680px), painel lateral do código `--largura-lateral` 21,25rem (340px), leitura `--largura-leitura` 68ch.
- Nunca cartão dentro de cartão.
- Transições de 140ms em cor e borda (`--transicao`). Sem animação de entrada, pulso ou partículas. `prefers-reduced-motion` zera as transições.
- Foco: contorno de 2px em `--accent` com afastamento de 2px em todo elemento interativo.

## Ícones

Um conjunto de traço com dois desenhos: check e x. Usados só para marcar certo e errado, sempre acompanhados de texto. Sem emojis.

## Microcopy

Português do Brasil, frases curtas e neutras, sem exclamação: "Iniciar", "Confirmar resposta", "Próxima questão", "Ver resultado", "Confirmar linha", "Próximo desafio", "Correto.", "Incorreto.". Pontuação como número em mono.

## Proibições (passe de subtração)

- Fontes: Inter, Roboto, Arial, Open Sans, Lato, fontes do sistema, Space Grotesk, Plus Jakarta Sans, Geist.
- Gradientes de qualquer tipo, texto em gradiente, bordas em gradiente, blobs, glow, glassmorphism.
- Roxo, índigo ou azul-violeta como acento. Fundo creme com terracota.
- Três cartões em linha com ícone, hero centralizado, cartão dentro de cartão, cartões muito arredondados com sombra.
- Mais de três tamanhos de fonte, peso 600 espalhado, caixa-alta, badges, pílulas, cabeçalhos minúsculos.
- Widgets decorativos, ícones em círculo, emojis.
- Quatro botões coloridos nas alternativas, timer com cores de semáforo.
- Confete, troféu, mascote, animação de entrada, mensagens de elogio.
- Placeholder, lorem ipsum, mostrar só o caminho feliz.

## Conflitos com a lógica existente (mantida a lógica)

- **Quiz sem resposta certa.** É um quiz de perfil: nenhuma alternativa é correta. Em vez de "Correto./Incorreto.", o feedback diz para quais áreas a resposta somou pontos. O resultado mostra a pontuação por área em vez de acertos.
- **Gráfico de radar no resultado (pedido do curso).** A pontuação por área virou um radar de 6 vértices, com nível A a E em `--danger` e pontos em mono, seguindo a referência aprovada. A forma usa `--grafico` com preenchimento translúcido (cor chapada, sem gradiente). Os textos são HTML posicionado sobre o SVG, para não encolherem com o gráfico no celular.
- **Tela inicial do quiz.** Não há categorias nem número de questões variável na lógica; o formulário oferece só a escolha do tempo.
- **Tempo do quiz.** Padrão "15 s por questão" para manter a partida abaixo de 2 minutos no stand; "Sem tempo" fica disponível. Como cada questão tem 15 s, o aviso em texto aparece nos últimos 5 s, e não nos últimos 10.
- **Tempo do Corrida contra o Bug.** A rodada de 90 s e a pontuação por rapidez são a mecânica do jogo e não foram tornadas opcionais. O tempo fica visível no cabeçalho, sem cores de semáforo, com aviso em texto nos últimos 10 s.
- **Avanço automático no Corrida contra o Bug.** Removido: depois da explicação, o próximo desafio só começa com "Próximo desafio" (`segundosFeedback: 0` em `config.js`). O relógio continua parado durante a explicação, como antes.
- **Dica, tipo do erro e correção.** Os trechos não tinham esses textos. Foram acrescentados como campos novos e opcionais (`tipo`, `dica`, `correcao`) em `dados/trechos.js`; os campos antigos e as regras não mudaram.
- **Ranking em tela cheia de stand.** As linhas do ranking usam `--t-titulo` para leitura a distância.
- **Estado de erro de gravação.** A camada de aplicação não informa falha ao salvar no ranking; a interface não tem como exibir esse erro sem mudar a lógica.
