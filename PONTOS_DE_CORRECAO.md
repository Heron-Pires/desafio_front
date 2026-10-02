# Diagnóstico de Requisitos e Pontos de Correção
**Projeto:** Plataforma Comando - Frontend de Cursos  
**Repositório:** `/home/desktop/comando/desafio_front`  
**Branch:** `feature/frontend-courses`  
**Data:** 02 de Outubro de 2026

---

## 1. Visão Geral

O projeto apresenta uma base técnica sólida (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS e arquitetura modular orientada a features). No entanto, para atingir **100% de conformidade** com o edital do Desafio Prático, existem pendências cruciais ligadas à persistência de dados fixos (mocks), ocultação do estado de erro e arquivos de convenção do Next.js ausentes.

---

## 2. Tabela de Conformidade por Requisito

| # | Requisito do Edital | Status | Situação Encontrada |
|---|---------------------|:------:|----------------------|
| 1 | Contexto (Estilo Streaming) | ✅ Conforme | Design escuro, layout moderno e estruturado. |
| 2 | Objetivo Geral | ⚠️ Atenção | Fluxo completo existe, mas há fallback ativo para mock em caso de falha da API. |
| 3 | Tecnologias Obrigatórias | ✅ Conforme | Next.js, React, TypeScript e Git adotados corretamente. |
| 4 | Estrutura do Projeto | ✅ Conforme | Organização modular em `features/courses`, `services`, `components/ui`. |
| 5 | Página de Cursos (`/courses`) | ✅ Conforme | Exibe thumbnail, título, categoria, descrição curta e quantidade de módulos. |
| 6 | Página de Detalhes (`/courses/:id`) | ✅ Conforme | Exibe detalhes, thumbnail e lista hierárquica (módulos e aulas). |
| 7 | Navegação | ✅ Conforme | Rota de ida e retorno devidamente implementadas. |
| 8 | Estados da Aplicação | ⚠️ Atenção | O estado de erro é mascarado pelo mock em `/courses`; falta `loading.tsx` em `/courses` e `error.tsx` em `/courses/[id]`. |
| 9 | Responsividade | ✅ Conforme | Grids adaptáveis com Tailwind CSS para mobile, tablet e desktop. |
| 10 | Consumo da API | ✅ Conforme | Centralizado em `services/api.ts` e `features/courses/services/courses.service.ts`. |
| 11 | Variáveis de Ambiente | ✅ Conforme | `NEXT_PUBLIC_API_URL` configurado via `.env.example` e `.env.local`. |
| 12 | Componentização | ✅ Conforme | Componentes reutilizáveis bem definidos (`CourseCard`, `ModuleItem`, `LessonItem`, etc.). |
| 13 | Git | ⚠️ Atenção | Branch correta e commits atômicos, mas existem arquivos deletados não commitados (`git status`). |
| 14 | Integração com Backend | ⚠️ Atenção | Mock ainda presente e ativo no fluxo de produção. |
| 15 | Documentação (README) | ⚠️ Atenção | README completo, porém diverge ao descrever que `/` redireciona para `/courses`. |

---

## 3. Detalhamento dos Pontos que Precisam de Correção

---

### Ponto 1: Remoção de Dados Mockados e Exibição Real do Estado de Erro (Crítico)
* **Requisitos afetados:** 2, 8 e 14.
* **Arquivo afetado:** `app/courses/page.tsx` (e `app/page.tsx`).
* **Problema:**  
  O edital estipula explicitamente:
  > *"Não utilize dados fixos para substituir a API na versão final."*  
  > *"Caso a API não esteja disponível ou ocorra um erro: 'Não foi possível carregar os cursos.' O usuário deverá receber uma indicação clara de que houve um problema."*

  No código atual de `app/courses/page.tsx`:
  ```typescript
  let courses: CourseSummary[] = [];
  const error: string | null = null;

  try {
    courses = await coursesService.getAll();
  } catch {
    // Se a API backend não estiver ativa no momento, utiliza mock para demonstração
    courses = mockCourses;
  }
  ```
  Quando a API backend está desligada ou falha, o `catch` injeta `mockCourses` e mantém `error = null`. Como resultado:
  1. A aplicação continua usando dados fixos na versão final.
  2. O componente `<ErrorMessage message={error} />` presente em `CourseList` **nunca é acionado**.
  3. O usuário nunca é informado de que a API falhou.

* **Ação Corretiva:**
  1. No `catch` de `app/courses/page.tsx`, definir a mensagem de erro para que o componente `CourseList` renderize o estado de erro:
     ```typescript
     let courses: CourseSummary[] = [];
     let error: string | null = null;

     try {
       courses = await coursesService.getAll();
     } catch {
       error = "Não foi possível carregar os cursos.";
     }
     ```
  2. Em `app/page.tsx`, remover o fallback que injeta `mockCourses` quando a API falha ou retorna vazia.

---

