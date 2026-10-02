# Plataforma Comando - Frontend de Cursos

## 1. Descrição do Projeto

Interface da área do aluno para a plataforma de ensino Comando. A aplicação permite a visualização de cursos em layout inspirado em plataformas de streaming, detalhamento de cursos específicos e navegação pela estrutura hierárquica de módulos e aulas.

O projeto foi desenvolvido em arquitetura modular orientada a domínios (feature-based), utilizando React Server Components para otimização de requisições e consumo direto da API REST.

## 2. Tecnologias Utilizadas

* Next.js (App Router)

* React

* TypeScript

* Tailwind CSS

* Git

## 3. Como Instalar

Clone o repositório e acesse a branch da funcionalidade:

```
git clone https://github.com/Heron-Pires/desafio_front
cd comando-web
git checkout feature/frontend-courses

```

Instale as dependências:

```
npm install

```

## 4. Como Configurar o Ambiente

Copie o arquivo de variáveis de exemplo para o arquivo local:

```
cp .env.example .env.local

```

## 5. Como Configurar a URL da API

Abra o arquivo `.env.local` e configure a variável `NEXT_PUBLIC_API_URL` com o endereço base da API backend:

```
NEXT_PUBLIC_API_URL=http://localhost:3001

```

Substitua `http://localhost:3001` pelo host e porta onde o backend estiver em execução.

## 6. Como Executar o Projeto

### Ambiente de Desenvolvimento

```
npm run dev

```

Acesse a aplicação em `http://localhost:3000`.

### Build de Produção

```
npm run build
npm start

```

### Verificação de Tipos e Lint

```
npm run lint

```

## 7. Rotas Disponíveis

* `/`
  Página inicial (Landing Page) com apresentação da plataforma no estilo streaming e atalho para o catálogo.

* `/courses`
  Página de listagem geral com catálogo de cursos disponíveis, apresentando miniatura, título, categoria, descrição resumida e quantidade de módulos.

* `/courses/:id`
  Página de detalhes do curso. Apresenta as informações gerais do curso selecionado e a relação completa de módulos e suas respectivas aulas.

## 8. Observações Necessárias para Integração

A aplicação consome a API backend exclusivamente por meio do serviço centralizado (`services/api.ts` e `features/courses/services/courses.service.ts`). O backend deve disponibilizar os seguintes contratos:

### GET /courses

Retorna a lista de cursos cadastrados.

Formato esperado:

```
[
  {
    "id": "1",
    "title": "Desenvolvimento Web Fullstack",
    "category": "Programação",
    "shortDescription": "Aprenda a construir aplicações modernas de ponta a ponta.",
    "thumbnail": "https://exemplo.com/thumb.jpg",
    "modulesCount": 2
  }
]

```

### GET /courses/:id

Retorna os detalhes de um curso específico identificado por `:id`.

Formato esperado:

```
{
  "id": "1",
  "title": "Desenvolvimento Web Fullstack",
  "category": "Programação",
  "description": "Descrição completa e detalhada sobre o curso.",
  "thumbnail": "https://exemplo.com/thumb.jpg",
  "modules": [
    {
      "id": "m1",
      "title": "Módulo 1 - Fundamentos",
      "lessons": [
        { "id": "l1", "title": "Aula 1 - Variáveis" },
        { "id": "l2", "title": "Aula 2 - Tipos de dados" }
      ]
    }
  ]
}

```

### Tratamento de Respostas e Códigos HTTP

* `200 OK`: Renderização normal da listagem ou dos detalhes.

* `200 OK com array vazio []`: Dispara o componente de lista vazia (`Nenhum curso disponível.`).

* `404 Not Found`: Dispara a tela nativa de erro 404 (`Curso não encontrado`) com link de retorno para `/courses`.

* `500 Internal Server Error` ou falha de conexão: Dispara a tela de barreira de erro (`Não foi possível carregar os cursos.`) com opção para nova tentativa.
