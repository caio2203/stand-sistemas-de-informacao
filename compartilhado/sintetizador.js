/**
 * Sons curtos gerados por código (Web Audio API). Nenhum arquivo de áudio.
 *
 * Uma nota é [frequência em Hz, início em segundos, duração em segundos].
 */
export function criarSintetizador({ ativo = true, volume = 0.18 } = {}) {
  let contexto = null;

  function obterContexto() {
    const Construtor = window.AudioContext || window.webkitAudioContext;
    if (!Construtor) return null;
    contexto = contexto || new Construtor();
    if (contexto.state === "suspended") contexto.resume();
    return contexto;
  }

  return {
    tocar(notas, onda = "triangle") {
      if (!ativo) return;
      try {
        const ctx = obterContexto();
        if (!ctx) return;
        const t0 = ctx.currentTime;
        notas.forEach(([frequencia, inicio, duracao]) => {
          const oscilador = ctx.createOscillator();
          const ganho = ctx.createGain();
          oscilador.type = onda;
          oscilador.frequency.value = frequencia;
          ganho.gain.setValueAtTime(0.0001, t0 + inicio);
          ganho.gain.exponentialRampToValueAtTime(volume, t0 + inicio + 0.01);
          ganho.gain.exponentialRampToValueAtTime(0.0001, t0 + inicio + duracao);
          oscilador.connect(ganho).connect(ctx.destination);
          oscilador.start(t0 + inicio);
          oscilador.stop(t0 + inicio + duracao + 0.02);
        });
      } catch (erro) {
        /* sem som não impede o jogo */
      }
    }
  };
}
