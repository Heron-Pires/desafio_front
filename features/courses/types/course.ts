export interface Lesson {
  id: string | number;
  moduleId?: string | number;
  title: string;
  description?: string | null;
  duration?: number;
  durationFormatted?: string;
  order?: number;
  position?: number;
  videoUrl?: string | null;
  completed?: boolean;
  instructor?: string;
  level?: string;
  codeSnippet?: string;
  overview?: string;
  fundamentalConcepts?: string[];
  terminalExecution?: string;
  thumbnail?: string | null;
}

export interface Module {
  id: string | number;
  courseId?: string | number;
  title: string;
  order?: number;
  position?: number;
  lessons: Lesson[];
}

/**
 * Contrato para o endpoint GET /courses
 */
export interface CourseSummary {
  id: string | number;
  title: string;
  category?: string;
  shortDescription?: string;
  thumbnail?: string;
  modulesCount?: number;
  lessonsCount?: number;
  durationText?: string;
  level?: string;
}

/**
 * Contrato para o endpoint GET /courses/:id
 */
export interface CourseDetail {
  id: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  modulesCount?: number;
  lessonsCount?: number;
  durationText?: string;
  level?: string;
  previewDuration?: string;
  features?: string[];
  modules: Module[];
}

export type Course = CourseDetail;

export interface CreateLessonDTO {
  moduleId: number;
  title: string;
  duration: number;
  description?: string;
  position?: number;
  order?: number;
  videoUrl?: string;
}

export interface UpdateLessonDTO {
  moduleId?: number;
  title?: string;
  duration?: number;
  description?: string;
  position?: number;
  order?: number;
  videoUrl?: string;
}

export interface CreateCourseDTO {
  title: string;
  category?: string;
  description?: string;
  thumbnail?: string | File | null;
  level?: string;
}

export interface UpdateCourseDTO {
  title?: string;
  category?: string;
  description?: string;
  thumbnail?: string | File | null;
  level?: string;
}
