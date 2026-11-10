// lib/redis.ts — współdzielone połączenie do Redis (Upstash) dla serverless.
// Klient trzymany na poziomie modułu i reużywany między wywołaniami. Zwraca
// null, gdy REDIS_URL nie jest ustawione — wołający ma wtedy przepuścić akcję.
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;
let connecting: Promise<void> | null = null;

// Bez limitów czasu zawieszone połączenie (np. martwe gniazdo po uśpieniu
// funkcji serverless) czeka w nieskończoność, aż Vercel ubije funkcję — klient
// dostaje wtedy tekstowe „An error occurred…" zamiast odpowiedzi API.
const CONNECT_TIMEOUT_MS = 2000;
const OP_TIMEOUT_MS = 2000;

export async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!client) {
    client = createClient({
      url,
      socket: {
        connectTimeout: CONNECT_TIMEOUT_MS,
        // nie próbuj w nieskończoność — przy kolejnym wywołaniu zbudujemy
        // nowe połączenie od zera
        reconnectStrategy: (retries) => (retries > 2 ? false : 200),
      },
    });
    client.on("error", (e) => console.error("Redis error:", e));
  }
  if (!client.isOpen) {
    if (!connecting) {
      connecting = client
        .connect()
        .then(() => undefined)
        .catch((e) => {
          connecting = null;
          throw e;
        });
    }
    await connecting;
    connecting = null;
  }
  return client;
}

/** Porzuca bieżące połączenie — następne getRedis() zestawi nowe. */
function resetClient(): void {
  const old = client;
  client = null;
  connecting = null;
  try {
    old?.destroy();
  } catch {
    // już zamknięte — ignorujemy
  }
}

/**
 * Wykonuje operację na Redisie z limitem czasu. Gdy Redis nie odpowie na czas
 * albo zgłosi błąd, zwraca `fallback` (wołający przepuszcza akcję) i porzuca
 * połączenie, żeby kolejne wywołanie nie trafiło na to samo zawieszone gniazdo.
 */
export async function withRedis<T>(
  fn: (redis: RedisClient) => Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), CONNECT_TIMEOUT_MS + OP_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([
      (async () => {
        const redis = await getRedis();
        return redis ? { value: await fn(redis) } : { value: fallback };
      })(),
      timeout,
    ]);
    if (result === "timeout") {
      console.error(`Redis timeout (${label}) — przepuszczam`);
      resetClient();
      return fallback;
    }
    return result.value;
  } catch (err) {
    console.error(`Redis error (${label}) — przepuszczam:`, err);
    resetClient();
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}
