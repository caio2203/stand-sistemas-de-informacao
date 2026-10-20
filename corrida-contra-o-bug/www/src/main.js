/**
 * PONTO DE ENTRADA DO "CORRIDA CONTRA O BUG"
 *
 * Aqui só se monta o aplicativo (raiz de composição): cria os serviços e as
 * telas e liga uns nos outros. Nenhuma regra de negócio mora aqui.
 *
 *   dados/       conteúdo editável (trechos de código)
 *   dominio/     regras puras: partida, pontuação, ranking, apelido, sintaxe
 *   aplicacao/   casos de uso do ranking
 *   infra/       localStorage e arquivos (o que depende do aparelho)
 *   ui/          telas e componentes visuais
 *   ../compartilhado/  núcleo comum aos jogos do stand
 */
import { CONFIG } from "./config.js";
import { TRECHOS } from "./dados/trechos.js";
import { PartidaBug, validarTrecho } from "./dominio/partida.js";
import { ServicoRanking } from "./aplicacao/servico-ranking.js";
import { RepositorioRanking } from "./infra/repositorio-ranking.js";
import { salvarArquivoTexto } from "./infra/arquivos.js";
import { criarSons } from "./ui/sons.js";
import { criarTelaInicio } from "./ui/tela-inicio.js";
import { criarTelaJogo } from "./ui/tela-jogo.js";
import { criarTelaFim } from "./ui/tela-fim.js";
import { criarTelaRanking } from "./ui/tela-ranking.js";
import { criarAdmin } from "./ui/admin.js";
import { Navegador } from "../compartilhado/navegador.js";
import { VigiaInatividade } from "../compartilhado/inatividade.js";
import { esconderBarrasDoSistema, bloquearMenuDeContexto } from "../compartilhado/plataforma.js";

// Confere os trechos editados: avisa no console e na tela inicial
const problemasConteudo = TRECHOS.flatMap((trecho, i) =>
  validarTrecho(trecho, CONFIG.ordemNiveis).map((problema) => `trecho ${i + 1}: ${problema}`)
);
if (problemasConteudo.length > 0) console.warn("Problemas nos trechos:\n- " + problemasConteudo.join("\n- "));

/* ---------- Serviços ---------- */
const servicoRanking = new ServicoRanking({
  repositorio: new RepositorioRanking({ chave: CONFIG.chaveRanking }),
  limiteRegistros: CONFIG.limiteRegistros
});
const sons = criarSons({ ativo: CONFIG.sons });

/* ---------- Fluxo ---------- */
const tela = (nome) => document.querySelector(`[data-tela="${nome}"]`);
const navegador = new Navegador();
let ultimoApelido = "";
let ultimoRegistroId = null;

function jogar(apelido) {
  ultimoApelido = apelido;
  esconderBarrasDoSistema({ telaCheiaNoNavegador: CONFIG.telaCheiaNoNavegador });
  sons.clique();
  navegador.ir("jogo", { partida: new PartidaBug({ apelido, trechos: TRECHOS, config: CONFIG }) });
}

function terminar(partida) {
  sons.fim();
  const registro = servicoRanking.registrarPartida(partida);
  ultimoRegistroId = registro.id;
  navegador.ir("fim", { partida, registro });
}

/* ---------- Telas ---------- */
const telaInicio = criarTelaInicio({
  elemento: tela("inicio"),
  config: CONFIG,
  problemas: problemasConteudo,
  obterRecorde: () => servicoRanking.melhor(),
  aoJogar: jogar,
  aoVerRanking: () => navegador.ir("ranking")
});

const telaFim = criarTelaFim({
  elemento: tela("fim"),
  config: CONFIG,
  aoJogarNovamente: () => jogar(ultimoApelido),
  aoVerRanking: () => navegador.ir("ranking", { destacarId: ultimoRegistroId }),
  aoInicio: () => navegador.ir("inicio")
});

navegador
  .registrar("inicio", telaInicio)
  .registrar("jogo", criarTelaJogo({ elemento: tela("jogo"), config: CONFIG, sons, aoTerminar: terminar }))
  .registrar("fim", telaFim)
  .registrar("ranking", criarTelaRanking({
    elemento: tela("ranking"),
    obterTop: () => servicoRanking.top(CONFIG.tamanhoTop),
    aoVoltar: () => navegador.ir("inicio")
  }));

/* ---------- Administrador ---------- */
const admin = criarAdmin({
  gatilho: document.querySelector('[data-ref="marca"]'),
  caixaPin: document.querySelector('[data-admin="pin"]'),
  caixaPainel: document.querySelector('[data-admin="painel"]'),
  config: CONFIG,
  podeAbrir: () => navegador.atual === "inicio",
  servicoRanking,
  salvarArquivo: salvarArquivoTexto,
  sons,
  aoAlterarRanking: () => {
    ultimoRegistroId = null;
    telaInicio.entrar(); // atualiza o recorde exibido
  }
});

/* ---------- Inatividade ----------
   - jogo e fim: volta ao início (partida abandonada não é salva)
   - início: apaga apelido esquecido e fecha a área do administrador
   - ranking: fica exibido indefinidamente */
const vigia = new VigiaInatividade({
  segundos: CONFIG.segundosInatividade,
  aoExpirar: () => {
    admin.fechar();
    if (navegador.atual !== "inicio") navegador.ir("inicio");
    else if (telaInicio.temApelidoDigitado()) telaInicio.limpar();
  },
  aoTique: (segundos) => {
    if (navegador.atual === "fim") telaFim.mostrarContagem(segundos);
  }
}).iniciar();
navegador.aoMudar((nome) => vigia.ativar(nome !== "ranking"));

bloquearMenuDeContexto();
esconderBarrasDoSistema({ telaCheiaNoNavegador: false }); // no APK já esconde ao abrir
navegador.ir("inicio");
