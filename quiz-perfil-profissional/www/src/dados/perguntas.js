/**
 * PERGUNTAS: 7 perguntas do dia a dia, 4 alternativas cada.
 *
 * Em "pontos", diga quantos pontos a alternativa soma para cada área
 * (as chaves são as de areas.js). Exemplo: pontos: { uiux: 2, frontend: 1 }
 *
 * Se uma chave estiver errada, o aviso aparece no console do navegador
 * e o teste automático (npm test) falha.
 */
export const PERGUNTAS = [
  {
    texto: "Num trabalho em grupo, você geralmente...",
    alternativas: [
      { texto: "Deixa os slides bonitos e organizados", pontos: { uiux: 2, frontend: 1 } },
      { texto: "Divide as tarefas e junta tudo no final", pontos: { backend: 3 } },
      { texto: "Pesquisa os números e monta os gráficos", pontos: { dados: 2 } },
      { texto: "Revisa tudo procurando falhas", pontos: { seguranca: 2, dados: 1 } }
    ]
  },
  {
    texto: "O wi-fi de casa caiu. O que você faz?",
    alternativas: [
      { texto: "Reinicia o roteador e mexe nas configurações até voltar", pontos: { infra: 3 } },
      { texto: "Desconfia que alguém está usando a rede sem permissão", pontos: { seguranca: 2, infra: 1 } },
      { texto: "Aproveita para desenhar ou editar umas artes", pontos: { uiux: 2, frontend: 1 } },
      { texto: "Anota quantas vezes caiu na semana para reclamar com provas", pontos: { dados: 2, infra: 1 } }
    ]
  },
  {
    texto: "Ao baixar um app novo, o que mais chama sua atenção?",
    alternativas: [
      { texto: "Se ele é bonito e fácil de usar", pontos: { uiux: 3 } },
      { texto: "As animações e os efeitos na tela", pontos: { frontend: 3 } },
      { texto: "Se ele é rápido e nunca trava", pontos: { infra: 2, backend: 1 } },
      { texto: "Quais permissões ele pede", pontos: { seguranca: 2 } }
    ]
  },
  {
    texto: "Qual tipo de jogo mais combina com você?",
    alternativas: [
      { texto: "Construir uma cidade e fazer tudo funcionar", pontos: { backend: 2, infra: 1 } },
      { texto: "Estratégia, cheio de números e estatísticas", pontos: { dados: 3 } },
      { texto: "Mistério e investigação", pontos: { seguranca: 2, dados: 1 } },
      { texto: "Criativo, montando cenários e personagens", pontos: { frontend: 2, uiux: 1 } }
    ]
  },
  {
    texto: "No fim de semana, você prefere...",
    alternativas: [
      { texto: "Montar ou consertar alguma coisa", pontos: { infra: 3 } },
      { texto: "Criar vídeos, edits ou posts", pontos: { frontend: 2, uiux: 1 } },
      { texto: "Maratonar uma série de detetive", pontos: { seguranca: 2, dados: 1 } },
      { texto: "Planejar o rolê da galera, com horário e lista", pontos: { backend: 2 } }
    ]
  },
  {
    texto: "Um amigo pede ajuda com o celular. Qual problema você resolve melhor?",
    alternativas: [
      { texto: "Está lento e cheio: você limpa e organiza tudo", pontos: { infra: 2, backend: 1 } },
      { texto: "A conta dele foi invadida: você recupera e protege", pontos: { seguranca: 3 } },
      { texto: "Ele quer uma tela inicial mais bonita", pontos: { uiux: 2, frontend: 1 } },
      { texto: "Ele quer saber quanto tempo passa em cada app", pontos: { dados: 3 } }
    ]
  },
  {
    texto: "Se pudesse escolher um superpoder, seria...",
    alternativas: [
      { texto: "Enxergar padrões e prever o futuro", pontos: { dados: 3 } },
      { texto: "Ficar invisível e impossível de hackear", pontos: { seguranca: 2 } },
      { texto: "Criar qualquer coisa só de imaginar", pontos: { frontend: 2, uiux: 1 } },
      { texto: "Ser o cérebro que faz tudo funcionar nos bastidores", pontos: { backend: 3 } }
    ]
  }
];
