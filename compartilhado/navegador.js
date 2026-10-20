/**
 * Navegador de telas.
 *
 * Cada tela é um objeto { elemento, entrar?(parametros), sair?() }.
 * Só uma fica visível por vez (classe .ativa). Ao trocar, a tela anterior
 * recebe sair() (para parar cronômetros) e a nova recebe entrar(parametros).
 */
export class Navegador {
  constructor() {
    this.telas = new Map();
    this.atual = null;
    this.ouvintes = new Set();
  }

  registrar(nome, tela) {
    if (!tela || !tela.elemento) throw new Error(`Tela "${nome}" precisa de um elemento.`);
    this.telas.set(nome, tela);
    return this;
  }

  ir(nome, parametros) {
    const proxima = this.telas.get(nome);
    if (!proxima) throw new Error(`Tela desconhecida: "${nome}".`);

    const anterior = this.atual ? this.telas.get(this.atual) : null;
    if (anterior && anterior.sair) anterior.sair();

    for (const [chave, tela] of this.telas) tela.elemento.classList.toggle("ativa", chave === nome);
    this.atual = nome;

    if (proxima.entrar) proxima.entrar(parametros);
    this.ouvintes.forEach((ouvinte) => ouvinte(nome));
  }

  /** Avisa sempre que a tela muda. Devolve uma função para cancelar o aviso. */
  aoMudar(ouvinte) {
    this.ouvintes.add(ouvinte);
    return () => this.ouvintes.delete(ouvinte);
  }
}
