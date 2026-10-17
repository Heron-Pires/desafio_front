import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { coursesService } from "../courses.service";
import { apiClient } from "@/services/api";

describe("coursesService - CRUD Unit Tests", () => {
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

  describe("getAll() - Listagem de cursos", () => {
    it("deve retornar a lista de cursos via Axios GET /courses", async () => {
      const mockList = [
        {
          id: "1",
          title: "Desenvolvimento Web Fullstack",
          category: "Programação",
          shortDescription: "Introdução ao fullstack",
          modulesCount: 2,
        },
      ];

      getMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/courses");
        return { data: mockList, status: 200 };
      });

      const result = await coursesService.getAll();

      assert.equal(getMock.mock.callCount(), 1);
      assert.deepEqual(result, mockList);
    });

    it("deve recorrer aos dados de mock caso a API esteja indisponível", async () => {
      getMock.mock.mockImplementation(async () => {
        throw new Error("Conexão recusada");
      });

      const result = await coursesService.getAll();

      assert.ok(Array.isArray(result));
      assert.ok(result.length > 0);
    });
  });

  describe("getById() - Detalhes do curso", () => {
    it("deve retornar detalhes e módulos do curso via Axios GET /courses/:id", async () => {
      const mockDetail = {
        id: "1",
        title: "Desenvolvimento Web Fullstack",
        category: "Programação",
        description: "Curso detalhado",
        thumbnail: "https://exemplo.com/thumb.jpg",
        modules: [],
      };

      getMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/courses/1");
        return { data: mockDetail, status: 200 };
      });

      const result = await coursesService.getById("1");

      assert.equal(getMock.mock.callCount(), 1);
      assert.deepEqual(result, mockDetail);
    });
  });

  describe("create() - Criação de curso", () => {
    it("deve cadastrar um novo curso enviando os dados via Axios POST /courses", async () => {
      const newCoursePayload = {
        title: "Next.js 16 Avançado",
        category: "Frontend",
        description: "Aprenda Turbopack e Server Actions",
        thumbnail: "https://exemplo.com/next.jpg",
      };

      const mockResponse = {
        id: "7",
        title: newCoursePayload.title,
        category: newCoursePayload.category,
        description: newCoursePayload.description,
        thumbnail: newCoursePayload.thumbnail,
      };

      postMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses");
        assert.deepEqual(data, newCoursePayload);
        return { data: mockResponse, status: 201 };
      });

      const result = await coursesService.create(newCoursePayload);

      assert.equal(postMock.mock.callCount(), 1);
      assert.deepEqual(result, {
        id: "7",
        title: "Next.js 16 Avançado",
        category: "Frontend",
        shortDescription: "Aprenda Turbopack e Server Actions",
        thumbnail: "https://exemplo.com/next.jpg",
        modulesCount: 0,
      });
    });

    it("deve propagar o erro caso a criação na API backend falhe", async () => {
      postMock.mock.mockImplementation(async () => {
        throw new Error("Erro no banco de dados");
      });

      await assert.rejects(
        async () => {
          await coursesService.create({ title: "Curso com falha" });
        },
        { message: "Erro no banco de dados" }
      );
    });
  });

  describe("update() - Atualização de curso", () => {
    it("deve atualizar os dados do curso via Axios PUT /courses/:id", async () => {
      const updateData = {
        title: "Next.js 16 - Edição Atualizada",
        category: "Web & Mobile",
      };

      const mockResponse = {
        id: "7",
        title: "Next.js 16 - Edição Atualizada",
        category: "Web & Mobile",
        description: "Aprenda Turbopack e Server Actions",
      };

      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses/7");
        assert.deepEqual(data, updateData);
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.update("7", updateData);

      assert.equal(putMock.mock.callCount(), 1);
      assert.deepEqual(result, {
        id: "7",
        title: "Next.js 16 - Edição Atualizada",
        category: "Web & Mobile",
        shortDescription: "Aprenda Turbopack e Server Actions",
        thumbnail: "",
        modulesCount: 0,
      });
    });
  });

  describe("delete() - Remoção de curso", () => {
    it("deve excluir o curso via Axios DELETE /courses/:id", async () => {
      deleteMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/courses/7");
        return { data: { message: "Curso removido com sucesso." }, status: 200 };
      });

      await coursesService.delete("7");

      assert.equal(deleteMock.mock.callCount(), 1);
    });
  });
});
