const EVENTOS_DE_INTERACAO = ["pointerdown", "keydown", "input"];

/**
 * Vigia de inatividade.
 *
 * Enquanto ativo, se ninguém tocar na tela por `segundos`, chama aoExpirar().
 * aoTique(segundosRestantes) é chamado várias vezes por segundo, útil para
 * mostrar uma contagem regressiva. Depois de expirar, a contagem recomeça.
 */
export class VigiaInatividade {
  constructor({ segundos, aoExpirar, aoTique = () => {}, alvo = document, agora = () => Date.now(), intervaloMs = 250 }) {
    this.segundos = segundos;
    this.aoExpirar = aoExpirar;
    this.aoTique = aoTique;
    this.alvo = alvo;
    this.agora = agora;
    this.intervaloMs = intervaloMs;
    this.ativo = false;
    this.ultimaInteracao = agora();
    this.registrar = this.registrar.bind(this);
    this.relogio = null;
  }

  iniciar() {
    EVENTOS_DE_INTERACAO.forEach((evento) => this.alvo.addEventListener(evento, this.registrar, { passive: true }));
    this.relogio = setInterval(() => this.verificar(), this.intervaloMs);
    return this;
  }

  parar() {
    EVENTOS_DE_INTERACAO.forEach((evento) => this.alvo.removeEventListener(evento, this.registrar));
    clearInterval(this.relogio);
  }

  /** Liga ou desliga a contagem (ex.: desligada na tela inicial). */
  ativar(ligado) {
    this.ativo = ligado;
    this.registrar();
  }

  registrar() {
    this.ultimaInteracao = this.agora();
  }

  msRestantes() {
    return this.segundos * 1000 - (this.agora() - this.ultimaInteracao);
  }

  segundosRestantes() {
    return Math.max(0, Math.ceil(this.msRestantes() / 1000));
  }

  verificar() {
    if (!this.ativo) return;
    this.aoTique(this.segundosRestantes());
    if (this.msRestantes() <= 0) {
      this.registrar();
      this.aoExpirar();
    }
  }
}
