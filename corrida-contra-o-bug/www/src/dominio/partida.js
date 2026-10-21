/**
 * REGRAS DA PARTIDA (domínio).
 *
 * Código puro: não usa tela, relógio do sistema nem armazenamento.
 * O tempo é informado de fora com avancarTempo(segundos), o que permite
 * testar tudo em testes/partida.test.js.
 */

/** Embaralha uma cópia da lista (Fisher-Yates). `aleatorio` devolve [0, 1). */
export function embaralhar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Sorteia até `porNivel` trechos de cada nível, em ordem aleatória,
 * com os níveis em sequência (fácil, médio, difícil).
 */
export function montarFila(trechos, ordemNiveis, aleatorio = Math.random, porNivel = Infinity) {
  return ordemNiveis.flatMap((nivel) => embaralhar(trechos.filter((t) => t.nivel === nivel), aleatorio).slice(0, porNivel));
}

/** Acerto rápido vale mais: começa em `maximos` e cai por segundo, até `minimos`. */
export function pontosPorAcerto(segundos, { maximos, minimos, perdaPorSegundo }) {
  return Math.max(minimos, Math.round(maximos - segundos * perdaPorSegundo));
}

/** Confere um trecho editável. Devolve a lista de problemas (vazia quando está certo). */
export function validarTrecho(trecho, niveisValidos) {
  const problemas = [];
  if (!niveisValidos.includes(trecho.nivel)) problemas.push(`nível inválido "${trecho.nivel}"`);
  if (!Array.isArray(trecho.linhas) || trecho.linhas.length < 3 || trecho.linhas.length > 6) {
    problemas.push("precisa ter de 3 a 6 linhas");
  } else if (!Number.isInteger(trecho.linhaErrada) || trecho.linhaErrada < 1 || trecho.linhaErrada > trecho.linhas.length) {
    problemas.push(`linhaErrada ${trecho.linhaErrada} fora do trecho`);
  }
  if (!trecho.explicacao) problemas.push("explicação vazia");
  return problemas;
}

export class PartidaBug {
  /**
   * @param {object} opcoes
   * @param {string} opcoes.apelido
   * @param {Array}  opcoes.trechos     trechos de dados/trechos.js
   * @param {object} opcoes.config      CONFIG (duracaoRodada, pontuacao, ordemNiveis, trechosPorNivel)
   * @param {Function} [opcoes.aleatorio]
   */
  constructor({ apelido, trechos, config, aleatorio = Math.random }) {
    this.apelido = apelido;
    this.regras = config.pontuacao;
    this.fila = montarFila(trechos, config.ordemNiveis, aleatorio, config.trechosPorNivel);
    this.pontos = 0;
    this.acertos = 0;
    this.erros = 0;
    this.numero = 0;              // quantos trechos já apareceram
    this.trecho = null;           // trecho na tela
    this.restante = config.duracaoRodada;
    this.tempoNoTrecho = 0;
    this.aguardandoProximo = false; // true enquanto a explicação está na tela (relógio parado)
    this.encerrada = false;
    this.motivo = null;           // "tempo" ou "zerou" (acabaram os trechos)
  }

  /** Pontos que um acerto daria agora. */
  get valorAtual() {
    return pontosPorAcerto(this.tempoNoTrecho, this.regras);
  }

  /** Passa para o próximo trecho. Devolve o trecho, ou null se a partida acabou. */
  proximoTrecho() {
    if (this.encerrada) return null;
    if (this.fila.length === 0) {
      this.encerrar("zerou");
      return null;
    }
    this.trecho = this.fila.shift();
    this.numero++;
    this.tempoNoTrecho = 0;
    this.aguardandoProximo = false;
    return this.trecho;
  }

  /** Avança o relógio. Parado enquanto a explicação estiver na tela. */
  avancarTempo(segundos) {
    if (this.encerrada || this.aguardandoProximo) return;
    this.restante -= segundos;
    this.tempoNoTrecho += segundos;
    if (this.restante <= 0) {
      this.restante = 0;
      this.encerrar("tempo");
    }
  }

  /**
   * Registra o toque em uma linha (índice a partir de 0).
   * Devolve { acertou, delta, indiceCerto, explicacao } ou null se não pode responder agora.
   */
  responder(indiceLinha) {
    if (this.encerrada || this.aguardandoProximo || !this.trecho) return null;
    this.aguardandoProximo = true;

    const indiceCerto = this.trecho.linhaErrada - 1;
    const acertou = indiceLinha === indiceCerto;
    const delta = acertou ? this.valorAtual : -this.regras.penalidadeErro;

    if (acertou) this.acertos++;
    else this.erros++;
    this.pontos = Math.max(0, this.pontos + delta); // a pontuação nunca fica negativa

    return { acertou, delta, indiceCerto, explicacao: this.trecho.explicacao };
  }

  encerrar(motivo) {
    if (this.encerrada) return;
    this.encerrada = true;
    this.motivo = motivo;
  }
}
