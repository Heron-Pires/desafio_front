import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { coursesService } from "../courses.service";
import { apiClient } from "@/services/api";

describe("coursesService - CRUD Unit Tests", () => {
  let postMock: ReturnType<typeof mock.method>;
  let getMock: ReturnType<typeof mock.method>;
  let putMock: ReturnType<typeof mock.method>;
  let patchMock: ReturnType<typeof mock.method>;
  let deleteMock: ReturnType<typeof mock.method>;

  beforeEach(() => {
    postMock = mock.method(apiClient, "post");
    getMock = mock.method(apiClient, "get");
    putMock = mock.method(apiClient, "put");
    patchMock = mock.method(apiClient, "patch");
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

    it("deve suportar upload de thumbnail com FormData quando enviado um File", async () => {
      const dummyFile = new File(["dummy"], "capa.png", { type: "image/png" });
      const payloadWithFile = {
        title: "Segurança Ofensiva",
        category: "Segurança",
        description: "Pentest do zero ao avançado",
        thumbnail: dummyFile,
      };

      const mockResponse = {
        id: "8",
        title: "Segurança Ofensiva",
        category: "Segurança",
        description: "Pentest do zero ao avançado",
        thumbnail: "https://supabase.co/storage/v1/object/public/course-thumbnails/capa.png",
      };

      postMock.mock.mockImplementation(async (url: string, data: unknown, config?: { headers?: Record<string, string> }) => {
        assert.equal(url, "/courses");
        assert.ok(data instanceof FormData);
        assert.equal((data as FormData).get("title"), "Segurança Ofensiva");
        assert.equal(config?.headers?.["Content-Type"], "multipart/form-data");
        return { data: mockResponse, status: 201 };
      });

      const result = await coursesService.create(payloadWithFile);

      assert.equal(postMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "https://supabase.co/storage/v1/object/public/course-thumbnails/capa.png");
    });

    it("deve realizar fallback defensivo para JSON e Base64 quando o upload multipart falhar com status 500 (ex: Supabase indisponível)", async () => {
      const dummyFile = new File(["img-bytes"], "capa.png", { type: "image/png" });
      const fallbackBase64 = "data:image/png;base64,aW1nLWJ5dGVz";
      const payloadWithFile = {
        title: "Engenharia Reversa",
        category: "Sistemas",
        description: "Análise binária e descompilação",
        thumbnail: dummyFile,
        fallbackThumbnail: fallbackBase64,
      };

      const mockResponse = {
        id: "9",
        title: "Engenharia Reversa",
        category: "Sistemas",
        description: "Análise binária e descompilação",
        thumbnail: fallbackBase64,
      };

      let callIndex = 0;
      postMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses");
        callIndex++;
        if (callIndex === 1) {
          // Primeira chamada via multipart falha no backend com 500
          assert.ok(data instanceof FormData);
          throw new Error("Request failed with status code 500 (Upload de arquivos indisponível: configure SUPABASE_URL)");
        }
        // Segunda chamada (fallback defensivo) envia JSON com a imagem em Base64
        assert.ok(!(data instanceof FormData));
        const body = data as Record<string, unknown>;
        assert.equal(body.title, "Engenharia Reversa");
        assert.equal(body.thumbnail, fallbackBase64);
        // Garante que o payload respeita o limite de 100KB do body-parser Express (evitando status 413)
        assert.ok(JSON.stringify(body).length < 100 * 1024, "Payload excede 100KB");
        return { data: mockResponse, status: 201 };
      });

      const result = await coursesService.create(payloadWithFile);

      assert.equal(postMock.mock.callCount(), 2);
      assert.equal(result.id, "9");
      assert.equal(result.thumbnail, fallbackBase64);
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

    it("deve suportar atualização com FormData quando thumbnail é um File", async () => {
      const dummyFile = new File(["dummy"], "nova-capa.jpg", { type: "image/jpeg" });
      const updateData = {
        title: "Curso Atualizado",
        thumbnail: dummyFile,
      };

      const mockResponse = {
        id: "7",
        title: "Curso Atualizado",
        thumbnail: "https://supabase.co/storage/v1/object/public/course-thumbnails/nova-capa.jpg",
      };

      putMock.mock.mockImplementation(async (url: string, data: unknown, config?: { headers?: Record<string, string> }) => {
        assert.equal(url, "/courses/7");
        assert.ok(data instanceof FormData);
        assert.equal((data as FormData).get("title"), "Curso Atualizado");
        assert.equal(config?.headers?.["Content-Type"], "multipart/form-data");
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.update("7", updateData);

      assert.equal(putMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "https://supabase.co/storage/v1/object/public/course-thumbnails/nova-capa.jpg");
    });

    it("deve realizar fallback defensivo para JSON e Base64 quando a atualização multipart falhar com status 500 (ex: Supabase indisponível)", async () => {
      const dummyFile = new File(["img-bytes"], "nova-capa.jpg", { type: "image/jpeg" });
      const fallbackBase64 = "data:image/jpeg;base64,aW1nLWJ5dGVz";
      const updateData = {
        title: "Curso Atualizado Fallback",
        thumbnail: dummyFile,
        fallbackThumbnail: fallbackBase64,
      };

      const mockResponse = {
        id: "7",
        title: "Curso Atualizado Fallback",
        thumbnail: fallbackBase64,
      };

      let callIndex = 0;
      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses/7");
        callIndex++;
        if (callIndex === 1) {
          // Falha do upload multipart no backend
          assert.ok(data instanceof FormData);
          throw new Error("Request failed with status code 500 (Upload de arquivos indisponível: configure SUPABASE_URL)");
        }
        // Fallback defensivo com JSON
        assert.ok(!(data instanceof FormData));
        const body = data as Record<string, unknown>;
        assert.equal(body.title, "Curso Atualizado Fallback");
        assert.equal(body.thumbnail, fallbackBase64);
        // Garante que o payload respeita o limite de 100KB do body-parser Express (evitando status 413)
        assert.ok(JSON.stringify(body).length < 100 * 1024, "Payload excede 100KB");
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.update("7", updateData);

      assert.equal(putMock.mock.callCount(), 2);
      assert.equal(result.thumbnail, fallbackBase64);
    });

    it("deve permitir remover thumbnail passando null", async () => {
      const updateData = {
        title: "Curso Sem Capa",
        thumbnail: null,
      };

      const mockResponse = {
        id: "7",
        title: "Curso Sem Capa",
        thumbnail: null,
      };

      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses/7");
        assert.deepEqual(data, updateData);
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.update("7", updateData);

      assert.equal(putMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "");
    });

    it("deve permitir remover thumbnail passando string vazia", async () => {
      const updateData = {
        title: "Curso Sem Capa 2",
        thumbnail: "",
      };

      const mockResponse = {
        id: "7",
        title: "Curso Sem Capa 2",
        thumbnail: null,
      };

      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses/7");
        assert.deepEqual(data, updateData);
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.update("7", updateData);

      assert.equal(putMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "");
    });
  });

  describe("uploadThumbnail() - Atualização dedicada de imagem (PATCH /courses/:id/thumbnail)", () => {
    it("deve enviar o arquivo via FormData para PATCH /courses/:id/thumbnail", async () => {
      const dummyFile = new File(["image-bytes"], "thumb.png", { type: "image/png" });
      const mockResponse = {
        id: "10",
        title: "Curso de Teste",
        thumbnail: "https://supabase.co/storage/v1/object/public/course-thumbnails/thumb.png",
      };

      patchMock.mock.mockImplementation(async (url: string, data: unknown, config?: { headers?: Record<string, string> }) => {
        assert.equal(url, "/courses/10/thumbnail");
        assert.ok(data instanceof FormData);
        assert.equal((data as FormData).get("thumbnail"), dummyFile);
        assert.equal(config?.headers?.["Content-Type"], "multipart/form-data");
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.uploadThumbnail("10", dummyFile);

      assert.equal(patchMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "https://supabase.co/storage/v1/object/public/course-thumbnails/thumb.png");
    });

    it("deve realizar fallback defensivo via PUT com JSON quando PATCH multipart falhar com status 500", async () => {
      const dummyFile = new File(["test-img"], "thumb.png", { type: "image/png" });
      const mockResponse = {
        id: "10",
        title: "Curso com Fallback de Imagem",
        thumbnail: "data:image/png;base64,dGVzdC1pbWc=",
      };

      patchMock.mock.mockImplementation(async (url: string) => {
        assert.equal(url, "/courses/10/thumbnail");
        throw new Error("Request failed with status code 500 (Upload indisponível no Supabase)");
      });

      putMock.mock.mockImplementation(async (url: string, data: unknown) => {
        assert.equal(url, "/courses/10");
        const body = data as Record<string, unknown>;
        assert.ok(typeof body.thumbnail === "string");
        assert.ok((body.thumbnail as string).startsWith("data:image/png;base64,"));
        return { data: mockResponse, status: 200 };
      });

      const result = await coursesService.uploadThumbnail("10", dummyFile);

      assert.equal(patchMock.mock.callCount(), 1);
      assert.equal(putMock.mock.callCount(), 1);
      assert.equal(result.thumbnail, "data:image/png;base64,dGVzdC1pbWc=");
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
