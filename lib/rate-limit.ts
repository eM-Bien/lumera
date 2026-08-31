// lib/rate-limit.ts — limit zapytań na IP (okno stałe) oparty o Redis.
// Chroni publiczne endpointy, które kosztują: wysyłkę maila (/api/kontakt)
// i tworzenie sesji Stripe (/api/checkout).
//
// Gdy Redis jest niedostępny — PRZEPUSZCZAMY. Limiter to bezpiecznik przed
// nadużyciem, nie kontrola dostępu; awaria Redisa nie może zablokować
// prawdziwemu klientowi kontaktu ani zakupu (tak samo jak licznik pobrań).
import crypto from "node:crypto";
import { getRedis } from "./redis";

export type RateLimitOptions = {
  bucket: string; // nazwa licznika, żeby endpointy nie dzieliły puli
  limit: number; // ile zapytań na okno
  windowS: number; // długość okna w sekundach
};

export type RateLimitResult = { rateLimited: boolean; retryAfterS: number };

const PASS: RateLimitResult = { rateLimited: false, retryAfterS: 0 };

// Za proxy (Vercel) prawdziwe IP jest w x-forwarded-for; bierzemy pierwszy
// wpis, bo kolejne dopisują pośrednicy.
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

// IP trzymamy wyłącznie jako skrót — w Redisie nie leżą dane osobowe.
function keyFor(bucket: string, ip: string): string {
  const hash = crypto.createHash("sha256").update(ip).digest("hex");
  return `rl:${bucket}:${hash.slice(0, 32)}`;
}

export async function checkRateLimit(
  request: Request,
  { bucket, limit, windowS }: RateLimitOptions,
): Promise<RateLimitResult> {
  try {
    const redis = await getRedis();
    if (!redis) return PASS;

    const key = keyFor(bucket, clientIp(request));
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowS);
    if (count <= limit) return PASS;

    const ttl = await redis.ttl(key);
    return { rateLimited: true, retryAfterS: ttl > 0 ? ttl : windowS };
  } catch (err) {
    console.error("Rate limit error (przepuszczam zapytanie):", err);
    return PASS;
  }
}
