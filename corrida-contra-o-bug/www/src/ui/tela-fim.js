import { referencias } from "../../compartilhado/dom.js";

/**
 * Tela de fim de partida: resumo em números e posição no ranking.
 */
export function criarTelaFim({ elemento, config, aoJogarNovamente, aoVerRanking, aoInicio }) {
  const ref = referencias(elemento);

  ref.jogarNovamente.addEventListener("click", aoJogarNovamente);
  ref.verRanking.addEventListener("click", aoVerRanking);
  ref.inicio.addEventListener("click", aoInicio);

  function entrar({ partida, registro }) {
    const respondidos = partida.acertos + partida.erros;
    ref.titulo.textContent = partida.motivo === "zerou"
      ? "Partida encerrada: todos os desafios concluídos."
      : "Partida encerrada: tempo esgotado.";
    ref.pontos.textContent = partida.pontos;
    ref.acertos.textContent = `${partida.acertos} de ${respondidos}`;
    ref.erros.textContent = partida.erros;
    ref.posicao.textContent = registro.posicao ? `${registro.posicao} de ${registro.total}` : "fora do ranking";
    ref.recorde.hidden = !registro.recorde;

    mostrarContagem(config.segundosInatividade);
    ref.jogarNovamente.focus();
  }

  /** Atualiza o aviso "Volta ao início em X s sem interação." */
  function mostrarContagem(segundos) {
    ref.contagem.textContent = `Volta ao início em ${segundos} s sem interação.`;
  }

  return { elemento, entrar, mostrarContagem };
}
