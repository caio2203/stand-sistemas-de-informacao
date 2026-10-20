# Corrida contra o Bug

O jogador vê trechos curtos de código Python, cada um com **exatamente um erro**, e toca na linha errada o mais rápido que puder. Acertos rápidos valem mais. Tem ranking Top 10 salvo no aparelho e uma área escondida para administradores.

## Como funciona

1. **Início:** campo de apelido (sem dados pessoais) e botão **Jogar**. O apelido aceita só letras, números, espaço, `_` e `-`, com até 12 caracteres.
2. **Rodada de 90 s** com cronômetro visível (fica vermelho nos últimos 10 s).
3. **Trechos de 3 a 6 linhas.** 15 trechos em 3 níveis (5 fáceis, 5 médios, 5 difíceis). A ordem é sorteada dentro de cada nível e os níveis vêm em sequência: fácil, médio, difícil. Nenhum trecho se repete na partida.
4. **Pontuação:** acerto vale 100 pontos, menos 6 por segundo pensando, com mínimo de 10. Erro desconta 30 (a pontuação nunca fica negativa). Cada trecho aceita uma resposta.
5. **Selecionar e confirmar:** toque na linha (ou use as setas), veja "Linha 3 selecionada" na barra de status e toque em **Confirmar linha**. Esc limpa a seleção. Há uma dica opcional em cada desafio.
6. **Feedback:** "Correto." ou "Incorreto.", com check e "Erro aqui" na linha certa, x e "Sua seleção" na linha escolhida, o tipo do erro, a explicação e a correção em formato diff. O cronômetro **para** até o jogador tocar em **Próximo desafio**.
7. **Fim:** pontuação, acertos, erros, posição no ranking, aviso de novo recorde e os botões **Jogar novamente**, **Ver ranking** e **Início**.
8. **Ranking:** os 10 melhores em tabela, com o recorde marcado em texto. Essa tela **não** volta sozinha ao início, para poder ficar exibida no tablet.
9. **Inatividade:** 30 s sem toques no jogo ou no fim levam ao início (partida abandonada não entra no ranking). Na tela inicial, um apelido esquecido é apagado.
10. **Administrador:** segure a marca do cabeçalho por 2 s na tela inicial, digite o PIN (padrão `2580`) e use **Exportar ranking (CSV)** ou **Zerar ranking** (pede um segundo toque para confirmar).

Sons curtos são gerados por código (Web Audio), sem arquivos. Para desligar: `sons: false` em `config.js`.

## Onde editar

| O que mudar | Arquivo |
|---|---|
| Trechos de código, linha do erro, explicação, tipo, dica e correção | `www/src/dados/trechos.js` |
| Duração, pontuação, PIN, inatividade, sons | `www/src/config.js` |
| Cores (inclusive realce de sintaxe), fontes e espaçamento | `../compartilhado/tokens.css`, ver `../DESIGN.md` |
| Logo | `www/index.html` (comentário "MARCA") |

**Troque o PIN antes do evento.** Ele é só uma trava contra curiosos: quem abrir o código-fonte do app consegue lê-lo.

Depois de editar os trechos, rode `npm test`: ele confere se cada trecho tem de 3 a 6 linhas, se a linha do erro existe e se há 5 trechos por nível.

> Python não usa ponto e vírgula, então o bug "pontuação esquecida" aparece como **dois-pontos faltando** no `if`. Os outros tipos pedidos estão lá: variável escrita errada, condição invertida, aspas não fechadas e índice errado, além de parêntese aberto, recuo, `=` no lugar de `==`, `range` e laço infinito.

## Organização do código

```
www/
  index.html                  só a estrutura das telas (sem lógica)
  css/app.css                 layout e componentes (só tokens)
  compartilhado/              GERADO por `npm run preparar` (não edite aqui)
  src/
    main.js                   raiz de composição: cria serviços e telas
    config.js                 ajustes gerais
    dados/trechos.js          os 15 trechos (conteúdo editável)
    dominio/                  regras puras, testadas
      partida.js              fila, tempo, pontuação, acerto e erro
      ranking.js              ordenação, posição, recorde, CSV
      apelido.js              limpeza do apelido
      sintaxe.js              divide a linha de Python para o destaque
    aplicacao/
      servico-ranking.js      casos de uso: registrar partida, top 10, zerar, exportar
    infra/
      repositorio-ranking.js  leitura e gravação no localStorage
      arquivos.js             salva o CSV (APK: Documentos; navegador: download)
    ui/                       telas, área do administrador, sons, realce de sintaxe
testes/                       testes das regras (node --test)
android-personalizado/        MainActivity.java com o modo imersivo
```

