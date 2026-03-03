/**
 * CostShield – /api/v1/track Concurrency Sanity Test
 *
 * Validates that under 20 parallel requests:
 *   - total_cost increments correctly (no lost updates)
 *   - total_requests increments correctly
 *   - Exactly ONE warning alert fires
 *   - Exactly ONE critical alert fires
 *   - No duplicate budget_alert rows
 *
 * Usage:
 *   npx ts-node -r dotenv/config scripts/testTrackConcurrency.ts
 */

import http from 'http';
import crypto from 'crypto';

import dotenv from 'dotenv';
dotenv.config();

// Sequelize instance + models (bootstraps associations via index.ts)
import { sequelize } from '../src/database';
import { User, Project, DailyCost, BudgetAlert } from '../src/models';
import { generateApiKey } from '../src/utils/apiKey';
import { ProjectStatus } from '@costshield/shared';

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const CONCURRENCY = 20;
const COST_PER_REQUEST = 100;
const DAILY_BUDGET = 1000; // 20 * 100 = 2000, so budget hit at request 11 (100%)

const EXPECTED_TOTAL_COST = CONCURRENCY * COST_PER_REQUEST;        // 2000
const EXPECTED_TOTAL_REQUESTS = CONCURRENCY;                        // 20
const EXPECTED_WARNING_ALERTS = 1;
const EXPECTED_CRITICAL_ALERTS = 1;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const log = (msg: string): void => {
  console.log(`[TEST] ${msg}`);
};

const pass = (label: string): void => {
  console.log(`  ✅ PASS: ${label}`);
};

const fail = (label: string, got: unknown, expected: unknown): void => {
  console.log(`  ❌ FAIL: ${label}`);
  console.log(`         Expected: ${JSON.stringify(expected)}`);
  console.log(`         Got:      ${JSON.stringify(got)}`);
};

// ─── HTTP Request ─────────────────────────────────────────────────────────────

const sendTrackRequest = (rawApiKey: string): Promise<{ status: number; ok: boolean }> => {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      apiKey: rawApiKey,
      cost: COST_PER_REQUEST,
    });

    const url = new URL(`${API_BASE}/api/v1/track`);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 5000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 0,
            ok: (res.statusCode ?? 0) < 400,
          });
        });
      },
    );

    req.on('error', (err) => {
      console.error(`  [HTTP ERROR] ${err.message}`);
      resolve({ status: 0, ok: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false });
    });

    req.write(body);
    req.end();
  });
};

// ─── Setup ────────────────────────────────────────────────────────────────────

interface SetupResult {
  userId: string;
  projectId: string;
  rawApiKey: string;
  testTag: string;
}

const setupTestData = async (): Promise<SetupResult> => {
  const testTag = crypto.randomBytes(4).toString('hex');
  const email = `concurrency-test-${testTag}@costshield.test`;

  // 1. Create test user
  const user = await User.create({
    email,
    firstName: 'Test',
    lastName: 'Concurrency',
    isEmailVerified: true,
    isActive: true,
  });

  // 2. Generate API key materials
  const { rawKey, keyHash, keyPrefix } = generateApiKey();

  // 3. Create test project
  const project = await Project.create({
    userId: user.id,
    name: `Concurrency Test ${testTag}`,
    slug: `concurrency-test-${testTag}`,
    status: ProjectStatus.ACTIVE,
    keyPrefix,
    apiKeyHash: keyHash,
    currencyCode: 'USD',
    dailyBudget: BigInt(DAILY_BUDGET),
    monthlyBudget: null,
    alertThreshold: 80,
  });

  return {
    userId: user.id,
    projectId: project.id,
    rawApiKey: rawKey,
    testTag,
  };
};

// ─── Cleanup ──────────────────────────────────────────────────────────────────

