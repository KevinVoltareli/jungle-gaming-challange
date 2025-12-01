# Jungle Tasks – Desafio Full-stack Júnior (Jungle Gaming)

Sistema de Gestão de Tarefas Colaborativo com autenticação, comentários, atribuição de usuários e notificações em tempo real (WebSocket + RabbitMQ), rodando em um monorepo com múltiplos serviços Nest.js e frontend React + TanStack Router.

> Desafio técnico para a vaga de **Full-stack Developer Júnior – Jungle Gaming**.

---

## 🌐 Demo local – Endpoints principais

- Frontend (web): **http://localhost:5173**
- API Gateway: **http://localhost:3001**
- Swagger (Gateway): **http://localhost:3001/api/docs**
- RabbitMQ Management: **http://localhost:15672**  
  - user: `admin`  
  - pass: `admin`
- Postgres: **localhost:5432**

---

## 🧱 Stack utilizada

**Frontend**

- React.js
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Zustand (auth store)
- react-hook-form + zod
- Socket.io client (WebSocket)

**Back-end**

- Nest.js (API Gateway + 3 microserviços)
- TypeORM + PostgreSQL
- RabbitMQ (event-driven)
- JWT + Passport
- bcrypt
- Swagger (OpenAPI)
- Jest (testes unitários)

**Infra / DevX**

- Monorepo com **Turborepo**
- Docker & docker-compose
- Packages compartilhados (`types`, `utils`, `eslint-config`, `tsconfig`)

---

## 🏗️ Arquitetura 

A solução segue uma arquitetura em **monorepo** com múltiplos serviços Nest.js, um API Gateway na frente e um frontend React consumindo tudo via HTTP + WebSocket.

### Visão geral (ASCII)

```txt
                      +----------------------+
                      |      Web (React)     |
                      |  TanStack Router     |
                      |  TanStack Query      |
                      |  Zustand (Auth)      |
                      +----------+-----------+
                                 |
                                 | HTTP (REST) + JWT
                                 v
                      +----------------------+
                      |     API Gateway      |
                      |  Nest.js (HTTP)      |
                      |  Swagger / Guards    |
                      +----------+-----------+
                                 |
          +----------------------+----------------------+
          |                                             |
          v                                             v
+----------------------+                     +----------------------+
|    Auth Service      |                     |    Tasks Service     |
|  Nest.js + TypeORM   |                     |  Nest.js + TypeORM   |
|  Users, Tokens       |                     |  Tasks, Comments,    |
|  (DDD + VO)          |                     |  Assignees, History  |
+----------+-----------+                     +----------+-----------+
           |                                             |
           |                                             |
           | RabbitMQ (eventos domain -> infra)         |
           +-----------------------------+--------------+
                                         v
                              +----------------------+
                              | Notifications Service|
                              | Nest.js + TypeORM    |
                              | RabbitMQ Consumer    |
                              | WebSocket Gateway    |
                              +----------------------+




### Estrutura de pasta
```txt
.
├── apps/
│   ├── web/                     # React + TanStack Router + shadcn + Tailwind
│   ├── api-gateway/             # Nest HTTP + Swagger + WebSocket proxy
│   ├── auth-service/            # Nest microservice (autenticação)
│   ├── tasks-service/           # Nest microservice (tarefas, comentários, histórico)
│   └── notifications-service/   # Nest microservice (notificações + WebSocket)
├── packages/
│   ├── types/                   # DTOs / types compartilhados
│   ├── utils/                   # helpers / adapters
│   ├── eslint-config/           # config eslint compartilhada
│   └── tsconfig/                # tsconfig bases
├── docker-compose.yml
├── turbo.json
├── package.json
└── README.md



## 🧠 Decisões técnicas e trade-offs

### 1. Monorepo com Turborepo
- **Decisão**: centralizar todos os serviços (`web`, `api-gateway`, `auth-service`, `tasks-service`, `notifications-service`) em um único monorepo.
- **Por quê**: facilita o desenvolvimento local, compartilhamento de tipos/utilitários e padronização de lint/tsconfig.
- **Trade-off**: repositório fica mais pesado e exige um pouco mais de cuidado com scripts e cache, mas para um time pequeno/projeto de desafio compensa a simplicidade.

### 2. DDD leve + OOP + SOLID nos serviços de domínio
- **Decisão**: modelar `User`, `Task`, `Comment`, `TaskHistory`, `TaskAssignee` como entidades de domínio, com value objects (`Email`, `PasswordHash`, `TaskTitle`, `TaskDescription`).
- **Por quê**: mantém regras de negócio encapsuladas, facilita testes de casos de uso e deixa o código mais próximo de Clean Architecture.
- **Trade-off**: mais arquivos/boilerplate (mappers, interfaces de repositório, etc.) em troca de melhor organização e extensibilidade.

### 3. Event-driven com RabbitMQ para tarefas e notificações
- **Decisão**: tasks-service publica eventos (`task.created`, `task.updated`, `task.comment.created`) e notifications-service consome e empurra para WebSocket.
- **Por quê**: desacopla as responsabilidades – o serviço de tarefas não precisa conhecer WebSocket nem front, apenas o domínio e os eventos.
- **Trade-off**: aumenta a complexidade de infra (RabbitMQ, filas, handlers), mas aproxima o desafio de um cenário real de iGaming com alto tráfego de eventos.

