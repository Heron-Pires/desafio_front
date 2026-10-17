import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { modulesService } from "../modules.service";
import { apiClient } from "@/services/api";

describe("modulesService - CRUD Unit Tests", () => {
  let postMock: ReturnType<typeof mock.method>;
  let getMock: ReturnType<typeof mock.method>;
  let deleteMock: ReturnType<typeof mock.method>;

  beforeEach(() => {
    postMock = mock.method(apiClient, "post");
    getMock = mock.method(apiClient, "get");
    deleteMock = mock.method(apiClient, "delete");
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe("create() - Criação de módulo", () => {
    it("deve criar um novo módulo vinculado a um curso via Axios POST /modules", async () => {
      const mockCreated = {
        id: "15",
        courseId: "1",
        title: "Novo Módulo",
        order: 3,
        lessons: [],
      };

      postMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/modules");
        assert.deepEqual(data, {
          courseId: 1,
          title: "Novo Módulo",
          order: 3,
        });
        return { data: mockCreated, status: 201 };
      });

      const result = await modulesService.create({
        courseId: 1,
        title: "Novo Módulo",
        order: 3,
      });

      assert.equal(postMock.mock.callCount(), 1);
      assert.deepEqual(result, mockCreated);
    });
  });

  describe("getById() - Consulta de módulo", () => {
    it("deve consultar o módulo e suas aulas via Axios GET /modules/:id", async () => {
      const mockModule = {
        id: "15",
        courseId: "1",
        title: "Novo Módulo",
        order: 3,
        lessons: [],
      };

      getMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/modules/15");
        return { data: mockModule, status: 200 };
      });

      const result = await modulesService.getById("15");

      assert.equal(getMock.mock.callCount(), 1);
      assert.deepEqual(result, mockModule);
    });
  });

  describe("delete() - Exclusão de módulo", () => {
    it("deve deletar o módulo via Axios DELETE /modules/:id", async () => {
      deleteMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/modules/15");
        return { data: { message: "Módulo removido com sucesso." }, status: 200 };
      });

      await modulesService.delete("15");

      assert.equal(deleteMock.mock.callCount(), 1);
    });
  });
});