const cleanup = async (userId: string): Promise<void> => {
  // Cascade deletes handle project → cost_events, daily_costs, budget_alerts
  await User.destroy({ where: { id: userId } });
  log(`Cleaned up test user and all associated data.`);
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const main = async (): Promise<void> => {
  let userId: string | null = null;
  let allPassed = true;

  try {
    log('Connecting to database...');
    await sequelize.authenticate();
    log('Database connected.\n');

    // Setup
    log('Setting up test data...');
    const { userId: uid, projectId, rawApiKey, testTag } = await setupTestData();
    userId = uid;
    log(`Test user ID:    ${uid}`);
    log(`Test project ID: ${projectId}`);
    log(`Test tag:        ${testTag}`);
    log(`API Key prefix:  ${rawApiKey.substring(0, 16)}...`);
    log(`Daily budget:    ${DAILY_BUDGET}`);
    log(`Sending:         ${CONCURRENCY} requests × $${COST_PER_REQUEST} = total $${EXPECTED_TOTAL_COST}\n`);

    // Wait a moment to ensure API server can process (assumes server is running)
    const today = new Date().toISOString().split('T')[0];

    log(`Firing ${CONCURRENCY} parallel requests...`);
    const startMs = Date.now();

    const results = await Promise.all(
      Array.from({ length: CONCURRENCY }, () => sendTrackRequest(rawApiKey)),
    );

    const elapsed = Date.now() - startMs;
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.filter((r) => !r.ok).length;

    log(`Requests completed in ${elapsed}ms.`);
    log(`  HTTP 2xx: ${successCount} / ${CONCURRENCY}`);
    log(`  HTTP errors: ${failCount}\n`);

    if (failCount > 0) {
      const statuses = results.filter((r) => !r.ok).map((r) => r.status);
      log(`  Non-2xx status codes seen: ${statuses.join(', ')}`);
    }

    // ── DB Verification ──────────────────────────────────────────────────────

    log('Querying database for results...');

    const dailyCost = await DailyCost.findOne({
      where: { projectId, date: today },
    });

    const alerts = await BudgetAlert.findAll({
      where: { projectId, date: today },
      order: [['createdAt', 'ASC']],
    });

    log('');
    log('─────────────────────────────────────────────');
    log('  RESULTS');
    log('─────────────────────────────────────────────');
    log(`  total_cost:      ${dailyCost?.totalCost ?? 'N/A'}`);
    log(`  total_requests:  ${dailyCost?.totalRequests ?? 'N/A'}`);
    log(`  budget_alerts:   ${alerts.length}`);
    alerts.forEach((a, i) => {
      log(`    alert[${i}]: type=${a.type}, cost=${a.cost}, budget=${a.budget}`);
    });
    log('─────────────────────────────────────────────\n');

    // ── PASS / FAIL checks ───────────────────────────────────────────────────

    log('ASSERTION RESULTS:');

    // 1. total_cost
    const actualCost = dailyCost ? Number(dailyCost.totalCost) : -1;
    if (actualCost === EXPECTED_TOTAL_COST) {
      pass(`total_cost == ${EXPECTED_TOTAL_COST}`);
    } else {
      fail('total_cost', actualCost, EXPECTED_TOTAL_COST);
      allPassed = false;
    }

    // 2. total_requests
    const actualRequests = dailyCost?.totalRequests ?? -1;
    if (actualRequests === EXPECTED_TOTAL_REQUESTS) {
      pass(`total_requests == ${EXPECTED_TOTAL_REQUESTS}`);
    } else {
      fail('total_requests', actualRequests, EXPECTED_TOTAL_REQUESTS);
      allPassed = false;
    }

    // 3. warning alerts (should be exactly 1)
    const warningAlerts = alerts.filter((a) => a.type === 'warning');
    if (warningAlerts.length === EXPECTED_WARNING_ALERTS) {
      pass(`warning alerts == ${EXPECTED_WARNING_ALERTS}`);
    } else {
      fail('warning alerts', warningAlerts.length, EXPECTED_WARNING_ALERTS);
      allPassed = false;
    }

    // 4. critical alerts (should be exactly 1)
    const criticalAlerts = alerts.filter((a) => a.type === 'critical');
    if (criticalAlerts.length === EXPECTED_CRITICAL_ALERTS) {
      pass(`critical alerts == ${EXPECTED_CRITICAL_ALERTS}`);
    } else {
      fail('critical alerts', criticalAlerts.length, EXPECTED_CRITICAL_ALERTS);
      allPassed = false;
    }

    // 5. no duplicate alerts total (warning + critical = 2 max)
    const totalAlerts = alerts.length;
    const expectedTotal = EXPECTED_WARNING_ALERTS + EXPECTED_CRITICAL_ALERTS;
    if (totalAlerts === expectedTotal) {
      pass(`no duplicate alerts (total == ${expectedTotal})`);
    } else {
      fail('no duplicate alerts', totalAlerts, expectedTotal);
      allPassed = false;
    }

    log('');
    if (allPassed) {
      console.log('🎉 ALL CHECKS PASSED — /track is concurrency-safe.\n');
    } else {
      console.log('⚠️  SOME CHECKS FAILED — review UPSERT and alert deduplication logic.\n');
    }
  } catch (err) {
    console.error('\n[FATAL]', err instanceof Error ? err.message : String(err));
    allPassed = false;
  } finally {
    if (userId) {
      log('Cleaning up test data...');
      await cleanup(userId);
    }
    await sequelize.close();
    process.exit(allPassed ? 0 : 1);
  }
};

main();
