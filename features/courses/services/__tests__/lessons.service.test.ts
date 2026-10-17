import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { lessonsService } from "../lessons.service";
import { apiClient } from "@/services/api";

describe("lessonsService - CRUD Unit Tests", () => {
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

  describe("create() - Criação de vídeo/aula", () => {
    it("deve criar um novo vídeo com sucesso enviando o payload correto via Axios POST /lessons", async () => {
      const mockCreatedLesson = {
        id: "42",
        moduleId: "1",
        title: "Arquitetura Next.js",
        description: "Estrutura de pastas e rotas",
        duration: 25,
        order: 1,
      };

      postMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/lessons");
        assert.deepEqual(data, {
          moduleId: 1,
          title: "Arquitetura Next.js",
          description: "Estrutura de pastas e rotas",
          duration: 25,
          position: 1,
        });
        return { data: mockCreatedLesson, status: 201 };
      });

      const result = await lessonsService.create({
        moduleId: 1,
        title: "Arquitetura Next.js",
        description: "Estrutura de pastas e rotas",
        duration: 25,
        position: 1,
      });

      assert.equal(postMock.mock.callCount(), 1);
      assert.deepEqual(result, mockCreatedLesson);
    });

    it("deve propagar erro de conexão caso a API backend esteja offline", async () => {
      postMock.mock.mockImplementation(async () => {
        throw new Error("Network Error");
      });

      await assert.rejects(
        async () => {
          await lessonsService.create({
            moduleId: 1,
            title: "Vídeo com Falha",
            duration: 10,
            position: 2,
          });
        },
        { message: "Network Error" }
      );
    });
  });

  describe("getById() - Leitura de vídeo/aula", () => {
    it("deve buscar o vídeo pelo ID via Axios GET /lessons/:id", async () => {
      const mockLesson = {
        id: "10",
        title: "Introdução ao React",
        duration: 15,
        order: 1,
      };

      getMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/lessons/10");
        return { data: mockLesson, status: 200 };
      });

      const result = await lessonsService.getById("10");

      assert.equal(getMock.mock.callCount(), 1);
      assert.deepEqual(result, mockLesson);
    });
  });

  describe("update() - Edição/Atualização de vídeo/aula", () => {
    it("deve atualizar os dados do vídeo via Axios PUT /lessons/:id", async () => {
      const mockUpdated = {
        id: "10",
        moduleId: "1",
        title: "Introdução ao React - Atualizado",
        description: "Nova descrição",
        duration: 30,
        order: 2,
      };

      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/lessons/10");
        assert.deepEqual(data, {
          title: "Introdução ao React - Atualizado",
          description: "Nova descrição",
          duration: 30,
          position: 2,
          moduleId: 1,
        });
        return { data: mockUpdated, status: 200 };
      });

      const result = await lessonsService.update("10", {
        title: "Introdução ao React - Atualizado",
        description: "Nova descrição",
        duration: 30,
        position: 2,
        moduleId: 1,
      });

      assert.equal(putMock.mock.callCount(), 1);
      assert.deepEqual(result, mockUpdated);
    });
  });

  describe("delete() - Exclusão de vídeo/aula", () => {
    it("deve excluir o vídeo via Axios DELETE /lessons/:id", async () => {
      deleteMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/lessons/10");
        return { data: { message: "Removido" }, status: 200 };
      });

      await lessonsService.delete("10");

      assert.equal(deleteMock.mock.callCount(), 1);
    });

    it("deve propagar erro caso a exclusão no backend falhe", async () => {
      deleteMock.mock.mockImplementation(async () => {
        throw new Error("Erro de conexão");
      });

      await assert.rejects(
        async () => {
          await lessonsService.delete("9999");
        },
        { message: "Erro de conexão" }
      );
    });
  });
});
