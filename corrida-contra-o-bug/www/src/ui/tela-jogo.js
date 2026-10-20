import { referencias, criarAgendador } from "../../compartilhado/dom.js";
import { mmss } from "../../compartilhado/formato.js";
import { ICONES, rotuloComIcone } from "../../compartilhado/icones.js";
import { linhaDestacada } from "./destaque.js";

const MS_ENTRE_TIQUES = 100;
// Maior salto aceito entre dois tiques. Se o app for para segundo plano,
// a partida perde no máximo isso, em vez de perder o tempo todo que ficou fora.
const MAIOR_SALTO_SEGUNDOS = 1;
const SEGUNDOS_AVISO_TEMPO = 10;
const LINGUAGEM = "Python";

/**
 * Tela do jogo: selecionar a linha com erro, confirmar e ver a correção.
 * As regras (pontos, tempo, fila) ficam em PartidaBug; aqui só se desenha
 * e se repassam o tempo e a resposta para ela.
 *
 * Teclado: setas movem a seleção, Enter confirma (ou avança), Esc limpa.
 */
export function criarTelaJogo({ elemento, config, sons, aoTerminar }) {
  const ref = referencias(elemento);
  const agenda = criarAgendador();
  let partida = null;
  let relogio = null;
  let ultimoTique = 0;
  let totalDesafios = 0;
  let selecionada = null;  // índice da linha escolhida, ainda não confirmada

  function entrar({ partida: novaPartida }) {
    partida = novaPartida;
    totalDesafios = partida.fila.length;
    ref.apelido.textContent = partida.apelido;
    ref.pontos.textContent = "0";
    ref.tempoAviso.textContent = "";
    document.addEventListener("keydown", aoTeclar);
    proximoTrecho();
    ultimoTique = performance.now();
    atualizarRelogio();
    relogio = setInterval(tique, MS_ENTRE_TIQUES);
  }

  function sair() {
    clearInterval(relogio);
    agenda.cancelarTudo();
    document.removeEventListener("keydown", aoTeclar);
    partida = null; // partida abandonada não é salva
  }

  function finalizar() {
    const terminada = partida;
    sair();
    aoTerminar(terminada);
  }

  /* ---------- Relógio: mede o tempo real decorrido, não a quantidade de tiques ---------- */
  function tique() {
    if (!partida) return;
    const agora = performance.now();
    const segundos = Math.min((agora - ultimoTique) / 1000, MAIOR_SALTO_SEGUNDOS);
    ultimoTique = agora;

    partida.avancarTempo(segundos);
    atualizarRelogio();
    if (partida.encerrada) finalizar();
  }

  function atualizarRelogio() {
    const restante = partida.restante;
    ref.tempo.textContent = mmss(restante);
    ref.barraTempo.style.transform = `scaleX(${restante / config.duracaoRodada})`;
    if (restante <= SEGUNDOS_AVISO_TEMPO && !ref.tempoAviso.textContent) {
      ref.tempoAviso.textContent = "Tempo quase esgotado.";
    }
    if (!partida.aguardandoProximo) atualizarContador();
  }

  function atualizarContador() {
    const nivel = config.nomesNiveis[partida.trecho.nivel] || partida.trecho.nivel;
    ref.contador.textContent = `Desafio ${partida.numero} de ${totalDesafios} · ${nivel.toLowerCase()} · vale ${partida.valorAtual}`;
  }

  /* ---------- Desafios ---------- */
  function proximoTrecho() {
    if (!partida) return;
    agenda.cancelarTudo();
    const trecho = partida.proximoTrecho();
    if (!trecho) {
      finalizar(); // acabaram os trechos antes do tempo
      return;
    }
    desenharTrecho(trecho);
  }

  function linhas() {
    return [...ref.codigo.children];
  }

  function desenharTrecho(trecho) {
    ref.arquivo.textContent = `bug_${String(partida.numero).padStart(2, "0")}.py`;
    ref.codigo.removeAttribute("aria-disabled");
    ref.codigo.replaceChildren(...trecho.linhas.map(criarLinha));

    selecionada = null;
    atualizarSelecao();
    atualizarContador();

    ref.blocoDica.hidden = !trecho.dica;
    ref.dica.textContent = trecho.dica ? `Dica: ${trecho.dica}` : "";
    ref.dica.hidden = true;
    ref.mostrarDica.hidden = false;

    ref.feedback.hidden = true;
    ref.acoes.hidden = false;
    ref.teclado.hidden = false;
    ref.codigo.focus({ preventScroll: true });
  }

  function criarLinha(texto, i) {
    const linha = document.createElement("div");
    linha.className = "linha";
    linha.id = `linha-${i + 1}`;
    linha.setAttribute("role", "option");
    linha.setAttribute("aria-selected", "false");

    const simbolo = document.createElement("span");
    simbolo.className = "simbolo";
    const numero = document.createElement("span");
    numero.className = "num";
    numero.textContent = i + 1;
    const codigo = document.createElement("code");
    codigo.appendChild(linhaDestacada(texto));
    const nota = document.createElement("span");
    nota.className = "nota";

    linha.append(simbolo, numero, codigo, nota);
    linha.addEventListener("click", () => {
      selecionar(i);
      ref.codigo.focus({ preventScroll: true });
    });
    return linha;
  }

  /* ---------- Seleção ---------- */
  function podeSelecionar() {
    return Boolean(partida) && !partida.aguardandoProximo;
  }

  function selecionar(indice) {
    if (!podeSelecionar()) return;
    selecionada = indice;
    atualizarSelecao();
  }

  function limparSelecao() {
    if (!podeSelecionar()) return;
    selecionada = null;
    atualizarSelecao();
  }

  function atualizarSelecao() {
    linhas().forEach((linha, i) => {
      const ativa = i === selecionada;
      linha.classList.toggle("selecionada", ativa);
      linha.setAttribute("aria-selected", String(ativa));
      if (ativa) linha.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    if (selecionada === null) ref.codigo.removeAttribute("aria-activedescendant");
    else ref.codigo.setAttribute("aria-activedescendant", `linha-${selecionada + 1}`);

    ref.confirmar.disabled = selecionada === null;
    ref.status.textContent = selecionada === null
      ? `Nenhuma linha selecionada · ${LINGUAGEM}`
      : `Linha ${selecionada + 1} selecionada · ${LINGUAGEM}`;
  }

  /* ---------- Confirmação e feedback ---------- */
  function confirmar() {
    if (!podeSelecionar() || selecionada === null) return;
    const trecho = partida.trecho;
    const resposta = partida.responder(selecionada);
    if (!resposta) return;

    const { acertou, delta, indiceCerto, explicacao } = resposta;
    if (acertou) sons.acerto();
    else sons.erro();

    marcarLinhas(acertou, indiceCerto);
    ref.pontos.textContent = partida.pontos;
    mostrarFeedback({ trecho, acertou, delta, linhaCerta: indiceCerto + 1, explicacao });

    if (config.segundosFeedback > 0) agenda.depois(config.segundosFeedback * 1000, proximoTrecho);
  }

  function marcarLinhas(acertou, indiceCerto) {
    ref.codigo.setAttribute("aria-disabled", "true");
    const todas = linhas();

    const certa = todas[indiceCerto];
    certa.classList.add("certa");
    certa.querySelector(".simbolo").innerHTML = ICONES.certo;
    certa.querySelector(".nota").textContent = acertou ? "Erro aqui · sua seleção" : "Erro aqui";

    if (!acertou) {
      const errada = todas[selecionada];
      errada.classList.add("errada");
      errada.querySelector(".simbolo").innerHTML = ICONES.errado;
      errada.querySelector(".nota").textContent = "Sua seleção";
    }
  }

  function mostrarFeedback({ trecho, acertou, delta, linhaCerta, explicacao }) {
    const titulo = acertou ? "Correto." : `Incorreto. O erro está na linha ${linhaCerta}.`;
    const rotulo = rotuloComIcone(acertou ? "certo" : "errado", titulo);
    rotulo.className = acertou ? "correto" : "incorreto";
    ref.feedbackTitulo.replaceChildren(rotulo);

    ref.feedbackPontos.textContent = `${delta > 0 ? "+" : ""}${delta} pontos · total ${partida.pontos}`;
    ref.feedbackTipo.textContent = trecho.tipo ? `Tipo: ${trecho.tipo}` : "";
    ref.feedbackTexto.textContent = explicacao;
    ref.diff.replaceChildren(...(trecho.correcao ? criarDiff(linhaCerta, trecho.linhas[linhaCerta - 1], trecho.correcao) : []));

    ref.acoes.hidden = true;
    ref.teclado.hidden = true;
    ref.blocoDica.hidden = true;
    ref.feedback.hidden = false;
    ref.proxima.focus();
  }

  function criarDiff(numero, antes, depois) {
    return [
      linhaDiff("diff-removida", "-", numero, antes, "removida"),
      linhaDiff("diff-adicionada", "+", numero, depois, "adicionada")
    ];
  }

  function linhaDiff(classe, sinal, numero, texto, descricao) {
    const linha = document.createElement("div");
    linha.className = `diff-linha ${classe}`;
    linha.setAttribute("aria-label", `Linha ${numero} ${descricao}: ${texto.trim()}`);
    const simbolo = document.createElement("span");
    simbolo.className = "sinal";
    simbolo.textContent = sinal;
    const num = document.createElement("span");
    num.className = "num";
    num.textContent = numero;
    const codigo = document.createElement("code");
    codigo.textContent = texto;
    linha.append(simbolo, num, codigo);
    return linha;
  }

  /* ---------- Teclado ---------- */
  function aoTeclar(evento) {
    if (!partida) return;
    const alvo = evento.target.tagName;
    if (alvo === "INPUT" || alvo === "TEXTAREA") return;

    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      if (!podeSelecionar()) return;
      evento.preventDefault();
      const total = linhas().length;
      const passo = evento.key === "ArrowDown" ? 1 : -1;
      const proxima = selecionada === null
        ? (passo === 1 ? 0 : total - 1)
        : Math.min(total - 1, Math.max(0, selecionada + passo));
      selecionar(proxima);
    } else if (evento.key === "Enter") {
      if (alvo === "BUTTON") return; // o botão já trata o Enter
      evento.preventDefault();
      if (partida.aguardandoProximo) proximoTrecho();
      else confirmar();
    } else if (evento.key === "Escape") {
      limparSelecao();
    }
  }

  ref.confirmar.addEventListener("click", confirmar);
  ref.proxima.addEventListener("click", proximoTrecho);
  ref.mostrarDica.addEventListener("click", () => {
    ref.dica.hidden = false;
    ref.mostrarDica.hidden = true;
  });

  return { elemento, entrar, sair };
}
