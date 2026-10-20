/**
 * ÁREAS: os 6 resultados possíveis do quiz.
 *
 * A chave (uiux, frontend, ...) é o nome usado nas pontuações de perguntas.js.
 * - nome:       título exibido no resultado
 * - cor:        não é mais usada pela interface (paleta única em DESIGN.md)
 * - icone:      não é mais usado pela interface
 * - descricao:  texto curto e divertido
 * - estudos:    3 coisas estudadas no curso relacionadas à área
 *               (confira com a matriz curricular do curso e ajuste se precisar)
 * - incentivo:  frase final, informativa (funções comuns na área). Sem tom motivacional: ver DESIGN.md
 *
 * A ordem das chaves também é a ordem dos selos na tela inicial.
 */
export const AREAS = {
  uiux: {
    nome: "UI/UX Design",
    cor: "#FF5CA8",
    icone: "uiux",
    descricao: "Você repara em tudo: a cor do botão, o app que confunde, a tela que podia ser mais simples. Seu superpoder é pensar em quem vai usar e deixar a tecnologia fácil e bonita para todo mundo.",
    estudos: [
      "Interação Humano-Computador",
      "Prototipação de telas e testes com usuários",
      "Acessibilidade e experiência do usuário"
    ],
    incentivo: "Funções comuns na área: designer de interface, designer de experiência e pesquisador de usabilidade."
  },
  frontend: {
    nome: "Front-end",
    cor: "#FF8A1F",
    icone: "frontend",
    descricao: "Você gosta de ver as coisas acontecerem na tela, na hora. Transformar uma ideia em algo que se toca, rola e anima é a sua praia.",
    estudos: [
      "Programação para web (HTML, CSS e JavaScript)",
      "Desenvolvimento de aplicativos",
      "Lógica de programação e algoritmos"
    ],
    incentivo: "Funções comuns na área: desenvolvedor front-end, desenvolvedor web e desenvolvedor mobile."
  },
  backend: {
    nome: "Back-end",
    cor: "#8B6CFF",
    icone: "backend",
    descricao: "Você faz a mágica acontecer nos bastidores. Ninguém vê, mas sem você nada funciona: login, mensagens, pagamentos... tudo passa por você.",
    estudos: [
      "Algoritmos e estruturas de dados",
      "Banco de dados",
      "Engenharia de software"
    ],
    incentivo: "Funções comuns na área: desenvolvedor back-end, engenheiro de software e administrador de banco de dados."
  },
  infra: {
    nome: "Infraestrutura e Redes",
    cor: "#22C7E8",
    icone: "infra",
    descricao: "Quando a internet cai, todo mundo olha para você. Você curte entender como as coisas se conectam e manter tudo no ar, rápido e funcionando.",
    estudos: [
      "Redes de computadores",
      "Sistemas operacionais",
      "Arquitetura de computadores e nuvem"
    ],
    incentivo: "Funções comuns na área: analista de redes, administrador de sistemas e engenheiro de nuvem."
  },
  dados: {
    nome: "Ciência de Dados",
    cor: "#FFD23F",
    icone: "dados",
    descricao: "Você vê padrões onde os outros veem bagunça. Números, gráficos e previsões te deixam curioso: você quer saber o porquê de tudo.",
    estudos: [
      "Estatística e probabilidade",
      "Banco de dados",
      "Inteligência artificial e análise de dados"
    ],
    incentivo: "Funções comuns na área: analista de dados, cientista de dados e engenheiro de dados."
  },
  seguranca: {
    nome: "Segurança da Informação",
    cor: "#4FD162",
    icone: "seguranca",
    descricao: "Detetive digital: você desconfia de link estranho, adora um mistério e quer proteger as pessoas. Hacker mal-intencionado que se cuide.",
    estudos: [
      "Segurança da informação",
      "Redes de computadores",
      "Ética, legislação e LGPD"
    ],
    incentivo: "Funções comuns na área: analista de segurança, analista de resposta a incidentes e auditor de sistemas."
  }
};
