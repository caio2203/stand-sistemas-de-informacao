import { referencias } from "../../compartilhado/dom.js";
import { mmss } from "../../compartilhado/formato.js";

/**
 * Tela de resultado: área com mais pontos, resumo em números,
 * estudos do curso e tabela de pontuação por área.
 */
export function criarTelaResultado({ elemento, areas, config, aoJogarNovamente, aoInicio }) {
  const ref = referencias(elemento);
  ref.jogarNovamente.addEventListener("click", aoJogarNovamente);
  ref.inicio.addEventListener("click", aoInicio);

  function entrar({ vencedora, pontuacao, resumo }) {
    const area = areas[vencedora];
    ref.nome.textContent = `Sua área: ${area.nome}`;
    ref.descricao.textContent = area.descricao;
    ref.resumo.textContent = `Respondidas: ${resumo.respondidas} de ${resumo.total} · Tempo: ${mmss(resumo.segundos)}`;
    ref.proximoPasso.textContent = area.incentivo;

    ref.estudos.replaceChildren(
      ...area.estudos.map((estudo) => {
        const item = document.createElement("li");
        item.textContent = estudo;
        return item;
      })
    );

    const linhas = Object.keys(pontuacao)
      .sort((a, b) => pontuacao[b] - pontuacao[a])
      .map((chave) => criarLinha(chave, pontuacao[chave], chave === vencedora));
    ref.tabela.replaceChildren(...linhas);

    mostrarContagem(config.segundosInatividade);
    ref.jogarNovamente.focus();
  }

  function criarLinha(chave, pontos, ehVencedora) {
    const linha = document.createElement("tr");
    linha.classList.toggle("vencedora", ehVencedora);

    const nome = document.createElement("td");
    nome.textContent = areas[chave] ? areas[chave].nome : chave;
    if (ehVencedora) {
      const rotulo = document.createElement("span");
      rotulo.className = "rotulo-linha";
      rotulo.textContent = " · resultado";
      nome.appendChild(rotulo);
    }

    const valor = document.createElement("td");
    valor.className = "numero";
    valor.textContent = pontos;

    linha.append(nome, valor);
    return linha;
  }

  /** Atualiza o aviso "Volta ao início em X s sem interação." */
  function mostrarContagem(segundos) {
    ref.contagem.textContent = `Volta ao início em ${segundos} s sem interação.`;
  }

  return { elemento, entrar, mostrarContagem };
}
