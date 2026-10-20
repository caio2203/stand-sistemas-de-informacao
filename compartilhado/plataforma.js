/**
 * Integração com a plataforma: navegador comum ou APK do Capacitor.
 * Nenhum outro módulo deve acessar window.Capacitor diretamente.
 */

export function ehAppNativo() {
  const cap = window.Capacitor;
  return Boolean(cap && cap.isNativePlatform && cap.isNativePlatform());
}

/** Devolve um plugin nativo do Capacitor (ex.: "StatusBar") ou undefined. */
export function pluginNativo(nome) {
  return ehAppNativo() && window.Capacitor.Plugins ? window.Capacitor.Plugins[nome] : undefined;
}

/**
 * Esconde as barras do sistema.
 * - No APK: usa o plugin @capacitor/status-bar (barra de status). A barra de
 *   navegação é escondida pelo código nativo em android-personalizado/MainActivity.java.
 * - No navegador: usa a API de tela cheia (só funciona logo após um toque).
 */
export function esconderBarrasDoSistema({ telaCheiaNoNavegador = true } = {}) {
  if (ehAppNativo()) {
    const barra = pluginNativo("StatusBar");
    if (barra) {
      barra.setOverlaysWebView({ overlay: true }).catch(() => {});
      barra.hide().catch(() => {});
    }
    return;
  }
  const raiz = document.documentElement;
  if (telaCheiaNoNavegador && !document.fullscreenElement && raiz.requestFullscreen) {
    raiz.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
  }
}

/** Impede o menu de contexto do toque longo (evita "copiar/salvar imagem" no stand). */
export function bloquearMenuDeContexto() {
  document.addEventListener("contextmenu", (evento) => evento.preventDefault());
}
