import { criarSintetizador } from "../../compartilhado/sintetizador.js";

/**
 * Efeitos sonoros do jogo. Cada nota: [frequência Hz, início s, duração s].
 */
export function criarSons({ ativo }) {
  const sintetizador = criarSintetizador({ ativo });
  return {
    clique: () => sintetizador.tocar([[880, 0, 0.05]]),
    acerto: () => sintetizador.tocar([[660, 0, 0.09], [990, 0.09, 0.16]]),
    erro: () => sintetizador.tocar([[200, 0, 0.12], [150, 0.12, 0.22]], "sawtooth"),
    fim: () => sintetizador.tocar([[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.3]])
  };
}
