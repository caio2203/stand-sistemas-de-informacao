/**
 * TRECHOS DE CÓDIGO (conteúdo editável)
 *
 * Cada trecho tem:
 * - nivel:       "facil", "medio" ou "dificil"
 * - linhas:      de 3 a 6 linhas de Python (use espaços para o recuo)
 * - linhaErrada: número da linha com o erro, contando a partir de 1
 * - explicacao:  uma frase explicando o erro (aparece depois de confirmar)
 *
 * Campos opcionais (a interface esconde o que faltar):
 * - tipo:        categoria do erro em texto curto (ex.: "limite do range (off-by-one)")
 * - dica:        pista mostrada só se o jogador pedir
 * - correcao:    a linha errada já corrigida (aparece no diff)
 *
 * Obs.: Python não usa ponto e vírgula. O equivalente "esquecido" aqui
 * são os dois-pontos (:) no fim do if/for/while.
 *
 * O teste automático (npm test) confere se todos os trechos estão válidos.
 */
export const TRECHOS = [
  /* ---------------- FÁCIL ---------------- */
  {
    nivel: "facil",
    linhas: [
      'idade = 16',
      'if idade >= 15',
      '    print("Pode entrar!")'
    ],
    linhaErrada: 2,
    explicacao: "Faltaram os dois-pontos (:) no final da linha do if.",
    tipo: "dois-pontos ausentes (sintaxe)",
    dica: "Compare a linha do if com a forma: if condição:",
    correcao: "if idade >= 15:"
  },
  {
    nivel: "facil",
    linhas: [
      'nome = "Ana',
      'curso = "Sistemas de Informação"',
      'print(nome, "estuda", curso)'
    ],
    linhaErrada: 1,
    explicacao: "As aspas do texto \"Ana\" foram abertas, mas nunca fechadas.",
    tipo: "string não fechada (sintaxe)",
    dica: "Todo texto entre aspas precisa abrir e fechar.",
    correcao: 'nome = "Ana"'
  },
  {
    nivel: "facil",
    linhas: [
      'pontos = 10',
      'pontos = pontos + 5',
      'print(pontso)'
    ],
    linhaErrada: 3,
    explicacao: "A variável se chama pontos, mas foi escrita pontso.",
    tipo: "variável inexistente (nome)",
    dica: "Confira se cada nome usado foi criado antes, com a mesma grafia.",
    correcao: "print(pontos)"
  },
  {
    nivel: "facil",
    linhas: [
      'x = 3',
      'y = 4',
      'prnt(x + y)'
    ],
    linhaErrada: 3,
    explicacao: "O comando para mostrar na tela é print, não prnt.",
    tipo: "função inexistente (nome)",
    dica: "Confira o nome da função que mostra texto na tela.",
    correcao: "print(x + y)"
  },
  {
    nivel: "facil",
    linhas: [
      'cidade = "Salvador"',
      'print("Eu moro em", cidade',
      'print("Fim!")'
    ],
    linhaErrada: 2,
    explicacao: "O parêntese do print foi aberto e não foi fechado.",
    tipo: "parêntese não fechado (sintaxe)",
    dica: "Conte os parênteses abertos e fechados em cada linha.",
    correcao: 'print("Eu moro em", cidade)'
  },

  /* ---------------- MÉDIO ---------------- */
  {
    nivel: "medio",
    linhas: [
      'nota = 8',
      'if nota < 6:',
      '    print("Aprovado!")',
      'else:',
      '    print("Recuperação")'
    ],
    linhaErrada: 2,
    explicacao: "A condição está invertida: para aprovar deveria ser nota >= 6.",
    tipo: "condição invertida (lógica)",
    dica: "Leia a condição e compare com a mensagem que ela imprime.",
    correcao: "if nota >= 6:"
  },
  {
    nivel: "medio",
    linhas: [
      'frutas = ["maçã", "banana", "uva"]',
      'primeira = frutas[1]',
      'print("A primeira fruta é", primeira)'
    ],
    linhaErrada: 2,
    explicacao: "Listas começam no índice 0, então a primeira fruta é frutas[0].",
    tipo: "deslocado em um (índice)",
    dica: "Em Python, qual é o índice do primeiro item de uma lista?",
    correcao: "primeira = frutas[0]"
  },
  {
    nivel: "medio",
    linhas: [
      'idade = 17',
      'texto = "Tenho " + idade + " anos"',
      'print(texto)'
    ],
    linhaErrada: 2,
    explicacao: "Não dá para somar texto com número: precisa usar str(idade).",
    tipo: "texto somado com número (tipo)",
    dica: "Veja o tipo de cada valor que está sendo somado.",
    correcao: 'texto = "Tenho " + str(idade) + " anos"'
  },
  {
    nivel: "medio",
    linhas: [
      'for i in range(3):',
      'print("Volta", i)',
      'print("Acabou!")'
    ],
    linhaErrada: 2,
    explicacao: "O que fica dentro do for precisa estar recuado (com espaços na frente).",
    tipo: "recuo ausente (sintaxe)",
    dica: "Em Python, o recuo indica o que está dentro do for.",
    correcao: '    print("Volta", i)'
  },
  {
    nivel: "medio",
    linhas: [
      'senha = "1234"',
      'if senha = "1234":',
      '    print("Acesso liberado")'
    ],
    linhaErrada: 2,
    explicacao: "Para comparar usamos == (dois iguais); um só = serve para guardar valor.",
    tipo: "atribuição no lugar de comparação (sintaxe)",
    dica: "Qual operador compara dois valores?",
    correcao: 'if senha == "1234":'
  },

  /* ---------------- DIFÍCIL ---------------- */
  {
    nivel: "dificil",
    linhas: [
      '# mostrar os números de 1 a 5',
      'for n in range(1, 5):',
      '    print(n)'
    ],
    linhaErrada: 2,
    explicacao: "range(1, 5) para no 4; para chegar ao 5 seria range(1, 6).",
    tipo: "limite do range (off-by-one)",
    dica: "O segundo número do range entra ou não na contagem?",
    correcao: "for n in range(1, 6):"
  },
  {
    nivel: "dificil",
    linhas: [
      'nomes = ["Lia", "Davi", "Rui"]',
      'ultimo = nomes[len(nomes)]',
      'print("O último é", ultimo)'
    ],
    linhaErrada: 2,
    explicacao: "len(nomes) é 3, mas o último índice é 2: o certo é nomes[len(nomes) - 1].",
    tipo: "índice fora da lista (off-by-one)",
    dica: "Uma lista com 3 itens tem índices 0, 1 e 2.",
    correcao: "ultimo = nomes[len(nomes) - 1]"
  },
  {
    nivel: "dificil",
    linhas: [
      'total = 0',
      'for preco in [5, 10, 15]:',
      '    total = preco',
      'print("Total:", total)'
    ],
    linhaErrada: 3,
    explicacao: "O total é substituído a cada volta; o certo é total = total + preco.",
    tipo: "acumulador sobrescrito (lógica)",
    dica: "O que acontece com o valor anterior de total a cada volta?",
    correcao: "    total = total + preco"
  },
  {
    nivel: "dificil",
    linhas: [
      'contador = 0',
      'while contador < 3:',
      '    print(contador)',
      '    contador = contador - 1'
    ],
    linhaErrada: 4,
    explicacao: "O contador diminui e nunca chega a 3: o laço fica infinito. Deveria somar 1.",
    tipo: "laço infinito (lógica)",
    dica: "Em que momento a condição do while fica falsa?",
    correcao: "    contador = contador + 1"
  },
  {
    nivel: "dificil",
    linhas: [
      'idade = 16',
      'tem_autorizacao = True',
      '# entra quem tem 18 anos OU autorização',
      'if idade >= 18 and tem_autorizacao:',
      '    print("Pode entrar")'
    ],
    linhaErrada: 4,
    explicacao: "O comentário diz OU, então o certo é usar or em vez de and.",
    tipo: "operador errado (lógica)",
    dica: "Compare o operador da condição com o que o comentário descreve.",
    correcao: "if idade >= 18 or tem_autorizacao:"
  }
];
