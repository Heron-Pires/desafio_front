export interface Lesson {
  id: string | number;
  title: string;
  order?: number;
}

export interface Module {
  id: string | number;
  title: string;
  lessons: Lesson[];
}

/**
 * Contrato para o endpoint GET /courses
 */
export interface CourseSummary {
  id: string | number;
  title: string;
  category: string;
  shortDescription: string;
  thumbnail: string;
  modulesCount: number;
}

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
