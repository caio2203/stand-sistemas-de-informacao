import { referencias } from "../../compartilhado/dom.js";
import { mmss } from "../../compartilhado/formato.js";

const LETRAS = "abcd";
const NUMEROS = "1234";

/**
 * Tela de questão: escolher alternativa, confirmar, ver para quais áreas
 * a resposta somou pontos e seguir. As regras ficam em PartidaQuiz (domínio).
 *
 * Teclado: A a D ou 1 a 4 escolhem, setas trocam (rádio nativo), Enter confirma ou avança.
 */
export function criarTelaPergunta({ elemento, areas, config, aoTerminar }) {
  const ref = referencias(elemento);
  let partida = null;
  let comTempo = true;
  let selecionada = null;  // índice da alternativa escolhida, ainda não confirmada
  let respondida = false;  // true depois de confirmar ou de esgotar o tempo
  let relogio = null;
  let fimDoTempo = 0;
  let inicioPartida = 0;
  let respondidas = 0;

  function entrar({ partida: novaPartida, comTempo: usarTempo }) {
    partida = novaPartida;
    comTempo = usarTempo;
    inicioPartida = Date.now();
    respondidas = 0;
    ref.tempo.hidden = !comTempo;
    ref.tempoTrilho.hidden = !comTempo;
    document.addEventListener("keydown", aoTeclar);
    desenhar();
  }

  function sair() {
    clearInterval(relogio);
    document.removeEventListener("keydown", aoTeclar);
    partida = null;
  }

  function entradas() {
    return [...ref.opcoes.querySelectorAll("input")];
  }

  function desenhar() {
    const pergunta = partida.perguntaAtual;
    ref.progressoTexto.textContent = `Questão ${partida.indice + 1} de ${partida.total}`;
    ref.progressoBarra.style.width = `${(partida.indice / partida.total) * 100}%`;
    ref.texto.textContent = pergunta.texto;

    selecionada = null;
    respondida = false;
    ref.opcoes.removeAttribute("aria-disabled");
    ref.opcoes.replaceChildren(...pergunta.alternativas.map(criarAlternativa));

    ref.feedback.hidden = true;
    ref.acoesConfirmar.hidden = false;
    ref.tempoAviso.textContent = "";
    atualizarSelecao();
    iniciarRelogio();
    // foco na questão (sem contorno), para o leitor de tela anunciar o enunciado;
    // focar a alternativa A pareceria uma seleção já feita
    ref.questao.focus({ preventScroll: true });
  }

  function criarAlternativa(alternativa, i) {
    const rotulo = document.createElement("label");
    rotulo.className = "alternativa";

    const entrada = document.createElement("input");
    entrada.type = "radio";
    entrada.name = "alternativa";
    entrada.value = String(i);
    entrada.addEventListener("change", () => selecionar(i));

    const letra = document.createElement("span");
    letra.className = "letra";
    letra.textContent = LETRAS[i].toUpperCase();

    const texto = document.createElement("span");
    texto.className = "texto";
    texto.textContent = alternativa.texto;

    const marcador = document.createElement("span");
    marcador.className = "marcador";

    rotulo.append(entrada, letra, texto, marcador);
    return rotulo;
  }

  /* ---------- Seleção e confirmação ---------- */
  function selecionar(indice) {
    if (respondida) return;
    selecionada = indice;
    entradas()[indice].checked = true;
    atualizarSelecao();
  }

  function atualizarSelecao() {
    ref.confirmar.disabled = selecionada === null;
    ref.estadoSelecao.textContent = selecionada === null
      ? "Nenhuma alternativa selecionada."
      : `Alternativa ${LETRAS[selecionada].toUpperCase()} selecionada.`;
  }

  function confirmar() {
    if (respondida || selecionada === null) return;
    const alternativa = partida.perguntaAtual.alternativas[selecionada];
    partida.responder(selecionada);
    respondidas++;
    bloquear();
    entradas()[selecionada].closest(".alternativa").querySelector(".marcador").textContent = "Sua resposta";

    const somas = Object.entries(alternativa.pontos || {})
      .filter(([, valor]) => valor > 0)
      .map(([chave, valor]) => `${areas[chave] ? areas[chave].nome : chave} (+${valor})`);
    mostrarFeedback("Resposta registrada.", `Somou pontos para: ${somas.join(", ")}.`);
  }

  function tempoEsgotado() {
    if (respondida) return;
    partida.pular();
    bloquear();
    mostrarFeedback("Tempo esgotado.", "Questão sem resposta. Nenhum ponto foi somado.");
  }

  function bloquear() {
    respondida = true;
    clearInterval(relogio);
    ref.opcoes.setAttribute("aria-disabled", "true");
    entradas().forEach((entrada) => { entrada.disabled = true; });
    ref.acoesConfirmar.hidden = true;
    ref.tempoAviso.textContent = "";
  }

  function mostrarFeedback(titulo, texto) {
    ref.feedbackTitulo.textContent = titulo;
    ref.feedbackTexto.textContent = texto;
    ref.proxima.textContent = partida.terminou ? "Ver resultado" : "Próxima questão";
    ref.feedback.hidden = false;
    ref.proxima.focus();
  }

  function avancar() {
    if (!respondida) return;
    if (partida.terminou) {
      ref.progressoBarra.style.width = "100%";
      const segundos = Math.round((Date.now() - inicioPartida) / 1000);
      aoTerminar(partida, { respondidas, total: partida.total, segundos });
      return;
    }
    desenhar();
  }

  /* ---------- Tempo (opcional) ---------- */
  function iniciarRelogio() {
    clearInterval(relogio);
    if (!comTempo) return;
    fimDoTempo = Date.now() + config.segundosPorPergunta * 1000;
    atualizarRelogio();
    relogio = setInterval(atualizarRelogio, 250);
  }

  function atualizarRelogio() {
    const ms = Math.max(0, fimDoTempo - Date.now());
    ref.tempo.textContent = mmss(ms / 1000);
    ref.tempoBarra.style.transform = `scaleX(${ms / (config.segundosPorPergunta * 1000)})`;
    if (ms <= config.segundosAvisoTempo * 1000 && !ref.tempoAviso.textContent) {
      ref.tempoAviso.textContent = "Tempo quase esgotado.";
    }
    if (ms <= 0) tempoEsgotado();
  }

  /* ---------- Teclado ---------- */
  function aoTeclar(evento) {
    if (!partida) return;
    if (evento.key === "Enter") {
      if (evento.target.tagName === "BUTTON") return; // o botão já trata o Enter
      evento.preventDefault();
      if (respondida) avancar();
      else confirmar();
      return;
    }
    const tecla = evento.key.toLowerCase();
    let indice = LETRAS.indexOf(tecla);
    if (indice < 0) indice = NUMEROS.indexOf(tecla);
    const total = partida.perguntaAtual ? partida.perguntaAtual.alternativas.length : 0;
    if (indice >= 0 && indice < total && !respondida) {
      selecionar(indice);
      entradas()[indice].focus();
    }
  }

  ref.confirmar.addEventListener("click", confirmar);
  ref.proxima.addEventListener("click", avancar);

  return { elemento, entrar, sair };
}
