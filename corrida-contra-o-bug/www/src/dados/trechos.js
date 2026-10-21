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
  {
    nivel: "facil",
    linhas: [
      'nome = "Bia"',
      'Print("Olá,", nome)',
      'print("Bem-vinda")'
    ],
    linhaErrada: 2,
    explicacao: "Python diferencia maiúsculas de minúsculas: o comando é print, tudo minúsculo.",
    tipo: "maiúscula no nome da função (nome)",
    dica: "Compare a linha 2 com a linha 3, letra por letra.",
    correcao: 'print("Olá,", nome)'
  },
  {
    nivel: "facil",
    linhas: [
      'cores = ["azul", "verde", "roxo"',
      'print(cores)',
      'print(len(cores))'
    ],
    linhaErrada: 1,
    explicacao: "O colchete da lista foi aberto, mas não foi fechado.",
    tipo: "colchete não fechado (sintaxe)",
    dica: "Toda lista abre com [ e fecha com ].",
    correcao: 'cores = ["azul", "verde", "roxo"]'
  },
  {
    nivel: "facil",
    linhas: [
      'hora = 8',
      'print(\'Bom dia")',
      'print("São", hora, "horas")'
    ],
    linhaErrada: 2,
    explicacao: "O texto abre com aspas simples e fecha com aspas duplas: as duas precisam ser iguais.",
    tipo: "aspas trocadas (sintaxe)",
    dica: "Olhe com atenção as aspas do começo e do fim de cada texto.",
    correcao: 'print("Bom dia")'
  },
  {
    nivel: "facil",
    linhas: [
      'chuva = True',
      'if chuva:',
      '    print("Leve o guarda-chuva")',
      'esle:',
      '    print("Pode sair sem")'
    ],
    linhaErrada: 4,
    explicacao: "A palavra certa é else; esle não existe em Python.",
    tipo: "palavra-chave escrita errada (sintaxe)",
    dica: "Leia devagar cada palavra que não está entre aspas.",
    correcao: "else:"
  },
  {
    nivel: "facil",
    linhas: [
      'idade = 15',
      'cidade = "Feira de Santana"',
      'print("Tenho", idade "anos")'
    ],
    linhaErrada: 3,
    explicacao: "Faltou a vírgula entre idade e \"anos\" dentro do print.",
    tipo: "vírgula faltando (sintaxe)",
    dica: "No print, cada valor é separado do próximo por vírgula.",
    correcao: 'print("Tenho", idade, "anos")'
  },
  {
    nivel: "facil",
    linhas: [
      'ligado = true',
      'if ligado:',
      '    print("Lâmpada acesa")'
    ],
    linhaErrada: 1,
    explicacao: "Em Python, verdadeiro se escreve True, com T maiúsculo.",
    tipo: "True com letra minúscula (nome)",
    dica: "Verdadeiro e falso em Python começam com letra maiúscula.",
    correcao: "ligado = True"
  },
  {
    nivel: "facil",
    linhas: [
      'def saudar:',
      '    print("Olá")',
      'saudar()'
    ],
    linhaErrada: 1,
    explicacao: "Toda função precisa de parênteses depois do nome, mesmo sem receber nada: def saudar():",
    tipo: "parênteses ausentes na função (sintaxe)",
    dica: "Compare como a função é criada e como ela é chamada.",
    correcao: "def saudar():"
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
  {
    nivel: "medio",
    linhas: [
      'numero = 8',
      'if numero / 2 == 0:',
      '    print("Par")',
      'else:',
      '    print("Ímpar")'
    ],
    linhaErrada: 2,
    explicacao: "Para saber se é par, olhamos o resto da divisão: numero % 2 == 0. A barra / faz a divisão comum.",
    tipo: "divisão no lugar do resto (lógica)",
    dica: "Qual operador devolve o resto de uma divisão?",
    correcao: "if numero % 2 == 0:"
  },
  {
    nivel: "medio",
    linhas: [
      'nome = "carla"',
      'grito = nome.upper',
      'print(grito)'
    ],
    linhaErrada: 2,
    explicacao: "Sem os parênteses, o upper não é executado: o certo é nome.upper().",
    tipo: "método sem parênteses (chamada)",
    dica: "Como se executa uma função ou um método em Python?",
    correcao: "grito = nome.upper()"
  },
  {
    nivel: "medio",
    linhas: [
      'nota1 = 8',
      'nota2 = 6',
      'media = nota1 + nota2 / 2',
      'print("Média:", media)'
    ],
    linhaErrada: 3,
    explicacao: "A divisão é feita antes da soma, então o resultado dá 11. O certo é (nota1 + nota2) / 2.",
    tipo: "precedência de operadores (lógica)",
    dica: "Quem é calculado primeiro: a soma ou a divisão?",
    correcao: "media = (nota1 + nota2) / 2"
  },
  {
    nivel: "medio",
    linhas: [
      'def dobro(n):',
      '    resultado = n * 2',
      'x = dobro(5)',
      'print(x)'
    ],
    linhaErrada: 2,
    explicacao: "A função calcula o valor, mas não o devolve; sem return, x recebe None.",
    tipo: "função sem return (lógica)",
    dica: "O que a função entrega para quem a chamou?",
    correcao: "    return n * 2"
  },
  {
    nivel: "medio",
    linhas: [
      '# mostrar de 1 a 5',
      'contador = 1',
      'while contador > 5:',
      '    print(contador)',
      '    contador = contador + 1'
    ],
    linhaErrada: 3,
    explicacao: "O contador começa em 1, então contador > 5 já é falso e o laço nem começa. O certo é contador <= 5.",
    tipo: "condição do laço invertida (lógica)",
    dica: "A condição do while é verdadeira logo na primeira volta?",
    correcao: "while contador <= 5:"
  },
  {
    nivel: "medio",
    linhas: [
      'fatias = 8',
      'pessoas = 3',
      'cada_um = fatias / pessoas',
      'print("Cada um:", cada_um, "fatias inteiras")'
    ],
    linhaErrada: 3,
    explicacao: "A barra / dá 2.666...; para ficar só com a parte inteira, o certo é //.",
    tipo: "divisão com casas decimais (lógica)",
    dica: "Qual operador divide e descarta a parte quebrada?",
    correcao: "cada_um = fatias // pessoas"
  },
  {
    nivel: "medio",
    linhas: [
      'nomes = ["Ana", "Leo", "Bia"]',
      'for i in range(nomes):',
      '    print(nomes[i])'
    ],
    linhaErrada: 2,
    explicacao: "range precisa de um número, não de uma lista: o certo é range(len(nomes)).",
    tipo: "range com lista (tipo)",
    dica: "O range conta até um número. Quantos itens a lista tem?",
    correcao: "for i in range(len(nomes)):"
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
  },
  {
    nivel: "dificil",
    linhas: [
      'numeros = [1, 2, 3]',
      'numeros = numeros.append(4)',
      'print(numeros)'
    ],
    linhaErrada: 2,
    explicacao: "append muda a lista e devolve None; guardar o resultado apaga a lista. Basta numeros.append(4).",
    tipo: "resultado do append guardado (lógica)",
    dica: "O que o append devolve depois de adicionar o item?",
    correcao: "numeros.append(4)"
  },
  {
    nivel: "dificil",
    linhas: [
      'nome = "pedro"',
      'nome[0] = "P"',
      'print(nome)'
    ],
    linhaErrada: 2,
    explicacao: "Texto em Python não pode ser alterado letra por letra; é preciso criar um novo: \"P\" + nome[1:].",
    tipo: "texto não pode ser alterado (tipo)",
    dica: "Dá para trocar uma letra de um texto que já foi criado?",
    correcao: 'nome = "P" + nome[1:]'
  },
  {
    nivel: "dificil",
    linhas: [
      'original = [1, 2, 3]',
      'copia = original',
      'copia.append(4)',
      'print(original)  # deveria mostrar [1, 2, 3]'
    ],
    linhaErrada: 2,
    explicacao: "copia = original não copia a lista: as duas variáveis apontam para a mesma. O certo é original.copy().",
    tipo: "cópia que não copia (referência)",
    dica: "Depois da linha 2, existem duas listas ou uma só?",
    correcao: "copia = original.copy()"
  },
  {
    nivel: "dificil",
    linhas: [
      'def somar(numeros):',
      '    total = 0',
      '    for n in numeros:',
      '        total = total + n',
      '        return total',
      'print(somar([1, 2, 3]))'
    ],
    linhaErrada: 5,
    explicacao: "O return está dentro do for, então a função sai na primeira volta e devolve 1. Ele deve ficar fora do laço.",
    tipo: "return dentro do laço (lógica)",
    dica: "Quantas voltas o for dá antes do return?",
    correcao: "    return total"
  },
  {
    nivel: "dificil",
    linhas: [
      'opcao = 5',
      'if opcao == 1 or 2:',
      '    print("Opção válida")',
      'else:',
      '    print("Opção inválida")'
    ],
    linhaErrada: 2,
    explicacao: "O \"or 2\" sozinho é sempre verdadeiro, então qualquer opção passa. O certo é opcao == 1 or opcao == 2.",
    tipo: "comparação incompleta no or (lógica)",
    dica: "O que o Python entende por \"or 2\" sem comparar com nada?",
    correcao: "if opcao == 1 or opcao == 2:"
  },
  {
    nivel: "dificil",
    linhas: [
      'precos = [10, 20, 30]',
      'total = 0',
      'for i in range(len(precos) - 1):',
      '    total = total + precos[i]',
      'print("Total:", total)'
    ],
    linhaErrada: 3,
    explicacao: "range(len(precos) - 1) vai só até o índice 1 e esquece o último preço. O certo é range(len(precos)).",
    tipo: "último item esquecido (off-by-one)",
    dica: "Quantas voltas esse range dá para uma lista de 3 itens?",
    correcao: "for i in range(len(precos)):"
  },
  {
    nivel: "dificil",
    linhas: [
      'temperaturas = [-5, -2, -8]',
      'maior = 0',
      'for t in temperaturas:',
      '    if t > maior:',
      '        maior = t',
      'print("Maior:", maior)'
    ],
    linhaErrada: 2,
    explicacao: "Começando em 0, nenhuma temperatura negativa é maior e o resultado fica 0. O certo é começar com temperaturas[0].",
    tipo: "valor inicial errado (lógica)",
    dica: "E se todos os valores da lista forem negativos?",
    correcao: "maior = temperaturas[0]"
  }
];
