import type { Metadata } from "next";
import styles from "./page.module.css";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export const metadata: Metadata = {
  title: "Regulamin sklepu — Lumera",
};

export default function RegulaminPage() {
  return (
    <main className={styles.wrap}>
      <ScrollToTop />
      <div className={styles.inner}>
        <h1 className={styles.title}>Regulamin sklepu internetowego Lumera</h1>
        <p className={styles.effective}>
          Obowiązuje od: 1 września 2026 r.
        </p>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 1. Postanowienia ogólne</h2>
          <ol>
            <li>
              Niniejszy Regulamin określa zasady korzystania ze sklepu
              internetowego Lumera, składania zamówień, zawierania umów sprzedaży
              treści cyfrowych, dokonywania płatności, dostarczania zakupionych
              treści cyfrowych, składania reklamacji oraz korzystania z prawa
              odstąpienia od umowy.
            </li>
            <li>Sklep internetowy prowadzony jest przez:</li>
          </ol>
          <p className={styles.seller}>
            <strong>Lumera Harmonia skóry głowy, twarzy i ciała Monika Rożniak</strong>
            <br />
            NIP: 7761679983
            <br />
            REGON: 143182651
            <br />
            adres: ul. Andersa 11, 09-200 Sierpc
            <br />
            adres e-mail: kontakt@lumera-clinic.pl
            <br />
            telefon: +48 505 829 913
          </p>
          <p>zwaną dalej „Sprzedawcą”.</p>
          <ol start={3}>
            <li>
              Ze Sprzedawcą można kontaktować się za pośrednictwem wskazanego
              powyżej adresu e-mail lub numeru telefonu.
            </li>
            <li>
              Regulamin jest dostępny nieodpłatnie na stronie internetowej Sklepu
              w sposób umożliwiający jego zapisanie, odtworzenie i utrwalenie.
            </li>
            <li>
              Klient zobowiązany jest do zapoznania się z Regulaminem przed
              złożeniem zamówienia.
            </li>
            <li>
              Do dokonania zakupu nie jest wymagane założenie konta, o ile Sklep
              nie wskazuje inaczej.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 2. Definicje</h2>
          <p>Na potrzeby Regulaminu przyjmuje się następujące znaczenie pojęć:</p>
          <ol>
            <li>
              <strong>Sklep</strong> – sklep internetowy Lumera dostępny pod
              adresem https://lumera-clinic.pl.
            </li>
            <li>
              <strong>Sprzedawca</strong> – podmiot wskazany w § 1 ust. 2
              Regulaminu.
            </li>
            <li>
              <strong>Klient</strong> – osoba fizyczna, osoba prawna albo
              jednostka organizacyjna dokonująca zakupu w Sklepie.
            </li>
            <li>
              <strong>Konsument</strong> – osoba fizyczna dokonująca ze Sprzedawcą
              czynności prawnej niezwiązanej bezpośrednio z jej działalnością
              gospodarczą lub zawodową.
            </li>
            <li>
              <strong>Treść cyfrowa</strong> – dane wytwarzane i dostarczane w
              postaci cyfrowej, w szczególności e-book oferowany w Sklepie.
            </li>
            <li>
              <strong>E-book</strong> – publikacja elektroniczna dostarczana
              Klientowi w formacie wskazanym w opisie produktu, np. PDF.
            </li>
            <li>
              <strong>Zamówienie</strong> – oświadczenie Klienta prowadzące
              bezpośrednio do zawarcia ze Sprzedawcą umowy dotyczącej Treści
              cyfrowej.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 3. Zasady korzystania ze Sklepu</h2>
          <ol>
            <li>
              Do korzystania ze Sklepu niezbędne są:
              <ul>
                <li>urządzenie z dostępem do Internetu,</li>
                <li>aktualna przeglądarka internetowa,</li>
                <li>aktywny adres e-mail,</li>
                <li>
                  oprogramowanie umożliwiające otwarcie zakupionej Treści
                  cyfrowej, w szczególności plików PDF.
                </li>
              </ul>
            </li>
            <li>
              Klient zobowiązany jest podawać podczas składania Zamówienia dane
              prawdziwe, aktualne i kompletne.
            </li>
            <li>
              Zabronione jest korzystanie ze Sklepu w sposób sprzeczny z prawem,
              dobrymi obyczajami lub naruszający prawa Sprzedawcy albo osób
              trzecich.
            </li>
            <li>
              Klient nie może dostarczać za pośrednictwem Sklepu treści o
              charakterze bezprawnym.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 4. Składanie zamówień</h2>
          <ol>
            <li>
              Informacje o e-bookach dostępnych w Sklepie, w szczególności ich
              opis, zawartość i cena, znajdują się na stronie danego produktu.
            </li>
            <li>
              Ceny podawane w Sklepie są cenami brutto i wyrażone są w złotych
              polskich (PLN), chyba że wyraźnie wskazano inaczej.
            </li>
            <li>
              W celu dokonania zakupu Klient:
              <ul>
                <li>wybiera interesujący go e-book,</li>
                <li>przechodzi do formularza zamówienia,</li>
                <li>podaje dane wymagane do realizacji Zamówienia,</li>
                <li>wybiera dostępną metodę płatności,</li>
                <li>
                  akceptuje Regulamin i potwierdza zapoznanie się z Polityką
                  prywatności,
                </li>
                <li>
                  w przypadku chęci otrzymania e-booka niezwłocznie po zakupie –
                  wyraża zgodę na rozpoczęcie dostarczania Treści cyfrowej przed
                  upływem terminu na odstąpienie od umowy oraz przyjmuje do
                  wiadomości utratę prawa odstąpienia na zasadach opisanych w §
                  8,
                </li>
                <li>
                  składa Zamówienie za pomocą przycisku wskazującego, że
                  Zamówienie pociąga za sobą obowiązek zapłaty.
                </li>
              </ul>
            </li>
            <li>
              Złożenie Zamówienia powoduje obowiązek zapłaty wskazanej ceny.
            </li>
            <li>
              Umowa zostaje zawarta po prawidłowym złożeniu Zamówienia zgodnie z
              informacją przekazaną Klientowi w procesie zakupowym.
            </li>
            <li>
              Potwierdzenie zawarcia umowy przesyłane jest na adres e-mail podany
              przez Klienta.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 5. Płatności</h2>
          <ol>
            <li>
              Za Zamówienie można zapłacić za pomocą metod płatności dostępnych
              aktualnie w Sklepie.
            </li>
            <li>
              Płatności elektroniczne obsługiwane są przez Stripe (Stripe
              Payments Europe, Limited), zgodnie z zasadami obowiązującymi u tego
              operatora.
            </li>
            <li>
              Warunkiem udostępnienia płatnej Treści cyfrowej jest skuteczne
              dokonanie płatności.
            </li>
            <li>
              Sprzedawca nie przechowuje danych kart płatniczych Klienta. Dane
              wymagane do realizacji płatności mogą być przetwarzane bezpośrednio
              przez operatora płatności.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 6. Dostarczenie e-booka</h2>
          <ol>
            <li>
              E-book jest Treścią cyfrową niedostarczaną na nośniku materialnym.
            </li>
            <li>
              Po skutecznym dokonaniu płatności i spełnieniu warunków określonych
              w niniejszym Regulaminie e-book zostanie dostarczony Klientowi w
              sposób wskazany podczas składania Zamówienia, w szczególności:
              <ul>
                <li>
                  poprzez przesłanie wiadomości e-mail zawierającej plik lub link
                  umożliwiający jego pobranie, albo
                </li>
                <li>
                  poprzez udostępnienie możliwości pobrania e-booka bezpośrednio
                  po dokonaniu płatności.
                </li>
              </ul>
            </li>
            <li>
              E-book dostarczany jest na adres e-mail wskazany przez Klienta
              podczas składania Zamówienia, jeżeli dostarczenie następuje za
              pośrednictwem poczty elektronicznej.
            </li>
            <li>Klient jest odpowiedzialny za podanie prawidłowego adresu e-mail.</li>
            <li>
              W przypadku problemów z otrzymaniem lub pobraniem e-booka Klient
              powinien skontaktować się ze Sprzedawcą pod adresem
              kontakt@lumera-clinic.pl.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 7. Licencja i prawa autorskie</h2>
          <ol>
            <li>
              E-book oraz wszystkie zawarte w nim treści podlegają ochronie
              przewidzianej przepisami prawa autorskiego.
            </li>
            <li>
              Zakup e-booka oznacza uzyskanie przez Klienta prawa do korzystania z
              niego na własny użytek.
            </li>
            <li>
              Klient może zapisać e-book na swoich urządzeniach oraz korzystać z
              niego w zakresie własnego użytku osobistego.
            </li>
            <li>
              Bez uprzedniej zgody Sprzedawcy zabronione jest w szczególności:
              <ul>
                <li>
                  udostępnianie e-booka innym osobom poza zakresem dozwolonego
                  użytku wynikającego z przepisów prawa,
                </li>
                <li>publikowanie e-booka w Internecie,</li>
                <li>rozpowszechnianie jego kopii,</li>
                <li>odsprzedaż pliku,</li>
                <li>
                  wykorzystywanie całości lub istotnych części e-booka do
                  tworzenia własnych produktów lub materiałów komercyjnych,
                </li>
                <li>usuwanie oznaczeń dotyczących autora lub praw autorskich.</li>
              </ul>
            </li>
            <li>
              Zakup e-booka nie powoduje przeniesienia na Klienta autorskich praw
              majątkowych.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 8. Prawo odstąpienia od umowy</h2>
          <ol>
            <li>
              Konsument zawierający umowę na odległość ma co do zasady prawo
              odstąpić od niej w terminie 14 dni bez podawania przyczyny, z
              zastrzeżeniem wyjątków przewidzianych przepisami prawa.
            </li>
            <li>
              E-book jest Treścią cyfrową niedostarczaną na nośniku materialnym.
            </li>
            <li>
              Jeżeli Klient chce otrzymać e-book przed upływem terminu na
              odstąpienie od umowy, przed rozpoczęciem jego dostarczania zostanie
              poproszony o:
              <ul>
                <li>
                  wyrażenie wyraźnej i uprzedniej zgody na rozpoczęcie
                  dostarczania Treści cyfrowej przed upływem terminu na
                  odstąpienie od umowy,
                </li>
                <li>
                  potwierdzenie, że przyjmuje do wiadomości utratę prawa
                  odstąpienia od umowy w związku z rozpoczęciem dostarczania
                  Treści cyfrowej zgodnie z obowiązującymi przepisami.
                </li>
              </ul>
            </li>
            <li>
              Po spełnieniu przewidzianych prawem przesłanek i rozpoczęciu
              dostarczania e-booka Konsument traci prawo odstąpienia od umowy.
            </li>
            <li>
              Sprzedawca przekazuje Konsumentowi na trwałym nośniku potwierdzenie
              zawarcia umowy oraz wymagane prawem potwierdzenie dotyczące zgody na
              rozpoczęcie dostarczania Treści cyfrowej.
            </li>
            <li>
              Jeżeli przesłanki powodujące utratę prawa odstąpienia od umowy nie
              zostaną spełnione, uprawnienia Konsumenta wynikające z obowiązujących
              przepisów pozostają zachowane.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            § 9. Zgodność treści cyfrowej z umową i reklamacje
          </h2>
          <ol>
            <li>
              Sprzedawca zobowiązuje się dostarczyć Treść cyfrową zgodną z umową.
            </li>
            <li>
              Treść cyfrowa jest zgodna z umową w szczególności w zakresie jej
              opisu, rodzaju, ilości, jakości, kompletności, funkcjonalności,
              kompatybilności i innych cech wymaganych przez umowę oraz
              obowiązujące przepisy prawa.
            </li>
            <li>
              Jeżeli Treść cyfrowa jest niezgodna z umową, Konsumentowi
              przysługują uprawnienia przewidziane przepisami ustawy o prawach
              konsumenta.
            </li>
            <li>
              Reklamację można złożyć drogą elektroniczną na adres:
              kontakt@lumera-clinic.pl.
            </li>
            <li>
              W reklamacji warto podać informacje umożliwiające jej rozpatrzenie,
              w szczególności:
              <ul>
                <li>imię i nazwisko,</li>
                <li>adres e-mail wykorzystany podczas zakupu,</li>
                <li>numer Zamówienia, jeżeli został nadany,</li>
                <li>opis problemu,</li>
                <li>żądanie Klienta.</li>
              </ul>
            </li>
            <li>
              Sprzedawca rozpatruje reklamację w terminie wymaganym przez
              obowiązujące przepisy prawa.
            </li>
            <li>
              Brak możliwości otwarcia pliku wynikający wyłącznie z braku
              odpowiedniego oprogramowania lub niespełnienia wskazanych przed
              zakupem wymagań technicznych po stronie Klienta nie oznacza
              automatycznie niezgodności Treści cyfrowej z umową.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 10. Newsletter i informacje marketingowe</h2>
          <ol>
            <li>
              Klient może dobrowolnie wyrazić zgodę na otrzymywanie od Lumery
              wiadomości zawierających m.in. porady, informacje o nowościach,
              produktach i promocjach.
            </li>
            <li>Zapis do newslettera nie jest warunkiem dokonania zakupu.</li>
            <li>
              Zgoda marketingowa jest dobrowolna i może zostać wycofana w dowolnym
              momencie.
            </li>
            <li>
              Wycofanie zgody nie wpływa na zgodność z prawem działań dokonanych
              przed jej wycofaniem.
            </li>
            <li>
              Szczegółowe informacje dotyczące przetwarzania danych osobowych w
              związku z newsletterem znajdują się w Polityce prywatności.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            § 11. Pozasądowe sposoby rozpatrywania sporów
          </h2>
          <ol>
            <li>
              Konsument może skorzystać z pozasądowych sposobów rozpatrywania
              reklamacji i dochodzenia roszczeń, zgodnie z obowiązującymi
              przepisami.
            </li>
            <li>
              Informacje dotyczące dostępnych sposobów pozasądowego rozwiązywania
              sporów konsumenckich można uzyskać m.in. u właściwych rzeczników
              konsumentów oraz na stronach internetowych Urzędu Ochrony
              Konkurencji i Konsumentów.
            </li>
            <li>
              Skorzystanie z pozasądowych metod rozwiązywania sporów jest
              dobrowolne, o ile przepisy szczególne nie stanowią inaczej.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 12. Dane osobowe</h2>
          <ol>
            <li>
              Administratorem danych osobowych Klientów jest Lumera harmonia skóry
              głowy, twarzy i ciała.
            </li>
            <li>
              Dane osobowe są przetwarzane m.in. w celu:
              <ul>
                <li>zawarcia i wykonania umowy,</li>
                <li>realizacji Zamówienia i dostarczenia e-booka,</li>
                <li>obsługi płatności,</li>
                <li>obsługi reklamacji,</li>
                <li>realizacji obowiązków prawnych Sprzedawcy,</li>
                <li>ustalania, dochodzenia lub obrony przed roszczeniami,</li>
                <li>
                  prowadzenia marketingu i newslettera – jeżeli istnieje
                  odpowiednia podstawa prawna.
                </li>
              </ul>
            </li>
            <li>
              Szczegółowe informacje dotyczące przetwarzania danych znajdują się w
              Polityce prywatności dostępnej na stronie Sklepu.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>§ 13. Postanowienia końcowe</h2>
          <ol>
            <li>
              Do umów zawieranych za pośrednictwem Sklepu stosuje się prawo
              polskie, z uwzględnieniem bezwzględnie obowiązujących przepisów
              chroniących konsumentów.
            </li>
            <li>
              Regulamin nie ogranicza praw przysługujących Konsumentowi na
              podstawie bezwzględnie obowiązujących przepisów prawa.
            </li>
            <li>
              Sprzedawca może zmienić Regulamin z ważnych przyczyn, w
              szczególności w przypadku zmiany przepisów prawa, sposobów płatności,
              funkcjonalności Sklepu lub sposobu dostarczania Treści cyfrowych.
            </li>
            <li>
              Zmiana Regulaminu nie wpływa na prawa nabyte przez Klientów ani na
              Zamówienia złożone przed wejściem zmiany w życie.
            </li>
            <li>
              Regulamin obowiązuje od dnia 1 września 2026 r..
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