### Ponto 2: Criação do Estado de Carregamento Nativo em `/courses`
* **Requisito afetado:** 8 (Carregamento).
* **Arquivo ausente:** `app/courses/loading.tsx`.
* **Problema:**  
  O edital exige:
  > *"Enquanto os dados estiverem sendo carregados, apresente um estado de carregamento. Por exemplo: Carregando cursos... ou um skeleton."*

  A página `/courses/[id]` possui `loading.tsx` nativo com skeleton. Contudo, em `/courses`, não há arquivo de loading no App Router. Como a página é um Server Component assíncrono, o usuário pode ver uma tela em branco durante a latência de rede inicial.
* **Ação Corretiva:**  
  Criar o arquivo `app/courses/loading.tsx` exibindo o grid de esqueletos:
  ```tsx
  import { CourseCardSkeleton } from "@/features/courses/components/CourseCardSkeleton";

  export default function CoursesLoading() {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
            <div className="h-10 w-64 animate-pulse rounded bg-neutral-800" />
            <div className="h-4 w-96 animate-pulse rounded bg-neutral-800" />
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Carregando cursos..."
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  ```

---

### Ponto 3: Barreira de Erro (`error.tsx`) para `/courses/:id`
* **Requisito afetado:** 8 (Erro).
* **Arquivo ausente:** `app/courses/[id]/error.tsx` (ou `app/error.tsx`).
* **Problema:**  
  Em `app/courses/[id]/page.tsx`, o erro 404 é tratado com `notFound()`. Porém, se a API retornar erro de conexão ou `500 Internal Server Error`, o código executa `throw error;`. Sem um `error.tsx`, o Next.js exibe a tela genérica de erro não tratado em produção, sem UI amigável nem botão de tentar novamente.
* **Ação Corretiva:**  
  Criar `app/courses/[id]/error.tsx` (Client Component com `'use client'`) usando o componente `ErrorMessage`:
  ```tsx
  'use client';

  import Link from "next/link";
  import { ErrorMessage } from "@/components/ui/ErrorMessage";

  export default function CourseDetailError({
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12">
        <div className="w-full max-w-md">
          <ErrorMessage
            message="Não foi possível carregar as informações do curso."
            onRetry={reset}
          />
          <div className="mt-4 text-center">
            <Link
              href="/courses"
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              &larr; Voltar para o catálogo de cursos
            </Link>
          </div>
        </div>
      </main>
    );
  }
  ```

---

### Ponto 4: Atualização da Documentação no README.md
* **Requisito afetado:** 15 (Documentação).
* **Arquivo afetado:** `README.md`.
* **Problema:**  
  Na seção 7 do README, consta:
  > `* /: Redireciona automaticamente para /courses.`

  Porém, `app/page.tsx` foi implementado como uma Landing Page promocional completa no estilo streaming (com Hero, destaques, metodologia e link para `/courses`), e não um redirecionamento automático.
* **Ação Corretiva:**  
  Atualizar o texto na seção 7 do `README.md` para refletir com fidelidade o comportamento da rota raiz:
  ```markdown
  * `/`
    Página inicial (Landing Page) com apresentação da plataforma no estilo streaming e atalho para o catálogo.
  ```

---

### Ponto 5: Limpeza e Atualização do Repositório Git
* **Requisito afetado:** 13 (Git).
* **Problema:**  
  O comando `git status` acusa arquivos padrão do template Next.js deletados mas não staged/commitados:
  ```text
  Changes not staged for commit:
    deleted:    public/file.svg
    deleted:    public/globe.svg
    deleted:    public/next.svg
    deleted:    public/vercel.svg
    deleted:    public/window.svg
  ```
* **Ação Corretiva:**  
  Registrar a exclusão desses arquivos em um commit limpo (ex: `chore: remove unused default template assets`).

---

### Ponto 6: (Recomendação) Otimização de Imagens com `next/image`
* **Observação de Qualidade:**  
  O linter oficial do Next.js acusa warning em `CourseCard.tsx` e `app/courses/[id]/page.tsx` devido ao uso direto da tag `<img>` nativa em vez do componente `<Image />` do `next/image`.
* **Ação Corretiva:**  
  Para garantir melhor performance de LCP e evitar alertas no `npm run lint`, utilizar `<Image />` configurando os domínios remotos (ou `unoptimized: true` se URLs externas forem arbitrárias).

---

## 4. Checklist Resumido de Execução

- [ ] Ajustar `app/courses/page.tsx` para setar `error` no `catch` e não usar `mockCourses`.
- [ ] Ajustar `app/page.tsx` para não carregar `mockCourses` como fallback.
- [ ] Criar `app/courses/loading.tsx`.
- [ ] Criar `app/courses/[id]/error.tsx`.
- [ ] Corrigir descrição da rota `/` no `README.md`.
- [ ] Comitar as alterações pendentes no Git (`public/*.svg` e correções).
