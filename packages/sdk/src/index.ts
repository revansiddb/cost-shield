import https from 'https';
import http from 'http';

interface TrackOptions {
  cost: number;
  featureId?: string;
  userId?: string;
}

interface CostShieldConfig {
  apiKey: string;
  endpoint?: string;
}

const SDK_TIMEOUT_MS = 500;
const SDK_MAX_RETRIES = 1;

export class CostShield {
  private apiKey: string;
  private endpoint: string;

  constructor(config: CostShieldConfig) {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || 'https://api.costshield.dev';
  }

  /**
   * Track an API cost event. Fire-and-forget — never blocks, never throws.
   */
  track(options: TrackOptions): void {
    // Validate locally — fail silently if invalid
    if (typeof options.cost !== 'number' || options.cost < 0) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.warn('[CostShield] Invalid cost value:', options.cost);
      }
      return;
    }

    const payload = JSON.stringify({
      apiKey: this.apiKey,
      cost: options.cost,
      featureId: options.featureId,
      userId: options.userId,
      timestamp: new Date().toISOString(),
    });

    this._send(payload, 0);
  }

  private _send(payload: string, attempt: number): void {
    try {
      const url = new URL(`${this.endpoint}/api/v1/track`);
      const isHttps = url.protocol === 'https:';
      const transport = isHttps ? https : http;

      const req = transport.request(
        {
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          timeout: SDK_TIMEOUT_MS,
        },
        (res) => {
          // Consume response to free socket
          res.resume();
        },
      );

      req.on('error', () => {
        if (attempt < SDK_MAX_RETRIES) {
          setTimeout(() => this._send(payload, attempt + 1), SDK_TIMEOUT_MS);
        }
        // else: fail silently
      });

      req.on('timeout', () => {
        req.destroy();
        if (attempt < SDK_MAX_RETRIES) {
          setTimeout(() => this._send(payload, attempt + 1), SDK_TIMEOUT_MS);
        }
      });

      req.write(payload);
      req.end();
    } catch {
      // Never throw — SDK rule: all failures are silent
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.warn('[CostShield] Failed to send tracking event');
      }
    }
  }
}
