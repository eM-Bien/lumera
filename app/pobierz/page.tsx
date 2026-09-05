// app/pobierz/page.tsx — strona „Twoje pliki". Link z maila prowadzi TUTAJ,
// a nie prosto do pliku: samo wejście na stronę nic nie pobiera (skanery
// poczty nie zużywają limitu). Pobranie uruchamia dopiero kliknięcie przycisku,
// które trafia do /api/pobierz (tam liczy się limit i nakładany jest znak wodny).
import type { Metadata } from "next";
import { verifyDownload } from "@/lib/download-token";
import { getEntry } from "@/lib/server-catalog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

// Strona z prywatnym linkiem do pliku — nigdy nie powinna trafić do Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PobierzPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const payload = t ? verifyDownload(t) : null;
  const entry = payload ? getEntry(payload.id) : null;

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        {entry && t ? (
          <>
            <h1 className={styles.title}>Dziękujemy za zakup w Lumerze</h1>
            <p className={styles.sub}>Twoje pliki są gotowe.</p>
            <a
              className={styles.btn}
              href={`/api/pobierz?t=${encodeURIComponent(t)}`}
              rel="nofollow"
            >
              Pobierz ebook
            </a>
            <p className={styles.note}>
              Link jest ważny 7 dni. Problem z pobraniem? Napisz na
              kontakt@lumera-clinic.pl.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Link nieprawidłowy lub wygasł</h1>
            <p className={styles.sub}>
              Napisz na kontakt@lumera-clinic.pl lub zadzwoń +48 505 829 913 —
              wyślemy nowy link do pobrania.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
