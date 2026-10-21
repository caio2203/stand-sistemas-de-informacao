# Quiz: Qual área da tecnologia combina com você?

Quiz de 7 perguntas leves, do dia a dia, que mostra com qual área da tecnologia a pessoa mais se identifica: **UI/UX Design, Front-end, Back-end, Infraestrutura e Redes, Ciência de Dados ou Segurança da Informação**.

![Resultado: gráfico de radar com o nível e os pontos de cada área](../docs/capturas/quiz-7-resultado-1280.png)

APK pronto: [quiz-perfil-profissional.apk](https://github.com/caio2203/stand-sistemas-de-informacao/releases/latest/download/quiz-perfil-profissional.apk) (versões anteriores em [Releases](https://github.com/caio2203/stand-sistemas-de-informacao/releases)).

## Como funciona

1. Tela inicial com a descrição, a escolha do tempo (15 s por questão ou sem tempo) e o botão **Iniciar**.
2. 7 perguntas com 4 alternativas. Cada alternativa soma pontos para uma ou mais áreas.
3. Escolher a alternativa (toque, A a D ou 1 a 4) e tocar em **Confirmar resposta**. Abaixo aparece para quais áreas a resposta somou pontos, e **Próxima questão** segue.
4. Resultado: a área, a descrição, um resumo em números, 3 coisas estudadas no curso, um gráfico de radar com o nível (A a E) e os pontos de cada área, e as funções comuns na área. A área com mais pontos fica no nível A; as outras, proporcionalmente, até E (nenhum ponto).
5. **Jogar novamente** ou volta automática ao início após 30 s sem toques.

**Garantia dos 2 minutos:** com tempo (padrão), cada pergunta tem no máximo 15 s, com aviso em texto nos últimos 5 s; se o tempo acabar, ela é pulada sem pontos. A opção "Sem tempo" existe para quem preferir, e a inatividade de 30 s continua valendo. Em empate no primeiro lugar, a área é sorteada entre as empatadas.

## Onde editar

| O que mudar | Arquivo |
|---|---|
| Perguntas, alternativas e pontuações | `www/src/dados/perguntas.js` |
| Nome, descrição, estudos e funções de cada área | `www/src/dados/areas.js` |
| Tempo por pergunta, aviso de tempo, inatividade | `www/src/config.js` |
| Cores, fontes e espaçamento (os dois jogos) | `../compartilhado/tokens.css`, ver `../DESIGN.md` |
| Logo | `www/index.html` (comentário "MARCA") |

Depois de editar o conteúdo, rode `npm test`: ele avisa se alguma alternativa usa uma área que não existe ou se alguma área nunca recebe pontos.

> Os itens de "estudos" de cada área foram escritos de forma genérica. Confira com a matriz curricular do curso no IFBA e ajuste os nomes das disciplinas.

## Organização do código

```
www/
  index.html            só a estrutura das telas (sem lógica)
  css/app.css           layout e componentes do quiz (só tokens)
  compartilhado/        GERADO por `npm run preparar` (não edite aqui)
  src/
    main.js             raiz de composição: monta as telas e liga tudo
    config.js           ajustes gerais
    dados/              conteúdo editável (áreas e perguntas)
    dominio/quiz.js     regras: pontuação, resultado, nível A a E, validação do conteúdo
    ui/                 telas (início, pergunta, resultado)
testes/quiz.test.js     testes das regras (node --test)
android-personalizado/  MainActivity.java com o modo imersivo
```

## Testar no navegador

```bash
npm install
```

```bash
npm run servir
```

Abra `http://localhost:8080`. Para simular o tablet, aperte F12 e use o modo de dispositivo (ícone de celular), testando em retrato e paisagem.

Para abrir no próprio tablet sem gerar APK: com o computador e o tablet na mesma rede Wi-Fi, acesse `http://IP-DO-COMPUTADOR:8080` no Chrome do tablet.

Testes automáticos das regras:

```bash
npm test
```

## Gerar o APK com Capacitor

**Pré-requisitos:** Node.js 20+ e [Android Studio](https://developer.android.com/studio) com o Android SDK instalado (o JDK certo já vem junto).

Sem o Android Studio, pela linha de comando: Android SDK com a variável `ANDROID_HOME` apontando para ele e **JDK 21** em `JAVA_HOME`. O Gradle 8.11 usado pelo Capacitor 7 não roda no Java 25.

1. Instale as dependências (Capacitor, plataforma Android e plugin de barra de status):

   ```bash
   npm install
   ```

2. Copie o núcleo compartilhado para `www/`:

   ```bash
   npm run preparar
   ```

3. Crie o projeto Android (só na primeira vez; a pasta `android/` é gerada e fica fora do git):

   ```bash
   npx cap add android
   ```

4. Ative o modo imersivo: copie `android-personalizado/MainActivity.java` por cima de
   `android/app/src/main/java/br/edu/ifba/si/quiz/MainActivity.java`.

5. Sincronize o código web com o projeto Android (rode de novo sempre que mudar algo em `www/` ou `compartilhado/`):

   ```bash
   npm run android
   ```

6. Gere o APK. Pela linha de comando:

   ```bash
   cd android && gradlew.bat assembleDebug
   ```

   (no Linux ou macOS: `./gradlew assembleDebug`). O arquivo fica em `android/app/build/outputs/apk/debug/app-debug.apk`.

   Ou pelo Android Studio (`npm run abrir-android`): menu *Build > Build App Bundle(s) / APK(s) > Build APK(s)*.

7. Instale no tablet: copie o APK para ele e abra o arquivo (permita "instalar apps desconhecidos"), ou, com depuração USB ativada:

   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

O APK de debug serve bem para o stand. Para publicar na Play Store seria preciso um APK/AAB assinado em modo release.

## Tela cheia, barras do sistema e áreas seguras

São três camadas trabalhando juntas:

1. **Áreas seguras no CSS** (`compartilhado/base.css`). A meta viewport usa `viewport-fit=cover` e o contêiner `.app` soma `env(safe-area-inset-top/right/bottom/left)` às margens. Assim, mesmo quando as barras ou o recorte da câmera aparecem, nada fica escondido atrás deles.
2. **Barra de status** pelo plugin `@capacitor/status-bar`. Em `compartilhado/plataforma.js`, ao abrir o app e ao tocar em Iniciar, o jogo chama `StatusBar.setOverlaysWebView({ overlay: true })` e `StatusBar.hide()`. O `capacitor.config.json` também liga `overlaysWebView`.
3. **Barra de navegação** pelo código nativo em `android-personalizado/MainActivity.java`, que usa `WindowInsetsControllerCompat` para esconder as barras do sistema (modo imersivo). Se a pessoa deslizar da borda, as barras aparecem por alguns segundos e somem sozinhas. O mesmo arquivo mantém a tela sempre ligada.

Opcional, para aparelhos com recorte de câmera: em `android/app/src/main/res/values/styles.xml`, dentro dos temas `AppTheme.NoActionBar` e `AppTheme.NoActionBarLaunch`, adicione:

```xml
<item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
```

O conteúdo passa a ocupar também a faixa do recorte, e as áreas seguras do CSS mantêm os elementos fora dele.

No navegador (sem APK), o botão Iniciar pede tela cheia pela API do próprio navegador. Isso pode ser desligado em `config.js` (`telaCheiaNoNavegador`).
