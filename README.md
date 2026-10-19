# Plataforma Comando - Frontend de Cursos & Gestão de Streaming

## 1. Descrição do Projeto

Interface web da plataforma de ensino e streaming **Comando**. A aplicação oferece aos alunos e administradores uma experiência moderna inspirada em serviços de streaming, permitindo o consumo, navegação e gerenciamento completo da estrutura hierárquica de ensino: **Curso ➔ Módulos ➔ Aulas (Vídeos)**.

O projeto foi construído sobre uma arquitetura modular orientada a domínios (*feature-based*), combinando **React Server Components** dinâmicos no Next.js App Router para evitar dados obsoletos de cache, cliente unificado **Axios** para comunicação resiliente com a API REST, e persistência real no PostgreSQL.

---

## 2. Tecnologias Utilizadas

* **Next.js 16.3.8** (App Router & Turbopack)
* **React 19.2.8**
* **TypeScript 5**
* **Tailwind CSS v4** (Estilização utilitária moderna e media queries responsivas)
* **Axios 1.20** (Cliente HTTP centralizado com interceptores de autenticação JWT e tratamento padronizado de erros)
* **TSX 4.23** (Test Runner nativo do Node.js para testes unitários e de regressão rápidos)
* **ESLint 9** (Padronização e análise estática de código)

---

## 3. Como Instalar

Clone o repositório e acesse a branch da funcionalidade:

```bash
git clone https://github.com/Heron-Pires/desafio_front
cd desafio_front
git checkout feature/frontend-courses
```

Instale as dependências:

```bash
npm install
```

---

## 4. Como Configurar o Ambiente

Copie o arquivo de variáveis de exemplo para criar sua configuração local:

```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e certifique-se de configurar as seguintes variáveis:

```env
# URL base da API REST backend (porta padrão: 3001)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Alterne para true apenas se desejar forçar a exibição de dados de demonstração locais sem consultar o backend
NEXT_PUBLIC_USE_MOCK=false
```

> **Aviso de Integração:** Para escrita e mutações (criação, edição e exclusão de cursos e aulas), a aplicação exige que a API backend esteja acessível e conectada ao banco de dados, prevenindo dados falsos em memória volátil.

---

## 5. Como Executar o Projeto

### Ambiente de Desenvolvimento

```bash
npm run dev
```

Acesse a aplicação no navegador em: `http://localhost:3000`.

### Build de Produção

```bash
npm run build
npm start
```

### Executar Testes Automatizados

A aplicação conta com uma suíte de 24 testes unitários e de regressão cobrindo todos os serviços do CRUD e garantindo integridade de persistência:

```bash
npm test
```

### Verificação de Tipos e Lint

```bash
npm run lint
```

---

## 6. Estrutura Arquitetural

O projeto organiza-se segundo o padrão de arquitetura orientada a domínios (*feature-based*):

```text
desafio_front/
├── app/                              # Next.js App Router (Páginas, Layouts e Rotas Dinâmicas)
│   ├── page.tsx                      # Landing Page (apresentação no estilo streaming)
│   ├── layout.tsx                    # Layout raiz com Navbar unificada
│   ├── globals.css                   # Configurações globais e media queries de layout
│   ├── courses/                      # Catálogo e Detalhes de Cursos
│   │   ├── page.tsx                  # Listagem de cursos (SSR dinâmico force-dynamic)
│   │   └── [id]/page.tsx             # Detalhes do curso, módulos e aulas
│   ├── videos/page.tsx               # Painel dedicado de gestão de vídeos/aulas
│   ├── login/page.tsx                # Tela de autenticação estilo streaming
│   └── api/health/route.ts           # Endpoint de monitoramento de saúde do frontend
├── components/                       # Biblioteca de componentes compartilhados
│   ├── common/Navbar.tsx             # Cabeçalho global com controle de sessão
│   └── ui/                           # Componentes de interface (ImageUpload, Skeleton, etc.)
├── features/courses/                 # Módulo de domínio de Cursos, Módulos e Aulas
│   ├── components/                   # Componentes de negócio (CourseCard, CourseContentManager, etc.)
│   ├── services/                     # Serviços de consumo da API (courses, modules, lessons)
│   │   └── __tests__/                # Suíte de testes unitários e testes de regressão
│   └── types/course.ts               # Contratos e tipos TypeScript do domínio
└── services/                         # Infraestrutura de rede e autenticação
    ├── api.ts                        # Instância configurada do Axios e httpClient helper
    └── auth.service.ts               # Gerenciamento de sessão e tokens JWT
```

---

## 7. Páginas e Funcionalidades Disponíveis

* **Landing Page (`/`)**:
  Apresentação visual da plataforma com temática escura de streaming (`neutral-950`/`neutral-900`), destaques e botão de acesso direto ao catálogo.
* **Catálogo de Cursos (`/courses`)**:
  Visualização dinâmica de todos os cursos cadastrados com contagem de módulos, categorias e badges informativos. Inclui o gerenciador interativo (`CoursesCatalogManager`) para criar novos cursos, editar informações existentes e excluir cursos em tempo real com feedback instantâneo.
