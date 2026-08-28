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
type Errors = Partial<
  Record<
    "imie" | "nazwisko" | "email" | "telefon" | "lokalizacja" | "zgoda",
    string
  >
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;
const PHONE_RE = /^\d{9}$/;

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
  const [nazwisko, setNazwisko] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [zgoda, setZgoda] = useState(false);
  const [firma, setFirma] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, typeof BOOKING_OPTIONS>();
    for (const o of BOOKING_OPTIONS) {
      const arr = map.get(o.group) ?? [];
      arr.push(o);
      map.set(o.group, arr);
    }
    return [...map.entries()];
  }, []);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!imie.trim()) e.imie = "Podaj imię.";
    if (!nazwisko.trim()) e.nazwisko = "Podaj nazwisko.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Niepoprawny adres e-mail.";
    if (!telefon.trim()) e.telefon = "Podaj numer telefonu.";
    else if (!PHONE_RE.test(telefon.trim()))
      e.telefon = "Niepoprawny numer telefonu.";
    if (!lokalizacja) e.lokalizacja = "Wybierz lokalizację.";
    if (!zgoda) e.zgoda = "Musisz wyrazić zgodę.";
    return e;
  };

  const errors: Errors = submitted ? validate() : {};

  const onTelefonChange = (value: string) => {
    setTelefon(value.replace(/\D/g, "").slice(0, 9));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setSubmitted(true);
    const found = validate();
    if (Object.keys(found).length > 0) return;

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
          nazwisko,
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
        <p className={styles.successTitle}>Do usłyszenia!</p>
        <p className={styles.successText}>
          Otrzymaliśmy Twoje zgłoszenie — odezwiemy się, żeby potwierdzić
          termin.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.field}>
        <span className={styles.label}>Zabieg</span>
        <select
          className={styles.select}
          value={zabieg}
          onChange={(e) => setZabieg(e.target.value)}
        >
          <option value={CONSULTATION_VALUE}>
            Konsultacja / jeszcze nie wiem
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
        {errors.lokalizacja && (
          <span className={styles.errorText}>{errors.lokalizacja}</span>
        )}
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

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Imię *</span>
          <input
            type="text"
            className={styles.input}
            value={imie}
            onChange={(e) => setImie(e.target.value)}
            autoComplete="given-name"
            aria-invalid={!!errors.imie}
          />
          {errors.imie && (
            <span className={styles.errorText}>{errors.imie}</span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Nazwisko *</span>
          <input
            type="text"
            className={styles.input}
            value={nazwisko}
            onChange={(e) => setNazwisko(e.target.value)}
            autoComplete="family-name"
            aria-invalid={!!errors.nazwisko}
          />
          {errors.nazwisko && (
            <span className={styles.errorText}>{errors.nazwisko}</span>
          )}
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>E-mail *</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Telefon *</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={9}
            className={styles.input}
            value={telefon}
            onChange={(e) => onTelefonChange(e.target.value)}
            autoComplete="tel"
            aria-invalid={!!errors.telefon}
          />
          {errors.telefon && (
            <span className={styles.errorText}>{errors.telefon}</span>
          )}
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Wiadomość</span>
        <textarea
          className={styles.textarea}
          value={wiadomosc}
          onChange={(e) => setWiadomosc(e.target.value)}
          rows={3}
          placeholder="Coś, co powinniśmy o Tobie wiedzieć? (opcjonalnie)"
        />
      </label>

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
          aria-invalid={!!errors.zgoda}
        />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych w celu kontaktu i
          umówienia wizyty. *
        </span>
      </label>
      {errors.zgoda && <span className={styles.errorText}>{errors.zgoda}</span>}

      {status === "error" && <p className={styles.error}>{errorMsg}</p>}

      <PrimaryButton type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wysyłanie…" : "Wyślij"}
      </PrimaryButton>
    </form>
  );
}
