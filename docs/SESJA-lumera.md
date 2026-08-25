# Lumera — podsumowanie sesji

Notatka robocza z pracy nad stroną Lumera (Next.js 16, App Router, React 19, TypeScript, CSS Modules, polski UI). Do wrzucenia do projektu „Lumera" na claude.ai.

---

## 1. Prawdziwe dane kontaktowe i lokalizacje

Podmienione placeholdery na dane realne (wszędzie, gdzie występowały):

- **Telefon:** +48 505 829 913 (`tel:+48505829913`)
- **E-mail:** kontakt@lumera-clinic.pl
- **Lokalizacje:**
  - Sierpc — ul. Andersa 11, 09-200
  - Andrespol — ul. Rokicińska 130/8, 95-020

Zmienione pliki: `app/kontakt/page.tsx`, `app/api/kontakt/route.ts` (domyślny odbiorca formularza, nadpisywany `CONTACT_TO`), `app/components/OfferExplorer/offer-types.ts` i `trycho-types.ts` (druga lokalizacja „Łódź" → „Andrespol" w typie `Location`, liście `LOCATIONS` i we wszystkich zabiegach).

> Do zrobienia (nie ruszane): linki social media wciąż placeholderowe (`instagram.com/lumera_pl`, `facebook.com/lumera.clinic`) — do potwierdzenia/podmiany.

---

## 2. Grafiki w ofercie i trychologii

Dodane zdjęcia do zabiegów (PNG ~1,7–2 MB → WebP 24–102 KB, 900×1200), pliki w `public/offer/`:

**Oferta (twarz/ciało):**
- `oczyszczanie-infuzja.webp` — Oczyszczanie wodorowe + infuzja tlenowa
- `zelazko-twarz.webp` — Żelazko przeciwzmarszczkowe — twarz
- `zelazko-cialo.webp` — Żelazko antycellulitowe — ciało

**Trychologia** (dodano też pole `image?` do typu `TrychoTreatment`):
- `konsultacja-trychologiczna.webp`
- `leczenie-lysienia.webp`
- `leczenie-azs-lupiezu.webp`
- `leczenie-wszawicy.webp`
- `infuzja-skora-glowy.webp`

Karty trychologii renderują się przez wspólny `OfferCard` (z `category: "Trychologia"`).

Kadrowanie: zdjęcia trychologiczne mają `object-position: center 28%` (kadr wyżej) — klasa `.imgTrycho` w `OfferCard.module.css`, warunkowana `category === "Trychologia"`.

---

## 3. Optymalizacja wydajności

**Assety — `public/` z ~110 MB → ~11 MB:**
- Hero strony głównej: 88 MB `.mov` (4K) → `hero-lumera.webm` 2,4 MB / `hero-lumera.mp4` 3,9 MB (720p, faststart) + `hero-lumera-poster.jpg`. Oryginalny `.mov` usunięty (`git rm`).
- Wideo `/o-lumera`: przeskalowane do 720p → `about/bg-clouds.webm` 1,55 MB / `.mp4` 1,73 MB + poster; podłączone oba źródła (WebM preferowany). Pliki przemianowane z `tlo.*` na `bg-clouds.*`.
- `magic-forest.png` (1,8 MB, nieużywany) — usunięty.
- Okładka ebooka: 2,03 MB PNG → 60 KB WebP.
- Kwiaty (kontakt): `gozdzik` 0,88 MB → 78 KB, `peonia-1` 0,38 MB → 24 KB (WebP z alpha).
- Księżyc (MoonReveal): 11,5 MB PNG (5440 px) → 0,30 MB (1800 px).

**Runtime — pauzowanie animacji poza ekranem / w tle karty** (z poszanowaniem `prefers-reduced-motion`):
- `LumeraReveal` (canvas drobinek): dodane `pause()`/`resume()` bez resetu stanu, sterowane `IntersectionObserver` + `visibilitychange`.
- `LightsBackground`: pauza poza ekranem i w tle.
- `InkBackground` (WebGL, desktop): pauza, gdy karta w tle.
- Poświata księżyca przeniesiona z animowanego `drop-shadow` (liczonego co klatkę na wirującym obrazie) na statyczny element za księżycem.