* **Detalhes do Curso (`/courses/:id`)**:
  Visão aprofundada do curso selecionado com gerenciador de conteúdo hierárquico (`CourseContentManager`). Permite adicionar e remover módulos, bem como cadastrar, editar e excluir aulas diretamente em cada módulo.
* **Painel de Gestão de Vídeos (`/videos`)**:
  Área administrativa com tabela interativa de todas as aulas cadastradas, filtro por curso e módulo, além de modal completo para inclusão e edição de vídeos (título, descrição, duração, ordem e URL de vídeo).
* **Tela de Login (`/login`)**:
  Interface de autenticação com layout estilizado, persistência de token no `localStorage` e integração com a barra de navegação global.
* **Upload Responsivo de Capas (`ImageUpload.tsx`)**:
  Componente customizado para seleção e upload de capas com preview em tempo real, validação estrita de formatos suportados (`JPEG`, `PNG`, `WebP`, `GIF`, `AVIF`) e adaptação a dispositivos móveis e desktops via media queries.
* **Healthcheck (`/api/health`)**:
  Endpoint HTTP GET que confirma a prontidão e disponibilidade do serviço frontend.

---

## 8. Persistência de Dados e Prevenção do Bug do F5

Para solucionar em definitivo o problema de dados criados que desapareciam ao recarregar a página (F5):

1. **Persistência Obrigatória no PostgreSQL**:
   Mutações de escrita (`create`, `update`, `delete`) não utilizam mocks temporários em memória volátil. Toda alteração é salva obrigatoriamente no banco via API REST backend. Caso a API esteja inacessível, o erro é propagado de forma transparente para o usuário.
2. **Desativação de Cache Estático no App Router**:
   As páginas de catálogo (`/courses`) e inicial (`/`) utilizam `export const dynamic = "force-dynamic"` e `export const revalidate = 0`, garantindo que toda requisição de página busque os dados mais recentes no servidor.
3. **Revalidação Ativa de Estado**:
   Componentes clientes executam revalidação explícita (`refreshCourses()`) após qualquer operação de cadastro, edição ou remoção.
4. **Testes de Regressão Automatizados**:
   O arquivo `features/courses/services/__tests__/regression.test.ts` valida contra qualquer regressão no ciclo de persistência e previne poluição de estado em memória.

---

## 9. Contratos da API Backend (Integração)

A aplicação consome a API backend por meio dos serviços centralizados em `features/courses/services/`. Os seguintes contratos REST são suportados:

### Cursos (`/courses`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/courses` | Retorna o catálogo de cursos cadastrados |
| `GET` | `/courses/:id` | Retorna o curso especificado com seus módulos e aulas aninhados |
| `POST` | `/courses` | Cadastra um novo curso |
| `PUT` | `/courses/:id` | Atualiza os dados de um curso existente |
| `DELETE` | `/courses/:id` | Remove o curso (e dependências em cascata) |

#### Formato esperado no `GET /courses`:
```json
[
  {
    "id": "1",
    "title": "Desenvolvimento Web Fullstack",
    "category": "Programação",
    "shortDescription": "Introdução prática ao desenvolvimento web, do front ao back.",
    "thumbnail": "https://exemplo.com/fullstack.jpg",
    "modulesCount": 2
  }
]
```

### Módulos (`/modules`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/modules/:id` | Retorna os detalhes de um módulo e suas aulas |
| `POST` | `/modules` | Cria um módulo associado ao `courseId` |
| `PUT` | `/modules/:id` | Atualiza dados do módulo |
| `DELETE` | `/modules/:id` | Remove o módulo e suas aulas |

### Aulas e Vídeos (`/lessons`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/lessons/:id` | Retorna informações de uma aula específica |
| `POST` | `/lessons` | Cadastra uma nova aula vinculada ao `moduleId` |
| `PUT` | `/lessons/:id` | Atualiza dados da aula |
| `DELETE` | `/lessons/:id` | Remove a aula cadastrada |

#### Exemplo de Payload para Criação de Aula (`POST /lessons`):
```json
{
  "moduleId": 1,
  "title": "Introdução ao Docker",
  "description": "Fundamentos de containers e imagens",
  "duration": 15,
  "order": 1,
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Tratamento de Respostas e Códigos HTTP

* `200 OK / 201 Created`: Operação concluída com sucesso e estado atualizado.
* `200 OK com array vazio []`: Renderiza estado visual amigável (`EmptyState`).
* `400 Bad Request`: Exibe alerta amigável de campos inválidos ou obrigatórios não preenchidos.
* `404 Not Found`: Dispara visualização com fallback (`ErrorMessage` ou tela nativa 404).
* `500 Internal Server Error`: Tratamento defensivo exibindo aviso ao usuário com opção de reativação ou recarregamento sem quebrar a renderização global.
