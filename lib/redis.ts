// lib/redis.ts — współdzielone połączenie do Redis (Upstash) dla serverless.
// Klient trzymany na poziomie modułu i reużywany między wywołaniami. Zwraca
// null, gdy REDIS_URL nie jest ustawione — wołający ma wtedy przepuścić akcję.
import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;
let connecting: Promise<void> | null = null;

export async function getRedis(): Promise<ReturnType<typeof createClient> | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!client) {
    client = createClient({ url });
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