**Zacinanie przy scrollu (oferta):** parallax w `OfferCard` czytał `getBoundingClientRect()` co klatkę → wymuszony reflow przy rozwijaniu opisu. Teraz pozycja mierzona tylko w spoczynku (montaż/resize/po zatrzymaniu scrolla), a w trakcie scrolla przesunięcie liczone z zapamiętanej pozycji + `scrollY` (zero odczytów layoutu na klatkę).

**Zacinanie animacji przejścia między stronami:**
- Usunięty zbędny fade `opacity` całego poddrzewa w `template.tsx` (animowanie opacity na poddrzewie z `backdrop-filter` = jank). Odsłanianie obsługuje `TransitionOverlay` (opacity jednolitego `<div>` — działa na kompozytorze, płynnie).
- Ciężka inicjalizacja odroczona do fazy „idle" przejścia: `InkBackground` (WebGL) montowany dopiero po przejściu (z zatrzaskiem), a wideo hero (home) i tła (`o-lumera`) odtwarzane dopiero w „idle" (`autoPlay` zdjęte, poster widoczny w międzyczasie). Przy wejściu bezpośrednim faza jest od razu „idle", więc nic się nie opóźnia.

> Ewentualny dalszy krok, jeśli zostało resztkowe szarpnięcie na home: odroczyć też próbkowanie logo w `LumeraReveal`.

---

## 4. Poprawki UI

- **LumeraReveal (home), tekst pod logo „Harmonia…"** — czasem pojawiał się w złym miejscu/rozmiarze (wyścig breakpointu): `isMobile` liczony teraz synchronicznie na pierwszym renderze (komponent montuje się tylko po stronie klienta).
- **MoonReveal (mobile)** — sekcja „Nasza filozofia": tekst i opis wysuwają się od dołu przy wjeżdżaniu (sterowane `--in`), księżyc startuje na dole pod tekstem i jedzie na górę viewportu (za paskiem „umów"), cała sekcja wysuwa się od dołu; „Nasze wartości" przewijają się normalnie (wszystkie kafle widoczne).
- **Formularz kontaktowy (mobile)** — pole „Preferowana data" wychodziło poza okno: `.field { min-width:0 }`, `box-sizing:border-box`, `.input[type=date]` z `-webkit-appearance:none` i `min-width:0`.
- **ScrollToTop** — dodany też na `/oferta`.
- **HomeAbout** — CTA „Poznaj nas" → `/o-lumera`; padding kafli poprawiony (shorthand, bez zbędnego `padding-right`).

---

## 5. Narzędzia i konwencje

- **sharp** (jest w projekcie) — obrazy → WebP, `resize({width:900,height:1200,fit:"inside"})`, `webp({quality:80})`; zachowuje alpha.
- **ffmpeg** — zainstalowany przez winget (Gyan.FFmpeg). Nie ma go w PATH świeżych powłok; wołać pełną ścieżką:
  `C:\Users\mlena\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-*_build\bin\ffmpeg.exe`.
  Wideo tła: 720p, bez audio (`-an`), MP4 `libx264 -crf 25 -movflags +faststart` + WebM `libvpx-vp9 -crf 40 -b:v 0` (WebM mniejszy od MP4, bo jest źródłem preferowanym). Poster: `-ss 0.5 -frames:v 1`.
- **Zasady:** nie używać `!important` (podnosić specyficzność); preferować `PrimaryButton`/`SecondaryButton`; nie odpalać testów/builda po każdej drobnej zmianie (batchować); komponenty wideo — `<source>` webm-first, potem mp4, z posterem.

---

## 6. Stan / TODO

- [ ] Social media — podmienić linki na prawdziwe.
- [ ] (Opcjonalnie) odroczyć próbkowanie logo w `LumeraReveal`, jeśli home nadal lekko szarpie przy wejściu.
- [ ] (Opcjonalnie) odchudzić historię git z 84 MB `.mov` (`git filter-repo`) — plik usunięty z HEAD, ale został w historii.
- [ ] Projekt „Lumera" na claude.ai — założyć/podłączyć po autoryzacji connectora claude.ai (w tej sesji nieautoryzowany).

_Typecheck (`tsc --noEmit`) przechodzi po wszystkich zmianach._
