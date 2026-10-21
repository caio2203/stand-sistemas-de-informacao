import { referencias } from "../../compartilhado/dom.js";
import { mmss } from "../../compartilhado/formato.js";
import { nivelDaArea } from "../dominio/quiz.js";

const SVG = "http://www.w3.org/2000/svg";
const AFASTAMENTO_ROTULO = 1.12; // distância dos nomes ao centro, em raios do gráfico

/**
 * Tela de resultado: área com mais pontos, resumo em números,
 * estudos do curso e gráfico de radar com a pontuação por área.
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

    desenharRadar(pontuacao);
    mostrarContagem(config.segundosInatividade);
    ref.jogarNovamente.focus();
  }

  /**
   * Um vértice por área (na ordem de areas.js, do topo em sentido horário).
   * A área com mais pontos chega ao anel externo (A); zero fica no centro (E).
   */
  function desenharRadar(pontuacao) {
    const chaves = Object.keys(areas);
    const maximo = Math.max(0, ...chaves.map((chave) => pontuacao[chave] || 0));
    const raios = chaves.map((chave) => (maximo > 0 ? (pontuacao[chave] || 0) / maximo : 0));

    const angulo = (i) => (i / chaves.length) * 2 * Math.PI - Math.PI / 2;
    const ponto = (i, raio) => [raio * Math.cos(angulo(i)), raio * Math.sin(angulo(i))];
    const contorno = (raioDe) => chaves.map((_, i) => ponto(i, raioDe(i)).map((n) => n.toFixed(4)).join(",")).join(" ");

    const svg = svgEl("svg", { viewBox: "-1 -1 2 2" });
    for (const faixa of [4, 3, 2, 1]) svg.append(svgEl("polygon", { class: "radar-anel", points: contorno(() => faixa / 4) }));
    chaves.forEach((_, i) => {
      const [x, y] = ponto(i, 1);
      svg.append(svgEl("line", { class: "radar-eixo", x1: 0, y1: 0, x2: x, y2: y }));
    });
    svg.append(svgEl("polygon", { class: "radar-forma", points: contorno((i) => raios[i]) }));
    raios.forEach((raio, i) => {
      const [x, y] = ponto(i, raio);
      svg.append(svgEl("circle", { class: "radar-ponto", cx: x, cy: y, r: 0.03 }));
    });

    // Escala A a E ao lado do eixo de cima
    const escala = [..."ABCDE"].map((letra, i) => {
      const rotulo = document.createElement("span");
      rotulo.className = "radar-escala";
      rotulo.textContent = letra;
      posicionar(rotulo, 0.04, -(4 - i) / 4, 0, -0.5);
      return rotulo;
    });

    const rotulos = chaves.map((chave, i) => {
      const pontos = pontuacao[chave] || 0;
      const [x, y] = ponto(i, AFASTAMENTO_ROTULO);
      const cos = Math.cos(angulo(i));
      const rotulo = document.createElement("div");
      rotulo.className = "radar-rotulo";
      rotulo.classList.toggle("lateral", Math.abs(cos) > 0.1);
      rotulo.innerHTML = '<span class="radar-nome"></span><span><span class="radar-nivel"></span> <span class="radar-pontos"></span></span>';
      rotulo.querySelector(".radar-nome").textContent = areas[chave].nome;
      rotulo.querySelector(".radar-nivel").textContent = nivelDaArea(pontos, maximo);
      rotulo.querySelector(".radar-pontos").textContent = `${pontos} pts`;
      // o nome "cresce" para fora do gráfico: à direita, à esquerda, acima ou abaixo do vértice
      posicionar(rotulo, x, y, (cos - 1) / 2, (Math.sin(angulo(i)) - 1) / 2);
      return rotulo;
    });

    ref.radar.setAttribute(
      "aria-label",
      "Pontuação por área: " +
        chaves
          .map((chave) => {
            const pontos = pontuacao[chave] || 0;
            return `${areas[chave].nome}, nível ${nivelDaArea(pontos, maximo)}, ${pontos} ${pontos === 1 ? "ponto" : "pontos"}`;
          })
          .join("; ")
    );
    ref.radar.replaceChildren(svg, ...escala, ...rotulos);
  }

  /** Coloca o elemento no ponto (x, y) do gráfico (-1 a 1) e o desloca por uma fração do próprio tamanho. */
  function posicionar(el, x, y, deslocX, deslocY) {
    el.style.left = `${50 + 50 * x}%`;
    el.style.top = `${50 + 50 * y}%`;
    el.style.transform = `translate(${deslocX * 100}%, ${deslocY * 100}%)`;
  }

  function svgEl(nome, atributos) {
    const el = document.createElementNS(SVG, nome);
    for (const [chave, valor] of Object.entries(atributos)) el.setAttribute(chave, valor);
    return el;
  }

  /** Atualiza o aviso "Volta ao início em X s sem interação." */
  function mostrarContagem(segundos) {
    ref.contagem.textContent = `Volta ao início em ${segundos} s sem interação.`;
  }

  return { elemento, entrar, mostrarContagem };
}
