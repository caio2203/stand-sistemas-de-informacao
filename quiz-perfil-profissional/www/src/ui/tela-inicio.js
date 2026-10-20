import { referencias } from "../../compartilhado/dom.js";

/**
 * Tela inicial: descrição, escolha do tempo e botão "Iniciar".
 * Se o conteúdo editável tiver problemas, mostra o aviso (o quiz continua jogável).
 */
export function criarTelaInicio({ elemento, areas, totalPerguntas, config, problemas, aoComecar }) {
  const ref = referencias(elemento);

  ref.descricao.textContent =
    `${totalPerguntas} perguntas sobre situações do dia a dia. Não há resposta certa: ` +
    "cada alternativa soma pontos para uma ou mais áreas, e a área com mais pontos é o resultado.";
  ref.areas.textContent = `Áreas: ${Object.values(areas).map((area) => area.nome).join(", ")}.`;
  ref.rotuloComTempo.textContent = `${config.segundosPorPergunta} s por questão`;

  if (problemas.length > 0) {
    ref.erro.textContent = `Há ${problemas.length} problema(s) no conteúdo do quiz. Primeiro: ${problemas[0]}`;
    ref.erro.hidden = false;
  }

  ref.comecar.addEventListener("click", () => aoComecar({ comTempo: ref.comTempo.checked }));

  return { elemento };
}
