# CostShield 🛡️

**Application-level API Cost Visibility and Alerting for AI SaaS.**

CostShield gives you a fail-safe, 2-line SDK to track backend feature costs and enforce budget limits without acting as a reverse proxy. It monitors your application's external API usage (like OpenAI, Anthropic, or external microservices) and alerts you before bills spiral out of control.

---

## 🏗️ Monorepo Architecture

The project is structured as an `npm workspace` monorepo:

### `packages/api`
The core backend powering CostShield. 
* **Stack:** Node.js, Express, Sequelize, PostgreSQL.
* **Architecture:** Controller/Service/Routes cleanly separating concerns.
* **Database:** Strict TypeScript models, composite primary keys, and explicit migrations.

### `packages/sdk`
A lightweight, zero dependency Node.js SDK for your applications.
* **Stack:** TypeScript, Node.js HTTP/S native libs.
* **Rules:** Fire-and-forget, never throws exceptions, never blocks application runtime. Retry exactly once.

### `packages/shared`
A tightly controlled DTO/Enum sharing library bridging the API, SDK, and frontend.
* Contains request payloads, API boundaries, and database Enums.

### `packages/dashboard`
The CostShield administration UI.
* **Stack:** React, Vite, TypeScript.

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` in the API package:
   ```bash
   cp packages/api/.env.example packages/api/.env
   ```
   Fill in your PostgreSQL root user and database credentials.

3. **Database Setup**
   Ensure PostgreSQL is running, then run migrations and seeders:
   ```bash
   # NOTE: You probably need to create the DB first!
   npm run migrate --workspace=packages/api
   npm run seed --workspace=packages/api
   ```

4. **Run the Application**
   Start the backend and frontend simultaneously:
   ```bash
   # Output API
   npm run dev:api
   
   # In another terminal instance:
   npm run dev:dashboard
   ```

---

## 📜 Strict Engineering Standards
This repository enforces rigorous coding standards:
- **Strict TypeScript:** `any` is forbidden. 
- **Code Quality:** Flat ESLint + Prettier config on all files, zero unused imports, and no default exports allowed in backend code.
- **Fail-safe Logic:** The SDK is designed to silently absorb network failure without taking down the host system.
- **DB Integrity:** Uses `BIGINT` natively for currency, avoids floating point approximations, explicit cascade behaviors, and omits `updated_at` on append-only high volume telemetry data.
