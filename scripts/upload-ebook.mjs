// scripts/upload-ebook.mjs — jednorazowe wgranie PDF-a do PRYWATNEGO
// magazynu Vercel Blob. Prywatnych plików nie wgra się z panelu przeglądarki,
// więc robimy to tym skryptem.
//
// Użycie (PowerShell, z katalogu projektu):
//   node scripts/upload-ebook.mjs "C:\sciezka\do\ebook.pdf"
//
// Wymaga BLOB_READ_WRITE_TOKEN w .env.local (skrypt sam go stamtąd wczyta).
// Po wgraniu wypisze URL — wklej go do .env.local jako EBOOK_1_FILE_URL.
import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const env = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    const m = env.match(/^BLOB_READ_WRITE_TOKEN=(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  return null;
}

const file = process.argv[2];
if (!file) {
  console.error('Użycie: node scripts/upload-ebook.mjs "<ścieżka-do-pdf>"');
  process.exit(1);
}

const token = await loadToken();
if (!token) {
  console.error(
    "Brak BLOB_READ_WRITE_TOKEN. Dodaj go do .env.local (z panelu Vercel → Storage → Twój store → .env.local / Tokens).",
  );
  process.exit(1);
}

const abs = path.resolve(file);
console.log("Plik:", abs);

let data;
try {
  data = await readFile(abs);
} catch (err) {
  console.error(
    "\nNIE ZNALEZIONO PLIKU pod tą ścieżką. Sprawdź, czy jest poprawna " +
      "(użyj cudzysłowów, jeśli są spacje).\nSzczegóły: " + (err.message || err),
  );
  process.exit(1);
}

console.log("Rozmiar:", (data.length / 1024 / 1024).toFixed(2), "MB");

try {
  const name = path.basename(abs);
  const res = await put(name, data, {
    access: "private",
    token,
    contentType: "application/pdf",
    addRandomSuffix: true,
    allowOverwrite: true,
  });

  console.log("\nWgrano ✓");
  console.log("\nWklej ten URL do .env.local jako EBOOK_1_FILE_URL:\n");
  console.log(res.url + "\n");
} catch (err) {
  console.error("\n=== BŁĄD WGRYWANIA DO BLOBA ===");
  console.error("Typ:", err?.name || "?");
  console.error("Komunikat:", err?.message || err);
  if (err?.status) console.error("Status:", err.status);
  process.exit(1);
}
