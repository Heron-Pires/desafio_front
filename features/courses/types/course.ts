/**
 * Interfaces TypeScript para a Plataforma Comando (Arknights: Endfield Design)
 */

export type LessonStatus = "available" | "completed" | "in_progress" | "locked";

export interface Lesson {
  id: string | number;
  title: string;
  order?: number;
  status?: LessonStatus | string;
  duration?: string;
}

export interface Module {
  id: string | number;
  title: string;
  order?: number;
  lessons: Lesson[];
}

/**
 * Contrato para o endpoint GET /courses
 */
export interface Course {
  id: string | number;
  title: string;
  category: string;
  shortDescription: string;
  thumbnail: string;
  modulesCount: number;
}

/**
 * Alias para manter compatibilidade com códigos existentes
 */
export type CourseSummary = Course;

/**
 * Contrato para o endpoint GET /courses/:id
 */
export interface CourseDetail {
  id: string | number;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  modules: Module[];
}
