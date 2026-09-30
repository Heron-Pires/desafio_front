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
];

export const mockCourseDetail: CourseDetail = {
  id: "1",
  title: "Desenvolvimento Web Fullstack",
  category: "Programação",
  description: "Um curso completo abordando desde a lógica inicial até arquiteturas escaláveis.",
  thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60",
  modules: [
    {
      id: "m1",
      title: "Módulo 1 - Fundamentos",
      lessons: [
        { id: "l1", title: "Aula 1 - Variáveis" },
        { id: "l2", title: "Aula 2 - Tipos de dados" },
        { id: "l3", title: "Aula 3 - Operadores" },
      ],
    },
    {
      id: "m2",
      title: "Módulo 2 - Funções",
      lessons: [
        { id: "l4", title: "Aula 1 - Criando funções" },
        { id: "l5", title: "Aula 2 - Parâmetros" },
      ],
    },
  ],
};
