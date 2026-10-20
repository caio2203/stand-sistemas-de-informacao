/**
 * Ajustes gerais do quiz.
 */
export const CONFIG = Object.freeze({
  segundosPorPergunta: 15,     // com tempo: 7 x 15 s = 1 min 45 s no pior caso
  segundosAvisoTempo: 5,       // aviso em texto quando faltar esse tempo
  segundosInatividade: 30,     // sem toques por esse tempo: volta para o início
  telaCheiaNoNavegador: true   // no navegador, pede tela cheia ao tocar em "Iniciar"
});
