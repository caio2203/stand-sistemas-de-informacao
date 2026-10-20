/**
 * PONTO DE ENTRADA DO QUIZ
 *
 * Aqui só se monta o aplicativo: cria as telas, liga uma na outra e
 * configura a inatividade e a tela cheia. Nenhuma regra de negócio mora aqui.
 *
 *   dados/      conteúdo editável (áreas e perguntas)
 *   dominio/    regras do quiz, sem tela (testadas em testes/)
 *   ui/         telas
 *   ../compartilhado/  núcleo comum aos jogos do stand (inclui os tokens de design)
 */
import { CONFIG } from "./config.js";
import { AREAS } from "./dados/areas.js";
import { PERGUNTAS } from "./dados/perguntas.js";
import { PartidaQuiz, validarConteudo } from "./dominio/quiz.js";
import { criarTelaInicio } from "./ui/tela-inicio.js";
import { criarTelaPergunta } from "./ui/tela-pergunta.js";
import { criarTelaResultado } from "./ui/tela-resultado.js";
import { Navegador } from "../compartilhado/navegador.js";
import { VigiaInatividade } from "../compartilhado/inatividade.js";
import { esconderBarrasDoSistema, bloquearMenuDeContexto } from "../compartilhado/plataforma.js";

const problemas = validarConteudo(AREAS, PERGUNTAS);
if (problemas.length > 0) console.warn("Problemas no conteúdo do quiz:\n- " + problemas.join("\n- "));

const tela = (nome) => document.querySelector(`[data-tela="${nome}"]`);
const navegador = new Navegador();
let ultimaEscolha = { comTempo: true };

function comecar(escolha = ultimaEscolha) {
  ultimaEscolha = escolha;
  esconderBarrasDoSistema({ telaCheiaNoNavegador: CONFIG.telaCheiaNoNavegador });
  navegador.ir("pergunta", {
    partida: new PartidaQuiz(PERGUNTAS, Object.keys(AREAS)),
    comTempo: escolha.comTempo
  });
}

const telaResultado = criarTelaResultado({
  elemento: tela("resultado"),
  areas: AREAS,
  config: CONFIG,
  aoJogarNovamente: () => comecar(),
  aoInicio: () => navegador.ir("inicio")
});

navegador
  .registrar("inicio", criarTelaInicio({
    elemento: tela("inicio"),
    areas: AREAS,
    totalPerguntas: PERGUNTAS.length,
    config: CONFIG,
    problemas,
    aoComecar: comecar
  }))
  .registrar("pergunta", criarTelaPergunta({
    elemento: tela("pergunta"),
    areas: AREAS,
    config: CONFIG,
    aoTerminar: (partida, resumo) => navegador.ir("resultado", { ...partida.resultado(), resumo })
  }))
  .registrar("resultado", telaResultado);

// Sem toques por X segundos fora da tela inicial: volta ao início
const vigia = new VigiaInatividade({
  segundos: CONFIG.segundosInatividade,
  aoExpirar: () => navegador.ir("inicio"),
  aoTique: (segundos) => {
    if (navegador.atual === "resultado") telaResultado.mostrarContagem(segundos);
  }
}).iniciar();
navegador.aoMudar((nome) => vigia.ativar(nome !== "inicio"));

bloquearMenuDeContexto();
esconderBarrasDoSistema({ telaCheiaNoNavegador: false }); // no APK já esconde ao abrir
navegador.ir("inicio");
