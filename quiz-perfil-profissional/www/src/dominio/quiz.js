/**
 * REGRAS DO QUIZ (domínio).
 *
 * Código puro: não usa tela, DOM nem armazenamento. Por isso é testado
 * diretamente em testes/quiz.test.js.
 */

/** Cria { area: 0, ... } para cada área. */
export function pontuacaoZerada(chavesAreas) {
  return Object.fromEntries(chavesAreas.map((chave) => [chave, 0]));
}

/** Devolve uma nova pontuação somando os pontos da alternativa. Áreas desconhecidas são ignoradas. */
export function somarPontos(pontuacao, pontos) {
  const nova = { ...pontuacao };
  for (const [area, valor] of Object.entries(pontos)) {
    if (area in nova) nova[area] += valor;
  }
  return nova;
}

/**
 * Descobre a área vencedora e a segunda colocada.
 * Em caso de empate no primeiro lugar, sorteia entre as empatadas.
 * `sortear` devolve um número em [0, 1) e pode ser trocado nos testes.
 */
export function calcularResultado(pontuacao, sortear = Math.random) {
  const chaves = Object.keys(pontuacao);
  if (chaves.length === 0) throw new Error("Nenhuma área para calcular o resultado.");

  const ordenadas = [...chaves].sort((a, b) => pontuacao[b] - pontuacao[a]);
  const maximo = pontuacao[ordenadas[0]];
  const empatadas = ordenadas.filter((chave) => pontuacao[chave] === maximo);
  const vencedora = empatadas[Math.min(empatadas.length - 1, Math.floor(sortear() * empatadas.length))];
  const segunda = ordenadas.find((chave) => chave !== vencedora && pontuacao[chave] > 0) || null;

  return { vencedora, segunda, pontuacao: { ...pontuacao } };
}

/**
 * Confere se o conteúdo editável está consistente.
 * Devolve uma lista de problemas (vazia quando está tudo certo).
 */
export function validarConteudo(areas, perguntas) {
  const problemas = [];
  const chaves = Object.keys(areas);
  const alcancadas = new Set();

  for (const [chave, area] of Object.entries(areas)) {
    for (const campo of ["nome", "cor", "icone", "descricao", "incentivo"]) {
      if (!area[campo]) problemas.push(`Área "${chave}": campo "${campo}" vazio.`);
    }
    if (!Array.isArray(area.estudos) || area.estudos.length !== 3) {
      problemas.push(`Área "${chave}": "estudos" deve ter exatamente 3 itens.`);
    }
  }

  perguntas.forEach((pergunta, i) => {
    const numero = i + 1;
    if (!pergunta.texto) problemas.push(`Pergunta ${numero}: texto vazio.`);
    if (!Array.isArray(pergunta.alternativas) || pergunta.alternativas.length < 2) {
      problemas.push(`Pergunta ${numero}: precisa de pelo menos 2 alternativas.`);
      return;
    }
    pergunta.alternativas.forEach((alt, j) => {
      const letra = String.fromCharCode(65 + j);
      if (!alt.texto) problemas.push(`Pergunta ${numero}, alternativa ${letra}: texto vazio.`);
      for (const [area, valor] of Object.entries(alt.pontos || {})) {
        if (!chaves.includes(area)) problemas.push(`Pergunta ${numero}, alternativa ${letra}: área desconhecida "${area}".`);
        else if (valor > 0) alcancadas.add(area);
        if (typeof valor !== "number") problemas.push(`Pergunta ${numero}, alternativa ${letra}: pontos de "${area}" não é número.`);
      }
    });
  });

  chaves
    .filter((chave) => !alcancadas.has(chave))
    .forEach((chave) => problemas.push(`Área "${chave}" nunca recebe pontos: ninguém consegue esse resultado.`));

  return problemas;
}

/**
 * Uma partida do quiz: em qual pergunta está e quantos pontos cada área tem.
 */
export class PartidaQuiz {
  constructor(perguntas, chavesAreas) {
    this.perguntas = perguntas;
    this.indice = 0;
    this.pontuacao = pontuacaoZerada(chavesAreas);
  }

  get total() {
    return this.perguntas.length;
  }

  get terminou() {
    return this.indice >= this.perguntas.length;
  }

  get perguntaAtual() {
    return this.terminou ? null : this.perguntas[this.indice];
  }

  /** Registra a alternativa escolhida (índice a partir de 0) e avança. */
  responder(indiceAlternativa) {
    if (this.terminou) return;
    const alternativa = this.perguntaAtual.alternativas[indiceAlternativa];
    if (!alternativa) throw new Error(`Alternativa inválida: ${indiceAlternativa}.`);
    this.pontuacao = somarPontos(this.pontuacao, alternativa.pontos || {});
    this.indice++;
  }

  /** Pula a pergunta sem somar pontos (tempo esgotado). */
  pular() {
    if (!this.terminou) this.indice++;
  }

  resultado(sortear) {
    return calcularResultado(this.pontuacao, sortear);
  }
}
