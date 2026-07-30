"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LOCATIONS } from "../OfferExplorer/offer-types";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import {
  BOOKING_OPTIONS,
  CONSULTATION_VALUE,
  resolveBookingId,
} from "./booking-options";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "success" | "error";

const PORA_OPTIONS = [
  "",
  "Rano (9–12)",
  "Południe (12–15)",
  "Popołudnie (15–19)",
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const initialZabieg = resolveBookingId(searchParams.get("zabieg"));

  const [zabieg, setZabieg] = useState(initialZabieg);
  const [lokalizacja, setLokalizacja] = useState<string>("");
  const [data, setData] = useState("");
  const [pora, setPora] = useState("");
  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [zgoda, setZgoda] = useState(false);
  const [firma, setFirma] = useState(""); // honeypot

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // zabiegi pogrupowane do <optgroup>
  const groups = useMemo(() => {
    const map = new Map<string, typeof BOOKING_OPTIONS>();
    for (const o of BOOKING_OPTIONS) {
      const arr = map.get(o.group) ?? [];
      arr.push(o);
      map.set(o.group, arr);
    }
    return [...map.entries()];
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zabieg,
          lokalizacja,
          data,
          pora,
          imie,
          email,
          telefon,
          wiadomosc,
          zgoda,
          firma,
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setErrorMsg(json?.error ?? "Nie udało się wysłać. Spróbuj ponownie.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Brak połączenia. Spróbuj ponownie.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>Dziękujemy!</p>
        <p className={styles.successText}>
          Twoja prośba o termin została wysłana. Odezwiemy się na podany kontakt,
          żeby potwierdzić szczegóły.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.formTitle}>Umów się na zabieg</h2>

      <label className={styles.field}>
        <span className={styles.label}>Zabieg</span>
        <select
          className={styles.select}
          value={zabieg}
          onChange={(e) => setZabieg(e.target.value)}
        >
          <option value={CONSULTATION_VALUE}>
            Konsultacja / nie wiem jeszcze
          </option>
          {groups.map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <fieldset className={styles.field}>
        <span className={styles.label}>Lokalizacja *</span>
        <div className={styles.chips}>
          {LOCATIONS.map((loc) => {
            const on = lokalizacja === loc;
            return (
              <button
                key={loc}
                type="button"
                className={`${styles.chip} ${on ? styles.chipActive : ""}`}
                aria-pressed={on}
                onClick={() => setLokalizacja(loc)}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Preferowana data</span>
          <input
            type="date"
            className={styles.input}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Pora dnia</span>
          <select
            className={styles.select}
            value={pora}
            onChange={(e) => setPora(e.target.value)}
          >
            {PORA_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p === "" ? "Dowolna" : p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Imię *</span>
        <input
          type="text"
          className={styles.input}
          value={imie}
          onChange={(e) => setImie(e.target.value)}
          autoComplete="given-name"
          required
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>E-mail *</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Telefon</span>
          <input
            type="tel"
            className={styles.input}
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            autoComplete="tel"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Wiadomość</span>
        <textarea
          className={styles.textarea}
          value={wiadomosc}
          onChange={(e) => setWiadomosc(e.target.value)}
          rows={4}
          placeholder="Coś, co powinniśmy wiedzieć? (opcjonalnie)"
        />
      </label>

      {/* honeypot — ukryte pole; ludzie go nie wypełnią */}
      <div className={styles.hp} aria-hidden="true">
        <label>
          Firma
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
          />
        </label>
      </div>

      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={zgoda}
          onChange={(e) => setZgoda(e.target.checked)}
          required
        />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych w celu kontaktu i umówienia
          wizyty. *
        </span>
      </label>

      {status === "error" && <p className={styles.error}>{errorMsg}</p>}

      <PrimaryButton type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wysyłanie…" : "Wyślij"}
      </PrimaryButton>
    </form>
  );
}
