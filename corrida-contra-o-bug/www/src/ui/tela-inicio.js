import { referencias } from "../../compartilhado/dom.js";
import { limparApelido } from "../dominio/apelido.js";

const DICA_PADRAO = "Use um apelido, não o nome completo. Até 12 caracteres.";

/**
 * Tela inicial: regras, campo do apelido, "Jogar", "Ver ranking" e recorde atual.
 */
export function criarTelaInicio({ elemento, config, problemas, obterRecorde, aoJogar, aoVerRanking }) {
  const ref = referencias(elemento);

  ref.apelido.maxLength = config.tamanhoMaxApelido;
  ref.regras.textContent =
    "Cada desafio mostra um trecho de Python com exatamente um erro. Selecione a linha que o contém e confirme. " +
    `A rodada dura ${config.duracaoRodada} s. Acertos rápidos valem até ${config.pontuacao.maximos} pontos; ` +
    `cada erro desconta ${config.pontuacao.penalidadeErro}.`;

  if (problemas.length > 0) {
    ref.erroConteudo.textContent = `Há ${problemas.length} problema(s) nos trechos de código. Primeiro: ${problemas[0]}`;
    ref.erroConteudo.hidden = false;
  }

  function mostrarDica(texto, ehErro = false) {
    ref.dica.textContent = texto;
    ref.dica.classList.toggle("aviso-erro", ehErro);
    ref.dica.classList.toggle("apoio", !ehErro);
    ref.apelido.setAttribute("aria-invalid", String(ehErro));
  }

  function tentarJogar() {
    const apelido = limparApelido(ref.apelido.value, config.tamanhoMaxApelido);
    if (!apelido) {
      mostrarDica("Digite um apelido para jogar.", true);
      ref.apelido.focus();
      return;
    }
    ref.apelido.value = apelido;
    ref.apelido.blur();
    aoJogar(apelido);
  }

  /** Apaga o apelido (próxima pessoa da fila). */
  function limpar() {
    ref.apelido.value = "";
    ref.apelido.blur();
    mostrarDica(DICA_PADRAO);
  }

  function entrar() {
    limpar();
    const melhor = obterRecorde();
    ref.recorde.textContent = melhor
      ? `Recorde neste aparelho: ${melhor.apelido}, ${melhor.pontos} pontos.`
      : "Nenhuma partida registrada neste aparelho.";
  }

  ref.jogar.addEventListener("click", tentarJogar);
  ref.apelido.addEventListener("keydown", (evento) => { if (evento.key === "Enter") tentarJogar(); });
  ref.apelido.addEventListener("input", () => mostrarDica(DICA_PADRAO));
  ref.verRanking.addEventListener("click", aoVerRanking);

  return {
    elemento,
    entrar,
    limpar,
    temApelidoDigitado: () => ref.apelido.value !== ""
  };
}
