import { referencias } from "../../compartilhado/dom.js";

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Limpar", "0", "OK"];

/** Data e hora local no formato 2026-10-20-14-35, para o nome do arquivo. */
function carimboLocal(data) {
  const dois = (n) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}-${dois(data.getHours())}-${dois(data.getMinutes())}`;
}

/**
 * Área oculta do administrador.
 * Toque longo no `gatilho` (a marca no cabeçalho) -> teclado de PIN -> painel com
 * "Exportar ranking" e "Zerar ranking".
 */
export function criarAdmin({ gatilho, caixaPin, caixaPainel, config, podeAbrir, servicoRanking, salvarArquivo, sons, aoAlterarRanking }) {
  const pin = referencias(caixaPin);
  const painel = referencias(caixaPainel);
  let temporizador = null;
  let digitado = "";
  let confirmandoZerar = false;

  /* ---------- Toque longo no logo ---------- */
  function iniciarToqueLongo() {
    if (!podeAbrir()) return;
    temporizador = setTimeout(abrirPin, config.segundosToqueLongo * 1000);
  }

  function cancelarToqueLongo() {
    clearTimeout(temporizador);
  }

  gatilho.addEventListener("pointerdown", iniciarToqueLongo);
  ["pointerup", "pointerleave", "pointercancel"].forEach((evento) => gatilho.addEventListener(evento, cancelarToqueLongo));

  /* ---------- PIN ---------- */
  pin.teclado.replaceChildren(
    ...TECLAS.map((tecla) => {
      const botao = document.createElement("button");
      botao.className = "botao";
      botao.textContent = tecla;
      botao.addEventListener("click", () => pressionar(tecla));
      return botao;
    })
  );
  pin.cancelar.addEventListener("click", fechar);

  /** Mostra o PIN como "* * _ _" (digitados e faltantes), sem revelar os números. */
  function desenharPin() {
    pin.pontos.textContent = Array.from(config.pinAdmin, (_, i) => (i < digitado.length ? "*" : "_")).join(" ");
    pin.pontos.setAttribute("aria-label", `${digitado.length} de ${config.pinAdmin.length} dígitos`);
  }

  function abrirPin() {
    digitado = "";
    pin.erro.textContent = "";
    desenharPin();
    caixaPin.hidden = false;
    pin.teclado.querySelector("button").focus();
  }

  function pressionar(tecla) {
    if (tecla === "Limpar") digitado = "";
    else if (tecla === "OK") return conferirPin();
    else if (digitado.length < config.pinAdmin.length) digitado += tecla;
    desenharPin();
    if (digitado.length === config.pinAdmin.length) conferirPin();
  }

  function conferirPin() {
    if (digitado === config.pinAdmin) {
      caixaPin.hidden = true;
      abrirPainel();
      return;
    }
    sons.erro();
    pin.erro.textContent = "PIN incorreto.";
    digitado = "";
    desenharPin();
  }

  /* ---------- Painel ---------- */
  function atualizarInfo() {
    painel.info.textContent = `${servicoRanking.quantidade()} partida(s) registrada(s) neste aparelho.`;
  }

  function abrirPainel() {
    confirmandoZerar = false;
    painel.zerar.textContent = "Zerar ranking";
    painel.mensagem.textContent = "";
    painel.csv.hidden = true;
    atualizarInfo();
    caixaPainel.hidden = false;
    painel.exportar.focus();
  }

  async function exportar() {
    const conteudo = servicoRanking.exportarCsv();
    const carimbo = carimboLocal(new Date());
    // sempre mostra o texto, para copiar à mão se salvar o arquivo falhar
    painel.csv.value = conteudo;
    painel.csv.hidden = false;
    const resultado = await salvarArquivo({ nome: `ranking-corrida-contra-o-bug-${carimbo}.csv`, conteudo });
    painel.mensagem.textContent = resultado.mensagem;
  }

  function zerar() {
    // pede um segundo toque para confirmar
    if (!confirmandoZerar) {
      confirmandoZerar = true;
      painel.zerar.textContent = "Confirmar: apagar todo o ranking";
      return;
    }
    confirmandoZerar = false;
    painel.zerar.textContent = "Zerar ranking";
    painel.mensagem.textContent = servicoRanking.zerar() ? "Ranking zerado." : "Não foi possível zerar o ranking.";
    painel.csv.hidden = true;
    atualizarInfo();
    aoAlterarRanking();
  }

  painel.exportar.addEventListener("click", exportar);
  painel.zerar.addEventListener("click", zerar);
  painel.fechar.addEventListener("click", fechar);

  function fechar() {
    cancelarToqueLongo();
    caixaPin.hidden = true;
    caixaPainel.hidden = true;
  }

  return {
    fechar,
    estaAberto: () => !caixaPin.hidden || !caixaPainel.hidden
  };
}
