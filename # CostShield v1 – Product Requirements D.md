# CostShield v1 – Product Requirements Document

**Version:** 1.0
**Codename:** DevShield
**Positioning:** Application-level API Cost Visibility for AI SaaS
**Status:** Ready for Development
**Date:** February 18, 2026

---

> **Core Product Principle**
>
> CostShield must never introduce friction in developer workflow.
> If friction increases, the product dies.
> If integration takes more than 5 minutes, we failed.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Why This Matters in India](#3-why-this-matters-in-india)
4. [Target Users](#4-target-users)
5. [Core Use Cases](#5-core-use-cases)
6. [MVP Feature Scope](#6-mvp-feature-scope)
7. [SDK Design](#7-sdk-design)
8. [User Flows](#8-user-flows)
9. [Technical Architecture](#9-technical-architecture)
10. [Data Model](#10-data-model)
11. [Privacy & Security](#11-privacy--security)
12. [Business Model & Payments](#12-business-model--payments)
13. [Go-to-Market Strategy](#13-go-to-market-strategy)
14. [Validation Hypothesis](#14-validation-hypothesis)
15. [Success Metrics](#15-success-metrics)
16. [Risks & Mitigation](#16-risks--mitigation)
17. [Development Timeline](#17-development-timeline)
18. [Phase 2 Roadmap](#18-phase-2-roadmap)

---

## 1. Product Overview

### What is CostShield?

CostShield is an **application-level API cost visibility tool** designed primarily for AI-powered SaaS applications and usage-based APIs.

It gives developers real-time insight into how their application spends money on usage-based APIs — broken down by feature and by user.

### The One-Line Pitch

> "See exactly where your API money goes — per feature, per user, before it becomes a problem."

### What CostShield v1 Is

- A lightweight SDK that tracks API cost inside your application
- A dashboard that shows cost attribution by feature and user
- An alert system that warns before budget damage escalates

### What CostShield v1 Is NOT

- Not a rate limiter
- Not a proxy or API gateway
- Not an enforcement/blocking system (that's Phase 2)
- Not a replacement for provider billing dashboards
- Not enterprise software

### v1 Scope in One Sentence

> CostShield v1 provides **granular financial visibility and guardrails** — not enforcement.

> The system includes an internal auto-suspend capability at the project level. In v1, this capability is disabled by default and not exposed to users. Phase 2 will introduce auto-suspend as an opt-in enforcement feature.

---

## 2. Problem Statement

### The Core Gap

API providers give developers:

- Account-level billing dashboards
- Monthly usage caps
- Billing alerts

They do **not** give developers:

- Per-user cost visibility inside the application
- Per-feature cost attribution
- Application-level early warning based on business logic

### What This Means in Practice

#### Scenario A: The Runaway Bug

Alex builds an AI resume optimizer. A frontend retry bug triggers 10 OpenAI calls per user action instead of 1.

**Provider dashboard shows:** "Increased usage."

**What Alex cannot see:**

- Which feature caused the spike?
- Which user triggered it?
- When exactly did it start?

**What CostShield shows:**

```
Feature: resume-generation
User: user_12345
Cost spike started: 14:02
Project daily budget: 85% used (↑ from 12% one hour ago)
```

**Result:** Alex catches a $800 potential bill at $42.

---

#### Scenario B: The Free-Tier Abuser

Priya builds an AI chatbot SaaS. Free plan users get "limited" AI access — but there's no tracking to enforce it.

**Reality:** One power user sends 2,000 messages in a day, costing $6.

**What CostShield shows:**

```
Top users by cost today:
  user_4821  →  $6.00  ← free plan user
  user_1033  →  $0.80
  user_0091  →  $0.60
```

**Result:** Priya identifies the abuser, adds real limits, adjusts free-tier pricing.

---

#### Scenario C: The Feature Cost Surprise

Marcus builds a platform with AI chat and AI image generation. He prices both features the same.

**Reality:** Image generation is 20x more expensive per request.

**What CostShield shows:**

```
Cost by feature this week:
  image-generation  →  $340
  ai-chat           →  $28
  doc-summary       →  $15
```

**Result:** Marcus reprices image generation immediately.

---

### Why Existing Solutions Don't Work

| Solution            | Why It Fails                               |
| ------------------- | ------------------------------------------ |
| Provider dashboards | Account-level only, no app context         |
| Rate limiters       | Count requests, not cost                   |
| API gateways        | Heavy infrastructure, complex setup        |
| Manual logging      | Tedious, inconsistent, no aggregation      |
| Custom analytics    | Takes weeks to build, not the core product |

**There is no lightweight, developer-first tool focused specifically on application-level API cost attribution for AI SaaS builders.**

---

## 3. Why This Matters in India

India is the right first market for CostShield.

**Why:**

- Indian SaaS builders are bootstrapped — razor-thin margins
- Highly sensitive to unexpected cloud and API costs
- Heavy and growing OpenAI API usage
- Strong indie developer and SaaS builder community
- Limited focus on application-level API cost visibility tools tailored for Indian indie SaaS builders
- Developers are technical, adopt tools fast, share in communities

**Market reality:**
One bad OpenAI API day can cost ₹5,000–₹50,000 for an indie builder.
CostShield at ₹499/month is cheaper than one bad incident.

**Expansion path:**
India first → validate → expand to US/EU with Stripe.

---

## 4. Target Users

### Primary ICP (v1 Focus)

**Solo developers and small teams building AI-powered SaaS.**

Specifically:

- Building products that call OpenAI, Anthropic, Replicate, Twilio, or SendGrid
- Have direct financial exposure per API request
- Offer free tiers or tiered pricing to end users
- Deploy independently without a DevOps or finance team
- Move fast, ship frequently

### User Persona: "Alex, the AI SaaS Builder"

**Background:**

- Solo developer, building an AI writing assistant SaaS
- Uses OpenAI GPT-4 as core product infrastructure
- 50 free users, 10 paying users
- Spending ~₹25,000/month on API costs

**Current Pain:**

- No idea which users or features consume the most cost
- Afraid of a runaway bug creating a massive bill
- Free users might be abusing the system
- Can't tell which features are profitable vs expensive

**What Alex Needs:**

- See cost breakdown by user and feature
- Get alerted before costs spiral
- Simple tool that integrates in minutes

**What Alex Does NOT Want:**

- Complex infrastructure setup
- Proxy routing that adds latency
- Another heavy dashboard to manage

---

### Secondary ICP (Post-MVP)

- Small SaaS teams (2-10 developers)
- Bootstrapped startups scaling AI features
- API-heavy platforms with multiple paid integrations

---

## 5. Core Use Cases

### Use Case 1: Feature-Level Cost Attribution

**Who:** Any developer with multiple AI-powered features

**Scenario:**

```
Platform has 3 features:
- AI Chat:             $0.002/message
- Image Generation:    $0.04/image
- Document Summary:    $0.01/summary

Developer assumption: Chat is most expensive
Reality: Image generation is 20x more expensive
```

**CostShield behavior:**

1. Each feature tracked with `featureId`
2. Dashboard shows weekly cost by feature
3. Developer reprices or adds usage caps

**Value:** Data-driven pricing and feature decisions.

---

### Use Case 2: Per-User Cost Visibility

**Who:** Developers with free tiers or usage-based plans

**Scenario:**

```
Free plan: "Unlimited" AI chat (no real limit enforced)
Power user: 500 messages/day
Cost: $1.50/day from one free user
Scale: 100 free users × $1.50 = $150/day = $4,500/month
```

**CostShield behavior:**

1. Every chat tracked with `userId`
2. Dashboard shows cost breakdown by user
3. Developer identifies heavy users and enforces real limits

**Value:** Visibility that enables correct product and pricing decisions.

---

### Use Case 3: Runaway Automation Detection

**Who:** Any developer using AI APIs in background jobs

**Scenario:**

```
Background job: Generate AI welcome email for new signups
Bug: Triggers on every DB write, not just signups
Result: 10,000 API calls in 2 hours
```

**CostShield behavior:**

1. Each job call tracked: `featureId: "welcome-email"`
2. Daily budget: ₹4,000
3. At 80% (₹3,200): Warning email sent
4. At 100% (₹4,000): Critical email sent
5. Developer sees `welcome-email` spike in dashboard
6. Fixes bug, redeploys

**Value:** Caught ₹60,000 potential damage at ₹4,000.

---

### Use Case 4: Safe Deployment of New Features

**Who:** Developers launching new AI features

**Scenario:**

```
Developer launches new image generation feature
Unsure of real-world usage patterns
Worried about unexpected cost in first week
```

**CostShield behavior:**

1. Set conservative daily budget: ₹2,000
2. Deploy with confidence
3. If usage spikes: Alert fires immediately
4. Adjust budget as patterns become clear

**Value:** Safe experimentation without financial risk.

---

## 6. MVP Feature Scope

### ✅ IN Scope for v1

#### Feature 1: Node.js SDK

Lightweight npm package with a single `track()` function.

**Accepts:**

- `cost` (required) — estimated cost of the API call in USD
- `featureId` (optional) — label for the feature/endpoint
- `userId` (optional) — your app's user identifier

**Behavior:**

- Async, non-blocking (fire-and-forget)
- Fails silently (logs warning in development mode). Never throws runtime errors in production.
- Retries once on network failure, then abandons

---

#### Feature 2: Minimal Dashboard

**Page 1 — Overview (only this in v1):**

- Today's total cost
- Budget % used
- Top 5 features by cost
- Top 5 users by cost
- Alert status

**Page 2 — Settings:**

- Budget configuration (daily/monthly)
- Alert email preferences
- API key management

> No heavy analytics charts in v1. Ship fast. Add charts in v2.

---

#### Feature 3: Budget Configuration

Per-project budget settings:

```
Daily budget:    ₹4,000  (or $50)
Monthly budget:  ₹80,000 (or $1,000)
Alert threshold: 80% (configurable)
```

---

#### Feature 4: Email Alerts

**Warning (80% of budget):**

> Subject: ⚠️ CostShield: 80% of daily budget reached — My AI App
>
> Your project "My AI App" has used ₹3,200 of your ₹4,000 daily budget.
> Top cost driver: image-generation (₹2,100), ai-chat (₹1,100)
> View dashboard → [link]

**Critical (100% of budget):**

> Subject: 🚨 CostShield: Daily budget exceeded — My AI App
>
> Your project "My AI App" has exceeded your ₹4,000 daily budget.
> Current spend: ₹4,190
> This may indicate a bug, abuse, or unexpected usage spike.
> View dashboard → [link]

**Alert Deduplication Rules:**

- Warning alert fires **once per day per project** (at first 80% crossing)
- Critical alert fires **once per day per project** (at first 100% crossing)
- Alerts reset when daily budget resets at 00:00 UTC
- No repeated alerts for the same threshold within one budget day

---

#### Feature 5: Project Management

- Create multiple projects (one per app or environment)
- Each project has a unique API key (`cs_live_...`)
- Separate budgets and tracking per project
- Projects are **single-owner** — no invites, no shared access, no RBAC in v1

---

#### Feature 6: Authentication

- GitHub OAuth (primary — trusted by developers)
- Google OAuth (secondary — broad coverage)
- JWT-based session management

> Email + password auth is **Phase 2**. OAuth-only in v1 keeps auth simple, avoids password reset flows, and matches the developer persona.

---

### ❌ NOT in v1

| Feature                   | Reason                          | When    |
| ------------------------- | ------------------------------- | ------- |
| Per-user auto-blocking    | Complex, race conditions        | Phase 2 |
| Per-feature auto-blocking | Same                            | Phase 2 |
| Slack/Discord alerts      | Nice-to-have                    | Phase 2 |
| Webhooks                  | Advanced users only             | Phase 2 |
| Python/Go SDK             | Node.js first                   | Phase 2 |
| API provider templates    | Manual config works universally | Phase 2 |
| Usage charts/graphs       | Keep dashboard minimal          | Phase 2 |
| Team collaboration        | Solo devs first                 | Phase 3 |
| Mobile app                | Not needed                      | Future  |

---

## 7. SDK Design

### Installation

```bash
npm install @costshield/sdk
```

### Initialization

```javascript
// costshield.js — initialize once, import everywhere
const { CostShield } = require('@costshield/sdk');

const costshield = new CostShield({
  apiKey: process.env.COSTSHIELD_API_KEY,
});

module.exports = costshield;
```

### Core Tracking Function

```typescript
costshield.track(options: TrackOptions): void  // fire-and-forget, no await needed

interface TrackOptions {
  cost: number;        // Required. Cost in USD (e.g., 0.002)
  featureId?: string;  // Optional. e.g., "ai-chat", "image-generation"
  userId?: string;     // Optional. Your app's user ID
}
```

### Real-World Usage Examples

#### Example 1: Basic OpenAI Tracking

```javascript
const costshield = require('./costshield');

app.post('/api/chat', async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: req.body.messages,
  });

  // Fire-and-forget — no await, no latency added
  costshield.track({
    cost: 0.03,
    featureId: 'ai-chat',
    userId: req.user.id,
  });

  res.json(completion.choices[0].message);
});
```

---

#### Example 2: Token-Based Accurate Cost Tracking

```javascript
app.post('/api/summarize', async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: req.body.text }],
  });

  // Calculate actual cost from token usage
  const inputCost = (completion.usage.prompt_tokens / 1000) * 0.0015;
  const outputCost = (completion.usage.completion_tokens / 1000) * 0.002;

  costshield.track({
    cost: inputCost + outputCost,
    featureId: 'doc-summary',
    userId: req.user.id,
  });

  res.json({ summary: completion.choices[0].message.content });
});
```

---

#### Example 3: Tracking Multiple APIs

```javascript
// OpenAI
costshield.track({ cost: 0.002, featureId: 'ai-chat', userId: req.user.id });

// Twilio SMS
costshield.track({ cost: 0.0075, featureId: 'sms-otp', userId: req.user.id });

// SendGrid Email
costshield.track({ cost: 0.0001, featureId: 'email-welcome', userId: req.user.id });

// Replicate Image Generation
costshield.track({ cost: 0.0023, featureId: 'image-generation', userId: req.user.id });
```

---

#### Example 4: Background Job Tracking

```javascript
async function generateWeeklyReports() {
  const users = await db.getActiveUsers();

  for (const user of users) {
    const report = await openai.chat.completions.create({...});

    // Track per user so you can see cost per user in dashboard
    costshield.track({
      cost: 0.05,
      featureId: 'weekly-report-job',
      userId: user.id,
    });

    await db.saveReport(user.id, report);
  }
}
```

---

### SDK Behavior Rules

| Scenario                   | Behavior                                         |
| -------------------------- | ------------------------------------------------ |
| CostShield API unreachable | Fails silently, logs warning to console          |
| Invalid API key            | Logs error to console, does not throw            |
| Budget exceeded (v1)       | Tracks event, triggers alert — does NOT block    |
| Network timeout            | Retries once after 500ms, then abandons silently |
| Any SDK error              | Never throws, never breaks user's app            |

**Critical rule:** The SDK must NEVER break the user's application. All failures are silent.

---

## 8. User Flows

### Flow 1: Onboarding

```
1. Developer visits costshield.dev
2. Signs up with GitHub OAuth
3. Creates project: "My AI App"
4. Copies API key: cs_live_abc123xyz
5. npm install @costshield/sdk
6. Adds 2 lines of code to app
7. Sets daily budget: ₹4,000
8. Deploys
9. Returns to dashboard → sees first tracked requests
✅ Protected. Done. Under 10 minutes.
```

---

### Flow 2: Normal Daily Check

```
1. Developer opens dashboard
2. Sees: "Today: ₹1,240 / ₹4,000 (31%)"
3. Top features:
   - image-generation: ₹820
   - ai-chat:          ₹420
4. Top users:
   - user_4821: ₹310
   - user_1033: ₹240
5. Everything looks normal
✅ Closes dashboard. Peace of mind.
```

---

### Flow 3: Budget Warning → Investigation

```
1. App hits 80% of daily budget (₹3,200 of ₹4,000)
2. CostShield sends warning email
3. Developer opens dashboard
4. Sees spike in image-generation at 2pm
5. Finds retry bug in image generation code
6. Fixes bug, redeploys
7. Budget stabilizes
✅ Caught before critical damage.
```

---

### Flow 4: Critical Alert — Runaway Bug

```
1. Background job bug: 500 API calls/minute
2. Budget exceeded in 20 minutes
3. CostShield sends critical email
4. Developer sees spike in "weekly-report-job"
5. Kills background job immediately
6. Fixes bug
7. Budget resets next day
✅ Damage contained to one day.
```

---

### Flow 5: Discovering a Free-Tier Abuser

```
1. Developer checks dashboard
2. Sees Top Users by Cost:
   - user_4821: ₹3,500 this week (!)
   - user_1033: ₹260
3. user_4821 is on free plan
4. Developer adds real usage cap to free plan
5. Contacts user_4821 to upgrade
✅ Pricing decision made with real data.
```

---

## 9. Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Developer's Application                    │
│                                                              │
│  const completion = await openai.chat.completions.create();  │
│  costshield.track({ cost: 0.002, featureId: 'ai-chat',      │
│                      userId: req.user.id });  // no await    │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ HTTPS POST (async, non-blocking)
                               ▼
              ┌────────────────────────────────┐
              │     CostShield Backend API      │
              │     (Node.js + Express)         │
              │                                 │
              │  POST /api/v1/track             │
              │  - Validate API key             │
              │  - Write usage event            │
              │  - Update daily aggregate       │
              │  - Check budget threshold       │
              │  - Trigger alert if needed      │
              └──────────┬─────────────┬────────┘
                         │             │
              ┌──────────▼──┐    ┌─────▼──────────┐
              │  PostgreSQL  │    │  Email Service  │
              │  Database    │    │  (Resend)       │
              └──────────────┘    └────────────────┘
                         ▲
                         │
              ┌──────────┴───────────────────┐
              │   React Dashboard (Vite)      │
              │                              │
              │  - Overview: cost + budget   │
              │  - Top features + users      │
              │  - Settings: budgets, alerts │
              └──────────────────────────────┘
```

---

### Technology Stack

| Component             | Technology                         | Reason                                            |
| --------------------- | ---------------------------------- | ------------------------------------------------- |
| SDK                   | Node.js + TypeScript               | Matches developer ecosystem                       |
| Backend API           | Node.js + Express                  | Fast to build, familiar                           |
| Database              | PostgreSQL                         | Reliable, good for aggregation                    |
| Frontend              | React + Vite                       | Fast, modern                                      |
| Hosting (backend)     | Railway                            | Simple deployment                                 |
| Hosting (frontend)    | Vercel                             | Free tier, instant deploys                        |
| Email                 | Resend                             | Developer-first, great TS support, simple API     |
| Auth                  | GitHub OAuth + Google OAuth + JWT  | Trusted by developers; password auth in Phase 2   |
| Payments (v1)         | Plan logic only — no live gateway  | Validate product before adding payment complexity |
| Payments (Phase 1.5+) | Razorpay (India) → Stripe (Global) | Add after first 10–20 real users                  |

---

### API Endpoints

#### SDK → Backend

**`POST /api/v1/track`**

Request:

```json
{
  "apiKey": "cs_live_abc123xyz",
  "cost": 0.002,
  "featureId": "ai-chat",
  "userId": "user_4821",
  "timestamp": "2026-02-18T12:34:56Z"
}
```

Response (success):

```json
{
  "ok": true,
  "budgetStatus": {
    "dailyUsed": 42.5,
    "dailyLimit": 50.0,
    "percentUsed": 85,
    "status": "warning"
  }
}
```

> **Note:** The SDK does not await this response in v1. The `budgetStatus` in the response is intended for debugging and future enhancements (e.g., Phase 2 enforcement). The SDK fires and forgets — response data is not used at runtime.

---

#### Dashboard → Backend

**Auth:**

```
POST   /api/auth/github       GitHub OAuth callback
POST   /api/auth/google       Google OAuth callback
POST   /api/auth/logout       Logout
GET    /api/auth/me           Current user
```

**Projects:**

```
GET    /api/projects          List all projects
POST   /api/projects          Create project
GET    /api/projects/:id      Get project details
PUT    /api/projects/:id      Update settings
DELETE /api/projects/:id      Delete project
```

**Usage Data:**

```
GET    /api/projects/:id/stats          Today's stats
GET    /api/projects/:id/features       Cost by featureId (top 5)
GET    /api/projects/:id/users          Cost by userId (top 5)
```

**Settings:**

```
PUT    /api/projects/:id/budget         Update budget config
PUT    /api/projects/:id/alerts         Update alert config
POST   /api/projects/:id/rotate-key    Rotate API key
```

---

## 10. Data Model

### Database Schema

#### `users`

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE,
  github_id     VARCHAR(100) UNIQUE,
  github_login  VARCHAR(100),
  avatar_url    TEXT,
  plan          VARCHAR(20) DEFAULT 'free',  -- 'free', 'starter', 'pro'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `projects`

```sql
CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  api_key           VARCHAR(64) UNIQUE NOT NULL,
  daily_budget      NUMERIC(10,2) DEFAULT 50.00,
  monthly_budget    NUMERIC(10,2) DEFAULT 1000.00,
  alert_threshold   NUMERIC(3,2) DEFAULT 0.80,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

#### `usage_events`

```sql
CREATE TABLE usage_events (
  id            BIGSERIAL PRIMARY KEY,
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
  cost          NUMERIC(10,6) NOT NULL,
  feature_id    VARCHAR(255),
  user_id       VARCHAR(255),
  tracked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_project_time    ON usage_events(project_id, tracked_at DESC);
CREATE INDEX idx_usage_feature         ON usage_events(project_id, feature_id, tracked_at DESC);
CREATE INDEX idx_usage_user            ON usage_events(project_id, user_id, tracked_at DESC);
```

#### `daily_usage` (aggregates for performance)

```sql
CREATE TABLE daily_usage (
  id              BIGSERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  total_cost      NUMERIC(10,4) DEFAULT 0,
  total_requests  INTEGER DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, date)
);
```

#### `alerts_log`

```sql
CREATE TABLE alerts_log (
  id            BIGSERIAL PRIMARY KEY,
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
  alert_type    VARCHAR(20) NOT NULL,  -- 'warning', 'critical'
  daily_cost    NUMERIC(10,4),
  daily_limit   NUMERIC(10,4),
  sent_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Daily Budget Reset

Daily budgets reset at **00:00 UTC** each day.
Timezone configurability (e.g., IST reset) is deferred to Phase 2.

---

### Data Retention Policy

| Data Type            | Retention          |
| -------------------- | ------------------ |
| Raw usage events     | 30 days            |
| Daily aggregates     | Indefinitely       |
| Alert logs           | 90 days            |
| Deleted project data | Immediately purged |

---

## 11. Privacy & Security

### Data We Collect

✅ **Stored:**

- API key identifier (project reference)
- Timestamp
- Cost value (number you provide)
- `featureId` label (string you provide)
- `userId` label (your app's internal ID — not PII)

❌ **Never Stored:**

- API request payloads
- API response data
- User names, emails, or personal data from your app
- Your API keys (OpenAI, Anthropic, etc.)
- IP addresses of your end users

### Privacy Positioning

> "CostShield tracks cost metadata only. We never see your data or your users' data."

This is a core trust differentiator. State it clearly on the landing page and in all documentation.

---

### Security Measures

| Area                         | Implementation                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| API keys                     | `cs_live_` (prod) / `cs_test_` (dev) prefix, stored as hash                                |
| Transport                    | HTTPS only, HSTS enforced                                                                  |
| Auth tokens                  | JWT, 24-hour expiry                                                                        |
| OAuth                        | GitHub + Google — no password storage in v1                                                |
| Rate limiting (SDK endpoint) | 1,000 tracking requests/minute per API key — to prevent abuse of CostShield infrastructure |
| SQL injection                | Parameterized queries only                                                                 |

---

## 12. Business Model & Payments

### Pricing Tiers

#### Free Tier (Forever Free)

**Target:** Evaluation, hobbyists, side projects

- 1 project
- 10,000 tracked requests/month
- 7-day usage history
- Email alerts
- Basic dashboard

#### Starter

**India:** ₹499/month | **Global (later):** $9/month

**Target:** Solo developers, early-stage SaaS

- 5 projects
- 100,000 tracked requests/month
- 30-day usage history
- Email alerts
- Per-feature and per-user cost breakdown

#### Pro

**India:** ₹999/month | **Global (later):** $19/month

**Target:** Growing SaaS, small teams

- 20 projects
- 1,000,000 tracked requests/month
- 90-day usage history
- Priority email alerts

---

### Why ₹499 / ₹999 Works in India

- Psychologically affordable for indie developers
- Less than one bad API incident
- Serious enough to not feel like a toy
- Easy to justify: "₹499 to prevent a ₹50,000 bill"

---

### Payment Infrastructure

### Currency Standardization

All cost tracking is internally stored in **USD** for consistency.
Dashboard displays amounts in the **user's selected currency** (INR for India launch).
Conversion rate applied at display time, not at ingestion.

---

### v1 Billing Scope — Plan Logic Only

The core hypothesis of v1 is:

> Developers care enough to integrate the SDK and check the dashboard.

If that fails, billing doesn't matter. Adding live payment complexity before validating the hypothesis increases build time and risk.

**v1 billing scope:**

- Plan table and subscription table exist in DB
- All users start on **Free plan** automatically on signup
- Plan limits (`request_limit`, `project_limit`) are **actively enforced**
- Upgrade button shows **"Coming Soon"** or a waitlist capture form
- No live payment processing in v1

**Phase 1.5 (after 10–20 real users):** Add Razorpay

- UPI, cards, netbanking, wallets
- INR pricing
- Real subscription creation and plan upgrade flow

**Phase 2 (Global expansion):** Add Stripe

- US/EU billing
- Keep Razorpay for India users

---

### Early Adopter Strategy

| Users       | Offer                   | Goal                    |
| ----------- | ----------------------- | ----------------------- |
| First 10    | Free forever (Pro plan) | Champions, testimonials |
| Users 11–50 | 30-day free trial       | Conversion validation   |
| Users 51+   | 14-day free trial       | Standard funnel         |

---

### Revenue Projections (Conservative)

**Month 1 target: ₹5,000 MRR (~$60)**

- 10 free (early adopters)
- 5 Starter × ₹499 = ₹2,495
- 3 Pro × ₹999 = ₹2,997
- **Total: ~₹5,500 MRR**

**Month 3 target: ₹20,000 MRR (~$240)**

- 25 Starter × ₹499 = ₹12,475
- 8 Pro × ₹999 = ₹7,992
- **Total: ~₹20,500 MRR**

> Revised down from ₹50,000. Realistic for a solo infra tool without paid marketing.

---

## 13. Go-to-Market Strategy

### Launch Sequence

```
Week 1-2:  Build MVP (SDK + backend + dashboard)
Week 3:    Deploy, test, fix bugs
Week 4:    Landing page + start outreach
Month 2:   Iterate on feedback, expand outreach
Month 3:   Product Hunt launch (after 50+ users)
```

---

### Primary Channel: Twitter/X Direct Outreach

**Step 1 — Find targets:**
Search Twitter for:

- `"just launched" AI tool`
- `"building" OpenAI SaaS`
- `"indie hacker" AI`
- `"side project" API`

**Step 2 — Send DM:**

> Hey [Name]! 👋
>
> Saw you're building [Product] — looks great!
>
> I built CostShield to help developers see exactly where their API costs go — per feature, per user. Catches runaway bugs and free-tier abusers before they get expensive.
>
> Would love to give you free early access and get your feedback. Interested?

---

### Secondary Channels

| Channel                         | Action                                  |
| ------------------------------- | --------------------------------------- |
| Reddit r/SaaS, r/SideProject    | Share launch post                       |
| Reddit r/IndieHackers, r/OpenAI | Share as tool for AI devs               |
| Indie Hackers                   | Create product page, share build story  |
| Product Hunt                    | Launch after 50+ users and testimonials |

---

### Messaging Framework

**Hero headline:**

> "See exactly where your API money goes — per feature, per user, before it becomes a problem."

**Sub-headline:**

> "CostShield is a lightweight SDK that tracks API cost attribution inside your application. Catch runaway bugs, identify expensive features, and stop free-tier abusers — before they become expensive problems."

**Key proof points:**

1. 2-line integration
2. Privacy-first (cost metadata only, never payloads)
3. Works with any API
4. ₹499/month — less than one bad API day

---

## 14. Validation Hypothesis

### What We Believe

1. **Developers building AI SaaS care about feature-level cost visibility.**
   - Validated if: 60%+ of signups complete SDK integration
   - Invalidated if: Most signups never add tracking code

2. **At least 20% of active users will check the dashboard weekly.**
   - Validated if: Weekly active users > 20% of total users
   - Invalidated if: Dashboard is checked only once after signup

3. **At least 15% of free users will upgrade after hitting usage limits.**
   - Validated if: Free → Paid conversion > 15%
   - Invalidated if: Users churn instead of upgrading

### What Failure Means

If developers don't check the dashboard regularly → the problem intensity is weak.
If that happens → re-evaluate positioning before building Phase 2.

---

## 15. Success Metrics

### Activation Event

> A user is **activated** when:
>
> 1. SDK is installed
> 2. At least 100 events tracked
> 3. Budget is configured

This is the north-star early metric.

---

### MVP Validation (First 4 Weeks)

**The single most important metric:**

> At least **1 developer** installs SDK, sets a budget, and receives an alert.

This proves the core loop works end-to-end.

---

### Product Metrics

| Metric                                    | Target       |
| ----------------------------------------- | ------------ |
| Time to first tracked request             | < 10 minutes |
| Signup → SDK integration rate             | > 60%        |
| Activation rate (100 events + budget set) | > 50%        |
| 7-day retention                           | > 70%        |
| 30-day retention                          | > 40%        |
| Free → Paid conversion                    | > 15%        |
| Dashboard weekly active rate              | > 20%        |

---

### Business Metrics

| Metric       | Month 1 | Month 3 |
| ------------ | ------- | ------- |
| Total users  | 20      | 70      |
| Paying users | 8       | 30      |
| MRR (INR)    | ₹5,000  | ₹20,000 |
| Churn rate   | < 10%   | < 7%    |

---

## 16. Risks & Mitigation

### Risk 1: Developers Don't Want Extra Instrumentation

**This is the biggest risk.**

Developers may resist adding tracking calls to their code — it feels like extra work.

**Mitigation:**

- Provide OpenAI helper wrapper (one line replaces two)
- Copy-paste examples for every major API
- Keep SDK extremely small (< 5KB)
- Show "saved incident" stories in marketing
- Make integration feel like 2 lines, not a chore

---

### Risk 2: SDK Adds Latency

**Probability:** Medium | **Impact:** High

**Mitigation:**

- Fire-and-forget — no `await` required
- SDK never blocks the main request path
- Timeout: 500ms max, then abandon silently

```javascript
// Correct — non-blocking
costshield.track({ cost: 0.002, featureId: 'ai-chat' });
// Execution continues immediately
```

---

### Risk 3: Developers Don't See Value

**Probability:** Medium | **Impact:** Critical

**Mitigation:**

- Lead with specific, relatable sc
