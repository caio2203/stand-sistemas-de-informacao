/**
 * Ajustes gerais do "Corrida contra o Bug".
 */
export const CONFIG = Object.freeze({
  duracaoRodada: 90,            // segundos de cada partida

  pontuacao: Object.freeze({
    maximos: 100,               // acerto instantâneo
    minimos: 10,                // acerto lento ainda vale pelo menos isso
    perdaPorSegundo: 6,         // pontos perdidos por segundo pensando
    penalidadeErro: 30          // descontados ao tocar na linha errada
  }),

  ordemNiveis: ["facil", "medio", "dificil"],
  nomesNiveis: Object.freeze({ facil: "FÁCIL", medio: "MÉDIO", dificil: "DIFÍCIL" }),

  segundosFeedback: 0,          // 0 = sem avanço automático: o jogador toca em "Próximo desafio" (o relógio fica parado na explicação)
  segundosInatividade: 30,      // sem toques: volta ao início (a tela de ranking não volta sozinha)
  tamanhoMaxApelido: 12,
  tamanhoTop: 10,
  limiteRegistros: 1000,        // partidas guardadas no aparelho (as piores saem primeiro)

  // Área do administrador. É só uma trava contra curiosos: quem abrir o código vê o PIN.
  pinAdmin: "2580",             // TROQUE antes do evento
  segundosToqueLongo: 2,

  sons: true,                   // sons curtos gerados por código (sem arquivos)
  telaCheiaNoNavegador: true,   // no navegador, pede tela cheia ao tocar em "Jogar"
  chaveRanking: "corridaContraOBug.ranking.v1" // nome do registro no localStorage
});
