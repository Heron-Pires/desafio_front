import { CourseDetail, CourseSummary } from "../types/course";

export const mockCourses: CourseSummary[] = [
  {
    id: "1",
    title: "Linguagem C",
    category: "Sistemas & Baixo Nível",
    shortDescription: "Domine a base da computação: ponteiros, alocação dinâmica, structs e sistemas de baixo nível.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 24,
    durationText: "12h",
    level: "Médio",
  },
  {
    id: "2",
    title: "Python Essencial",
    category: "Programação",
    shortDescription: "Fundamentos de Python, automação, estruturas de dados e desenvolvimento de scripts modernos.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 18,
    durationText: "9h",
    level: "Iniciante",
  },
  {
    id: "3",
    title: "Banco de Dados",
    category: "Banco de Dados",
    shortDescription: "Modelagem relacional, SQL avançado, PostgreSQL, índices e otimização de consultas.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 20,
    durationText: "10h",
    level: "Médio",
  },
  {
    id: "4",
    title: "Redes",
    category: "Infraestrutura",
    shortDescription: "Arquitetura TCP/IP, roteamento, DNS, HTTP/HTTPS, sockets e segurança de redes.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 16,
    durationText: "8h",
    level: "Médio",
  },
  {
    id: "5",
    title: "Linux e Shell",
    category: "Sistemas",
    shortDescription: "Administração de sistemas Linux, Bash scripting, permissões, processos e automação.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 14,
    durationText: "7h",
    level: "Iniciante",
  },
  {
    id: "6",
    title: "Git e GitHub",
    category: "Ferramentas",
    shortDescription: "Controle de versão profissional, branching, rebase, pull requests e GitHub Actions.",
    thumbnail: "",
    modulesCount: 2,
    lessonsCount: 10,
    durationText: "5h",
    level: "Iniciante",
  },
  {
    id: "7",
    title: "Algoritmos",
    category: "Ciência da Computação",
    shortDescription: "Estruturas de dados avançadas, complexidade Big-O, grafos, recursão e algoritmos de ordenação.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 22,
    durationText: "11h",
    level: "Avançado",
  },
  {
    id: "8",
    title: "Segurança",
    category: "Segurança",
    shortDescription: "Fundamentos de cibersegurança, criptografia, análise de vulnerabilidades e OWASP Top 10.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 15,
    durationText: "8h",
    level: "Médio",
  },
];

