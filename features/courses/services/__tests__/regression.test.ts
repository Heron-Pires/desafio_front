import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { coursesService } from "../courses.service";
import { lessonsService } from "../lessons.service";
import { mockCourses } from "../courses.mock";
import { apiClient } from "@/services/api";
import { CreateCourseDTO } from "../../types/course";
import * as coursesPage from "@/app/courses/page";
import * as homePage from "@/app/page";

describe("Testes de Regressão - Persistência do Banco e Prevenção do Bug do F5", () => {
  let postMock: ReturnType<typeof mock.method>;
  let getMock: ReturnType<typeof mock.method>;
  let putMock: ReturnType<typeof mock.method>;
  let deleteMock: ReturnType<typeof mock.method>;

  beforeEach(() => {
    postMock = mock.method(apiClient, "post");
    getMock = mock.method(apiClient, "get");
    putMock = mock.method(apiClient, "put");
    deleteMock = mock.method(apiClient, "delete");
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe("Causa Raiz 1: Não mascarar falhas de API com mock em memória volátil", () => {
    it("REGRESSÃO: falha na criação do curso NÃO deve poluir mockCourses em memória nem reportar falso sucesso", async () => {
      const initialMockCount = mockCourses.length;

      postMock.mock.mockImplementation(async () => {
        throw new Error("Erro de conexão com o banco PostgreSQL");
      });

      // A tentativa de criação deve estritamente rejeitar
      await assert.rejects(
        async () => {
          await coursesService.create({
            title: "Curso que Não Deve Ficar Fantasma",
            category: "DevOps",
            description: "Este curso nunca deve ir para a memória volátil",
            thumbnail: "https://exemplo.com/thumb.jpg",
          });
        },
        {
          name: "Error",
          message: "Erro de conexão com o banco PostgreSQL",
        }
      );

      // Garante que o mockCourses NÃO foi poluído
      assert.equal(
        mockCourses.length,
        initialMockCount,
        "mockCourses não pode ser alterado quando a API falha"
      );
      const foundInMock = mockCourses.some(
        (c) => c.title === "Curso que Não Deve Ficar Fantasma"
      );
      assert.equal(
        foundInMock,
        false,
        "Curso fantasma não deve existir no array em memória"
      );
    });

    it("REGRESSÃO: falha na criação de aula/vídeo NÃO deve reportar falso sucesso nem salvar em memória", async () => {
      postMock.mock.mockImplementation(async () => {
        throw new Error("Falha no serviço de aulas");
      });

      await assert.rejects(
        async () => {
          await lessonsService.create({
            title: "Aula Fantasma",
            moduleId: "mod-1",
            courseId: "course-1",
            videoUrl: "https://video.com/1",
          });
        },
        {
          name: "Error",
          message: "Falha no serviço de aulas",
        }
      );
    });
  });

  describe("Causa Raiz 2: Persistência real e integridade ao recarregar (F5)", () => {
    it("REGRESSÃO: curso criado com sucesso deve ser recuperado dinamicamente no getAll (simulando F5)", async () => {
      const createdId = "course-db-123";
      const newCoursePayload: CreateCourseDTO = {
        title: "Arquitetura com Docker e PostgreSQL",
        category: "Infraestrutura",
        description: "Persistência real no banco",
        thumbnail: "https://exemplo.com/docker.png",
      };

      // 1. Simula o backend retornando o curso criado e salvo no PostgreSQL
      postMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses");
        const payload = data as CreateCourseDTO;
        assert.equal(payload.title, newCoursePayload.title);
        return {
          status: 201,
          data: {
            id: createdId,
            title: payload.title,
            category: payload.category,
            description: payload.description,
            thumbnail: payload.thumbnail,
            modulesCount: 0,
          },
        };
      });

      const created = await coursesService.create(newCoursePayload);
      assert.equal(created.id, createdId);
      assert.equal(created.title, newCoursePayload.title);

      // 2. Simula o F5 na tela: a página recarrega e invoca getAll()
      // O backend responde com a lista atualizada do banco contendo o novo curso
      const backendCoursesList = [
        {
          id: "1",
          title: "Curso Existente",
          category: "Geral",
          shortDescription: "Desc",
          modulesCount: 1,
        },
        {
          id: createdId,
          title: newCoursePayload.title,
          category: newCoursePayload.category,
          shortDescription: newCoursePayload.description,
          thumbnail: newCoursePayload.thumbnail,
          modulesCount: 0,
        },
      ];

      getMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/courses");
        return {
          status: 200,
          data: backendCoursesList,
        };
      });

      const refreshedCourses = await coursesService.getAll();

      // Verifica se o curso criado persiste e foi encontrado após o 'F5'
      const persistentCourse = refreshedCourses.find((c) => c.id === createdId);
      assert.ok(persistentCourse, "O curso criado deve existir após o refresh (F5)");
      assert.equal(persistentCourse?.title, newCoursePayload.title);
      assert.equal(persistentCourse?.category, newCoursePayload.category);
    });
  });

  describe("Causa Raiz 3: Prevenção de Cache Estático no Next.js App Router", () => {
    it("REGRESSÃO: /courses deve ter export dynamic = 'force-dynamic' e revalidate = 0", () => {
      assert.equal(
        coursesPage.dynamic,
        "force-dynamic",
        "A página /courses DEVE ser force-dynamic para não servir cache estático"
      );
      assert.equal(
        coursesPage.revalidate,
        0,
        "A página /courses DEVE ter revalidate = 0 para nunca cachear dados do banco"
      );
    });

    it("REGRESSÃO: / (Home) deve ter export dynamic = 'force-dynamic' e revalidate = 0", () => {
      assert.equal(
        homePage.dynamic,
        "force-dynamic",
        "A página raiz DEVE ser force-dynamic para refletir imediatamente novos cursos"
      );
      assert.equal(
        homePage.revalidate,
        0,
        "A página raiz DEVE ter revalidate = 0 para nunca cachear dados no SSR"
      );
    });
  });

  describe("Causa Raiz 4: Exclusão e Atualização com persistência garantida", () => {
    it("REGRESSÃO: atualização de curso deve enviar PUT e propagar falha se a API/banco falhar", async () => {
      putMock.mock.mockImplementation(async () => {
        throw new Error("Erro de atualização no banco PostgreSQL");
      });

      await assert.rejects(
        async () => {
          await coursesService.update("course-123", {
            title: "Título Atualizado",
          });
        },
        {
          name: "Error",
          message: "Erro de atualização no banco PostgreSQL",
        }
      );
    });

    it("REGRESSÃO: remoção de curso deve propagar falha se a API/banco falhar", async () => {
      deleteMock.mock.mockImplementation(async () => {
        throw new Error("Erro de constraint no banco de dados");
      });

      await assert.rejects(
        async () => {
          await coursesService.delete("course-123");
        },
        {
          name: "Error",
          message: "Erro de constraint no banco de dados",
        }
      );
    });

    it("REGRESSÃO: remoção de aula/vídeo deve propagar falha se a API/banco falhar", async () => {
      deleteMock.mock.mockImplementation(async () => {
        throw new Error("Erro ao excluir vídeo no banco");
      });

      await assert.rejects(
        async () => {
          await lessonsService.delete("lesson-123");
        },
        {
          name: "Error",
          message: "Erro ao excluir vídeo no banco",
        }
      );
    });
  });
});