### 4. Autenticação centralizada no API Gateway
- **Decisão**: o Gateway é responsável por validar JWT em rotas protegidas antes de encaminhar requisições para os microserviços.
- **Por quê**: reduz duplicação de lógica de auth nos serviços internos e deixa mais clara a fronteira "pública".
- **Trade-off**: o Gateway vira um ponto crítico de falha, mas totalmente aceitável para o escopo do desafio.

### 5. TanStack Router + TanStack Query no frontend
- **Decisão**: usar TanStack Router (em vez de React Router) e TanStack Query para dados assíncronos.
- **Por quê**: TanStack Query simplifica cache, estados de loading/erro e invalidação (principalmente junto com WebSocket), e o Router integra bem com isso.
- **Trade-off**: curva de aprendizado um pouco maior, mas o resultado é um front mais organizado e previsível.

### 6. Zustand para auth store
- **Decisão**: usar Zustand em vez de Context + useReducer para autenticação.
- **Por quê**: API simples, persistência fácil de tokens e leitura fora da árvore de componentes (ex.: ao construir `ApiClient`).
- **Trade-off**: adiciona uma dependência a mais, mas o código fica menos verboso e mais direto.

### 7. Simplicidade first na UI
- **Decisão**: focar em uma UI funcional, limpa e responsiva, sem overdesign.
- **Por quê**: objetivo do desafio é demonstrar arquitetura, integração e boas práticas – não um design system completo.
- **Trade-off**: visual é simples, mas os fluxos principais (login, CRUD de tarefas, comentários, atribuição, realtime) estão completos.


## ⚠️ Problemas conhecidos e melhorias futuras

- [ ] **Filtros avançados de tarefas**  
  Hoje a lista traz paginação básica. Filtros por status, prioridade, prazo e usuários atribuídos seriam o próximo passo natural.

- [ ] **UI/UX de notificações**  
  As notificações em tempo real estão implementadas (WebSocket + invalidation de queries), mas a UI ainda é simples.  
  Melhorias possíveis:
  - painel dedicado de notificações,
  - “marcar como lida”,
  - contadores por usuário.

- [ ] **Paginação e ordenação de comentários no front**  
  O backend já trabalha com paginação, mas o frontend simplifica trazendo a lista direto. Poderia expor controles de página, ordenação por data, etc.

- [ ] **Histórico mais detalhado na interface**  
  O histórico de alterações já é persistido, mas não está exposto em uma tela própria. Uma página de “Audit log” por tarefa ajudaria bastante times grandes.

- [ ] **Mais testes automatizados**  
  Os testes cobrem os principais use-cases (como criação de tarefas e atribuição de usuários), mas ainda há espaço para:
  - mais cenários de erro e borda,
  - testes de integração entre serviços,
  - testes de componentes no frontend.

- [ ] **Hardening de segurança**  
  Pontos que podem ser evoluídos:
  - CORS mais restritivo,
  - regras de rate limiting mais finas por rota,
  - logs estruturados com correlação de request ID.

- [ ] **Experiência de desenvolvimento ainda mais automatizada**  
  Hoje já existe Docker Compose, mas dá pra melhorar:
  - scripts de `make` ou `turbo` para subir tudo de uma vez,
  - seed automático de usuário admin,
  - health checks integrados (Gateway checando serviços internos).


## ⏱️ Tempo gasto (aproximado)

> Valores aproximados apenas para dar contexto de esforço por área.

| Parte                                      | Tempo aproximado |
| ------------------------------------------ | ---------------- |
| Monorepo, setup base e Docker              | ~6h              |
| Auth-service (domínio, JWT, Nest)         | ~6h              |
| Tasks-service (domínio, casos de uso, eventos) | ~10h         |
| Notifications-service (RabbitMQ + WebSocket)   | ~6h          |
| API Gateway (rotas, guards, Swagger)      | ~5h              |
| Frontend (auth, UI, CRUD, realtime)       | ~10h             |
| Testes unitários + ajustes finos          | ~5h              |
| TOTAL                                      | ~48h             |

## 📝 Instruções específicas

- **Ordem recomendada para subir o projeto localmente**  
  1. Subir Docker Compose (`docker compose up --build`);  
  2. Rodar migrations de cada serviço (`auth-service`, `tasks-service`, `notifications-service`);  
  3. Acessar o frontend em `http://localhost:5173`.

- **Criação de usuário inicial**  
  - O primeiro usuário pode ser criado via:
    - tela de **Register** no frontend, ou  
    - chamada `POST /api/auth/register` via API Gateway (Insomnia/Postman).

- **Login e utilização de tokens**  
  - O frontend utiliza `accessToken` para chamadas HTTP e mantém `refreshToken` em store persistida.
  - O WebSocket de notificações utiliza o token de acesso atual na query string.

- **Ambientes e variáveis**  
  - Cada app possui um `.env.example` com as variáveis necessárias (`JWT_SECRET`, credenciais do Postgres, URLs dos serviços, etc.).
  - Para rodar localmente, basta copiar para `.env` e ajustar se necessário.

- **WebSocket de testes manuais**  
  - Além do frontend, há suporte para testar o WebSocket com um HTML simples (conectando em `http://localhost:3005/notifications` com o `accessToken`).
  - Isso ajuda a isolar problemas de backend x frontend quando se testa tempo real.

- **Limpeza de ambiente**  
  - Volumes `postgres_data` e `rabbitmq_data` podem ser removidos para resetar completamente a base:
    - `docker compose down -v`