## Testar no navegador

```bash
npm install
```

```bash
npm run servir
```

Abra `http://localhost:8081`. Para simular o tablet, aperte F12 e use o modo de dispositivo (ícone de celular), testando em retrato e paisagem. Para abrir no tablet sem gerar APK, acesse `http://IP-DO-COMPUTADOR:8081` pelo Chrome dele, na mesma rede Wi-Fi.

Testes automáticos das regras:

```bash
npm test
```

## Gerar o APK com Capacitor

**Pré-requisitos:** Node.js 20+, [Android Studio](https://developer.android.com/studio) com o Android SDK instalado (o JDK necessário já vem junto).

1. Instale as dependências (Capacitor, plataforma Android e os plugins de barra de status e de arquivos):

   ```bash
   npm install
   ```

2. Copie o núcleo compartilhado para `www/`:

   ```bash
   npm run preparar
   ```

3. Crie o projeto Android (só na primeira vez):

   ```bash
   npx cap add android
   ```

4. Ative o modo imersivo: copie `android-personalizado/MainActivity.java` por cima de
   `android/app/src/main/java/br/edu/ifba/si/corridabug/MainActivity.java`.

5. Sincronize o código web com o projeto Android (rode de novo sempre que mudar algo em `www/` ou `compartilhado/`):

   ```bash
   npm run android
   ```

6. Gere o APK pela linha de comando:

   ```bash
   cd android && gradlew.bat assembleDebug
   ```

   (no Linux ou macOS: `./gradlew assembleDebug`). O arquivo fica em `android/app/build/outputs/apk/debug/app-debug.apk`. Pelo Android Studio (`npm run abrir-android`): *Build > Build App Bundle(s) / APK(s) > Build APK(s)*.

7. Instale no tablet copiando o APK para ele, ou com depuração USB:

   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Exportar o ranking no APK

No APK, **Exportar ranking** grava o CSV na pasta **Documentos** do tablet pelo plugin `@capacitor/filesystem`. Em algumas versões do Android a gravação em Documentos pode ser negada. Por isso o painel sempre mostra o conteúdo do CSV em uma caixa de texto, para copiar e colar em outro lugar.

O ranking fica no `localStorage` do app: sobrevive a fechar e abrir o app, mas é apagado se o app for desinstalado ou se os dados dele forem limpos. Exporte antes de reinstalar.

## Tela cheia, barras do sistema e áreas seguras

São três camadas trabalhando juntas:

1. **Áreas seguras no CSS** (`compartilhado/base.css`). A meta viewport usa `viewport-fit=cover` e o contêiner `.app` (e as janelas do administrador) somam `env(safe-area-inset-top/right/bottom/left)` às margens, para nada ficar atrás das barras ou do recorte da câmera.
2. **Barra de status** pelo plugin `@capacitor/status-bar`: `compartilhado/plataforma.js` chama `StatusBar.setOverlaysWebView({ overlay: true })` e `StatusBar.hide()` ao abrir o app e ao tocar em Jogar.
3. **Barra de navegação** pelo código nativo em `android-personalizado/MainActivity.java`, que usa `WindowInsetsControllerCompat` para esconder as barras do sistema (modo imersivo). Ao deslizar da borda, elas aparecem por alguns segundos e somem sozinhas. O mesmo arquivo mantém a tela sempre ligada.

Opcional, para aparelhos com recorte de câmera: em `android/app/src/main/res/values/styles.xml`, nos temas `AppTheme.NoActionBar` e `AppTheme.NoActionBarLaunch`, adicione:

```xml
<item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
```

No navegador (sem APK), o botão Jogar pede tela cheia pela API do próprio navegador (`telaCheiaNoNavegador` em `config.js`).
