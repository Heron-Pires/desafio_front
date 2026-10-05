import { CourseDetail, CourseSummary } from "../types/course";

export const mockCourses: CourseSummary[] = [
  {
    id: "1",
    title: "Desenvolvimento Web Fullstack",
    category: "Programação",
    shortDescription: "Aprenda a construir aplicações modernas de ponta a ponta.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60",
    modulesCount: 2,
  },
  {
    id: "2",
    title: "Arquitetura Cloud & DevOps",
    category: "Infraestrutura",
    shortDescription: "Domine containers, CI/CD e implantação escalável em nuvem.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
    modulesCount: 2,
  },
];

export const mockCourseDetails: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    title: "Desenvolvimento Web Fullstack",
    category: "Programação",
    description: "Um curso completo abordando desde a lógica inicial até arquiteturas escaláveis em Next.js e Node.js.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60",
    modules: [
      {
        id: "m1",
        title: "Módulo 1 — Fundamentos",
        lessons: [
          { id: "l1", title: "Aula 1 — Variáveis e Tipagem" },
          { id: "l2", title: "Aula 2 — Tipos de dados e Estruturas" },
          { id: "l3", title: "Aula 3 — Operadores e Condicionais" },
        ],
      },
      {
        id: "m2",
        title: "Módulo 2 — Funções e Componentes",
        lessons: [
          { id: "l4", title: "Aula 1 — Criando funções puras" },
          { id: "l5", title: "Aula 2 — Parâmetros e Retornos" },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Arquitetura Cloud & DevOps",
    category: "Infraestrutura",
    description: "Aprenda as melhores práticas de infraestrutura como código, orquestração de containers e esteiras de integração contínua.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
    modules: [
      {
        id: "m1",
        title: "Módulo 1 — Fundamentos de Cloud",
        lessons: [
          { id: "l1", title: "Aula 1 — Introdução a Nuvem" },
          { id: "l2", title: "Aula 2 — Redes e Segurança Básica" },
        ],
      },
      {
        id: "m2",
        title: "Módulo 2 — Containers e Pipelines",
        lessons: [
          { id: "l3", title: "Aula 1 — Dockerfile e Imagens" },
          { id: "l4", title: "Aula 2 — GitHub Actions e CI/CD" },
        ],
      },
    ],
  },
};

export const mockCourseDetail: CourseDetail = mockCourseDetails["1"];

/**
 * Retorna os detalhes de um curso mockado pelo ID ou null caso não exista.
 */
export function getMockCourseById(id: string | number): CourseDetail | null {
  const cleanId = String(id).trim();
  return mockCourseDetails[cleanId] ?? null;
}
