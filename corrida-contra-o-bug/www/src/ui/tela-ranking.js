import { referencias } from "../../compartilhado/dom.js";

/**
 * Tela de ranking (10 melhores), em tabela com números em mono,
 * para ficar exibida no tablet. O primeiro lugar é marcado como recorde em texto.
 */
export function criarTelaRanking({ elemento, obterTop, aoVoltar }) {
  const ref = referencias(elemento);
  ref.voltar.addEventListener("click", aoVoltar);

  function entrar({ destacarId = null } = {}) {
    const top = obterTop();
    ref.vazio.hidden = top.length > 0;
    ref.lista.closest("table").hidden = top.length === 0;
    ref.lista.replaceChildren(...top.map((registro, i) => criarLinha(registro, i, registro.id === destacarId)));
    ref.voltar.focus();
  }

  function criarLinha(registro, indice, ehSuaPartida) {
    const linha = document.createElement("tr");
    linha.classList.toggle("primeira", indice === 0);
    linha.classList.toggle("sua-partida", ehSuaPartida);

    const posicao = document.createElement("td");
    posicao.className = "numero";
    posicao.textContent = indice + 1;

    const apelido = document.createElement("td");
    apelido.textContent = registro.apelido;
    const notas = [indice === 0 ? "recorde" : "", ehSuaPartida ? "sua partida" : ""].filter(Boolean);
    if (notas.length > 0) {
      const rotulo = document.createElement("span");
      rotulo.className = "rotulo-linha";
      rotulo.textContent = notas.join(" · ");
      apelido.appendChild(rotulo);
    }

    const pontos = document.createElement("td");
    pontos.className = "numero";
    pontos.textContent = registro.pontos;

    linha.append(posicao, apelido, pontos);
    return linha;
  }

  return { elemento, entrar };
}
