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

## 🏗️ Arquitetura do Monorepo

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