export const mockCourseDetails: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    title: "Linguagem C",
    subtitle: "Linguagem C",
    category: "Sistemas & Baixo Nível",
    description:
      "A Linguagem C é a espinha dorsal da engenharia de software de alta performance, sistemas operacionais e computação embarcada. Neste curso você vai do primeiro algoritmo até a manipulação estrita de memória com ponteiros, estruturas de dados complexas e compilação modular profissional com GCC.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 24,
    durationText: "12h",
    level: "Médio",
    previewDuration: "03:45",
    features: [
      "24 aulas práticas em vídeo (1080p)",
      "4 projetos práticos no portfólio",
      "Código-fonte completo no GitHub",
      "Suporte técnico e dúvidas na comunidade",
      "Certificado digital verificado",
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Fundamentos & Sintaxe Essencial",
        lessons: [
          {
            id: "l1",
            title: "01. Setup de Compilador GCC e Primeiro Programa em C",
            duration: 15,
            durationFormatted: "15:30",
            instructor: "Henrique Silva",
            level: "Médio",
            codeSnippet: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Bem-vindo ao curso de C!\\n");
    return 0;
}`,
            overview:
              "Nesta primeira aula vamos preparar o seu ambiente de desenvolvimento para programar em C, instalando o compilador GCC no Linux/WSL (ou MinGW/Clang), configurando o editor e entendendo como o código é compilado, ligado e executado na máquina real.",
            fundamentalConcepts: [
              "Estrutura de um fonte C, headers (#include <stdio.h>), compilação, montagem e linking.",
              "Execução do primeiro binário gerado pelo GCC, entendendo standard output e códigos de retorno.",
              "Compilando pela linha de comando com flags recomendadas: gcc -Wall -Wextra main.c -o main",
            ],
            terminalExecution:
              "$ gcc -Wall -Wextra main.c -o programa && ./programa\nBem-vindo ao curso de C!",
          },
          {
            id: "l2",
            title: "02. Tipos de Dados Primitivos, Modificadores e Variáveis",
            duration: 18,
            durationFormatted: "18:20",
            instructor: "Henrique Silva",
            level: "Médio",
            codeSnippet: `#include <stdio.h>

int main() {
    int idade = 25;
    double salario = 4500.50;
    char inicial = 'C';
    printf("Idade: %d, Salário: %.2f, Letra: %c\\n", idade, salario, inicial);
    return 0;
}`,
            overview:
              "Compreenda como o compilador aloca bytes na stack para tipos primitivos (int, float, double, char), os modificadores de sinal e tamanho (signed, unsigned, short, long) e o tamanho em bytes de cada tipo com sizeof.",
            fundamentalConcepts: [
              "Representação binária, inteiros signed e unsigned.",
              "Ponto flutuante IEEE-754 e precisão simples vs dupla.",
              "Operador sizeof e declaração correta de variáveis.",
            ],
            terminalExecution:
              "$ gcc tipos.c -o tipos && ./tipos\nIdade: 25, Salário: 4500.50, Letra: C",
          },
          {
            id: "l3",
            title: "03. Operadores Aritméticos, Lógicos e Condicionais",
            duration: 22,
            durationFormatted: "22:45",
            instructor: "Henrique Silva",
            level: "Médio",
            codeSnippet: `#include <stdio.h>

int main() {
    int score = 85;
    if (score >= 70 && score <= 100) {
        printf("Aprovado com sucesso!\\n");
    } else {
        printf("Reprovado.\\n");
    }
    return 0;
}`,
            overview:
              "Domine os operadores em nível de instrução, curto-circuito em expressões lógicas e controle de fluxo condicional com if, else e switch-case.",
            fundamentalConcepts: [
              "Precedência e associatividade de operadores.",
              "Avaliação de curto-circuito em && e ||.",
              "Tabela de saltos em switch statements.",
            ],
            terminalExecution:
              "$ gcc cond.c -o cond && ./cond\nAprovado com sucesso!",
          },
          {
            id: "l4",
            title: "04. Estruturas de Repetição (for, while, do-while)",
            duration: 25,
            durationFormatted: "25:10",
            instructor: "Henrique Silva",
            level: "Médio",
            codeSnippet: `#include <stdio.h>

int main() {
    for (int i = 0; i < 5; i++) {
        printf("Iteração %d\\n", i);
    }
    return 0;
}`,
            overview:
              "Entenda a tradução de loops para código assembly, otimizações do compilador (loop unrolling) e quando aplicar for, while e do-while.",
            fundamentalConcepts: [
              "Condição de teste e incremento no pipeline do processador.",
              "Palavras-chave break e continue.",
              "Evitando laços infinitos e condições de parada seguras.",
            ],
            terminalExecution:
              "$ gcc loops.c -o loops && ./loops\nIteração 0\nIteração 1\nIteração 2\nIteração 3\nIteração 4",
          },
        ],
      },
      {
        id: "m2",
        title: "Módulo 2: Ponteiros & Gerenciamento de Memória",
        lessons: [
          {
            id: "l5",
            title: "05. Introdução a Ponteiros e Endereçamento de Memória",
            duration: 20,
            durationFormatted: "20:15",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l6",
            title: "06. Aritmética de Ponteiros e Arrays",
            duration: 24,
            durationFormatted: "24:00",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l7",
            title: "07. Alocação Dinâmica com malloc, calloc e free",
            duration: 28,
            durationFormatted: "28:30",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l8",
            title: "08. Ponteiros para Ponteiros e Matrizes Dinâmicas",
            duration: 19,
            durationFormatted: "19:40",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l9",
            title: "09. Ponteiros para Funções e Callbacks",
            duration: 21,
            durationFormatted: "21:10",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l10",
            title: "10. Prevenção de Memory Leaks com Valgrind",
            duration: 26,
            durationFormatted: "26:50",
            instructor: "Henrique Silva",
            level: "Médio",
          },
        ],
      },
      {
        id: "m3",
        title: "Módulo 3: Structs, Unions & Arquivos",
        lessons: [
          {
            id: "l11",
            title: "11. Estruturas Heterogêneas (structs) e typedef",
            duration: 18,
            durationFormatted: "18:00",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l12",
            title: "12. Alinhamento de Memória e Padding",
            duration: 16,
            durationFormatted: "16:30",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l13",
            title: "13. Unions e Bitfields para Otimização",
            duration: 20,
            durationFormatted: "20:45",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l14",
            title: "14. Entrada e Saída de Dados com Arquivos em C",
            duration: 25,
            durationFormatted: "25:20",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l15",
            title: "15. Manipulação de Arquivos Binários",
            duration: 22,
            durationFormatted: "22:15",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l16",
            title: "16. Tratamento de Erros e errno em C",
            duration: 17,
            durationFormatted: "17:40",
            instructor: "Henrique Silva",
            level: "Médio",
          },
        ],
      },
      {
        id: "m4",
        title: "Módulo 4: Projeto Prático & Otimização",
        lessons: [
          {
            id: "l17",
            title: "17. Arquitetura Modular e Headers (.h e .c)",
            duration: 23,
            durationFormatted: "23:10",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l18",
            title: "18. Makefile e Automação de Build",
            duration: 27,
            durationFormatted: "27:00",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l19",
            title: "19. Implementação de Lista Encadeada Genérica",
            duration: 32,
            durationFormatted: "32:15",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l20",
            title: "20. Implementação de Hash Table de Alta Performance",
            duration: 35,
            durationFormatted: "35:40",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l21",
            title: "21. Profiling com gprof e Otimização",
            duration: 29,
            durationFormatted: "29:30",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l22",
            title: "22. Programação Concorrente com POSIX Threads",
            duration: 31,
            durationFormatted: "31:00",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l23",
            title: "23. Sockets de Rede em C: Servidor TCP",
            duration: 34,
            durationFormatted: "34:20",
            instructor: "Henrique Silva",
            level: "Médio",
          },
          {
            id: "l24",
            title: "24. Conclusão do Projeto e Boas Práticas",
            duration: 18,
            durationFormatted: "18:50",
            instructor: "Henrique Silva",
            level: "Médio",
          },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Python Essencial",
    subtitle: "Python Moderno: Do Script à Produção",
    category: "Programação",
    description:
      "Aprenda Python com ênfase em automação, manipulação de dados e boas práticas da linguagem moderna. Domine tipagem estática opcional, geradores, decoradores e bibliotecas essenciais.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 18,
    durationText: "9h",
    level: "Iniciante",
    previewDuration: "02:50",
    features: [
      "18 aulas práticas em vídeo",
      "Projetos práticos e automações",
      "Código no GitHub",
      "Certificado de Conclusão",
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Fundamentos de Python",
        lessons: [
          {
            id: "l1",
            title: "01. Sintaxe Básica e Ambientes Virtuais",
            duration: 15,
            durationFormatted: "15:00",
            instructor: "Ana Paula",
            level: "Iniciante",
          },
          {
            id: "l2",
            title: "02. Estruturas de Dados: Listas, Dicionários e Sets",
            duration: 20,
            durationFormatted: "20:00",
            instructor: "Ana Paula",
            level: "Iniciante",
          },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Banco de Dados",
    subtitle: "PostgreSQL & Modelagem Relacional",
    category: "Banco de Dados",
    description:
      "Modelagem relacional de bancos de dados modernos, SQL avançado, índices B-Tree, transações ACID e consultas otimizadas para alto volume com PostgreSQL.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 20,
    durationText: "10h",
    level: "Médio",
    previewDuration: "04:10",
    features: [
      "20 aulas práticas",
      "Laboratório com PostgreSQL real",
      "Exercícios de SQL avançado",
      "Certificado Verificado",
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Modelagem Relacional",
        lessons: [
          {
            id: "l1",
            title: "01. Normalização e Diagrama ER",
            duration: 25,
            durationFormatted: "25:00",
            instructor: "Carlos Eduardo",
            level: "Médio",
          },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    title: "Redes",
    subtitle: "Redes de Computadores & Protocolos de Comunicação",
    category: "Infraestrutura",
    description:
      "Entenda a fundo a pilha TCP/IP, roteamento, resolução DNS, funcionamento de HTTP/2 e HTTP/3, além de captura de pacotes com Wireshark.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 16,
    durationText: "8h",
    level: "Médio",
    previewDuration: "03:15",
    features: [
      "16 aulas práticas",
      "Laboratórios práticos de rede",
      "Análise de tráfego com Wireshark",
    ],
    modules: [],
  },
  "5": {
    id: "5",
    title: "Linux e Shell",
    subtitle: "Administração Linux & Shell Scripting",
    category: "Sistemas",
    description:
      "Domine o terminal Linux, automações em Bash, gerenciamento de permissões, usuários, systemd e processos em segundo plano.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 14,
    durationText: "7h",
    level: "Iniciante",
    modules: [],
  },
  "6": {
    id: "6",
    title: "Git e GitHub",
    subtitle: "Controle de Versão Profissional",
    category: "Ferramentas",
    description:
      "Fluxo de trabalho profissional com Git: branches, merges, rebase interativo, cherry-pick e resolução de conflitos em equipe.",
    thumbnail: "",
    modulesCount: 2,
    lessonsCount: 10,
    durationText: "5h",
    level: "Iniciante",
    modules: [],
  },
  "7": {
    id: "7",
    title: "Algoritmos",
    subtitle: "Estruturas de Dados & Análise Assintótica",
    category: "Ciência da Computação",
    description:
      "Aprofunde-se em análise de complexidade Big-O, recursão, árvores binárias, grafos e algoritmos clássicos de busca e ordenação.",
    thumbnail: "",
    modulesCount: 4,
    lessonsCount: 22,
    durationText: "11h",
    level: "Avançado",
    modules: [],
  },
  "8": {
    id: "8",
    title: "Segurança",
    subtitle: "Fundamentos de Segurança Ofensiva e Defensiva",
    category: "Segurança",
    description:
      "Princípios de segurança da informação, conceitos de criptografia simétrica e assimétrica, e prevenção contra vulnerabilidades web OWASP Top 10.",
    thumbnail: "",
    modulesCount: 3,
    lessonsCount: 15,
    durationText: "8h",
    level: "Médio",
    modules: [],
  },
};

export const mockCourseDetail: CourseDetail = mockCourseDetails["1"];

/**
 * Retorna os detalhes de um curso mockado pelo ID ou null caso não exista.
 */
export function getMockCourseById(id: string | number): CourseDetail | null {
  const cleanId = String(id).trim();
  return (
    mockCourseDetails[cleanId] ??
    mockCourseDetails["1"] ??
    null
  );
}
