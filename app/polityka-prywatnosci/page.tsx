import type { Metadata } from "next";
import styles from "./page.module.css";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności Lumera — jak przetwarzamy dane osobowe zgodnie z RODO.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <main className={styles.wrap}>
      <ScrollToTop />
      <div className={styles.inner}>
        <h1 className={styles.title}>Polityka prywatności Lumera</h1>
        <p className={styles.effective}>Obowiązuje od: 1 września 2026 r.</p>

        <section className={styles.section}>
          <h2 className={styles.heading}>1. Informacje ogólne</h2>
          <p>
            Dbamy o prywatność osób korzystających ze strony internetowej i
            Sklepu Lumera. Niniejsza Polityka prywatności wyjaśnia, jakie dane
            osobowe zbieramy, w jakich celach je wykorzystujemy, komu możemy je
            przekazywać oraz jakie prawa przysługują osobom, których dane
            dotyczą.
          </p>
          <p>
            Dane osobowe przetwarzane są zgodnie z obowiązującymi przepisami
            dotyczącymi ochrony danych osobowych, w szczególności z
            Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679
            („RODO”).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>2. Administrator danych</h2>
          <p>Administratorem Twoich danych osobowych jest:</p>
          <p className={styles.seller}>
            <strong>Monika Rożniak</strong>
            <br />
            prowadząca działalność gospodarczą pod firmą
            <br />
            <strong>Lumera Harmonia skóry głowy, twarzy i ciała Monika Rożniak</strong>
            <br />
            NIP: 7761679983
            <br />
            REGON: 143182651
            <br />
            adres: ul. Andersa 11, 09-200 Sierpc
          </p>
          <p>Kontakt w sprawach dotyczących danych osobowych:</p>
          <p>
            <strong>e-mail: kontakt@lumera-clinic.pl</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>3. Jakie dane możemy przetwarzać?</h2>
          <p>
            W zależności od sposobu korzystania ze strony i Sklepu możemy
            przetwarzać w szczególności:
          </p>
          <ul>
            <li>imię i nazwisko,</li>
            <li>adres e-mail,</li>
            <li>numer telefonu, jeżeli zostanie podany,</li>
            <li>dane niezbędne do wystawienia dokumentu księgowego,</li>
            <li>informacje dotyczące Zamówienia i zakupionych produktów,</li>
            <li>
              informacje dotyczące płatności otrzymywane od operatora płatności,
            </li>
            <li>treść korespondencji kierowanej do Lumery,</li>
            <li>informacje związane z reklamacjami,</li>
            <li>adres IP,</li>
            <li>informacje o urządzeniu i przeglądarce,</li>
            <li>
              dane zbierane za pomocą plików cookies i podobnych technologii – w
              zakresie wynikającym z wykorzystywanych na stronie narzędzi.
            </li>
          </ul>
          <p>
            Nie wymagamy podawania danych, które nie są niezbędne do realizacji
            określonego celu.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>4. W jakich celach przetwarzamy dane?</h2>

          <h3 className={styles.subheading}>Realizacja Zamówienia</h3>
          <p>
            Dane podane podczas zakupu przetwarzamy w celu zawarcia i wykonania
            umowy, przyjęcia Zamówienia oraz dostarczenia zakupionego e-booka.
          </p>
          <p>
            Podstawą prawną jest art. 6 ust. 1 lit. b RODO – przetwarzanie jest
            niezbędne do wykonania umowy lub podjęcia działań przed jej
            zawarciem.
          </p>

          <h3 className={styles.subheading}>Płatności</h3>
          <p>
            Dane związane z Zamówieniem mogą być przekazywane operatorowi
            płatności w zakresie niezbędnym do przeprowadzenia transakcji.
          </p>
          <p>
            W zależności od zakresu danych i sposobu realizacji płatności
            podstawą przetwarzania jest w szczególności wykonanie umowy oraz
            realizacja obowiązków prawnych.
          </p>

          <h3 className={styles.subheading}>
            Dokumentacja księgowa i podatkowa
          </h3>
          <p>
            Dane związane z zakupem mogą być przetwarzane w celu realizacji
            obowiązków podatkowych, rachunkowych oraz innych obowiązków
            wynikających z przepisów prawa.
          </p>
          <p>
            Podstawą jest art. 6 ust. 1 lit. c RODO – obowiązek prawny ciążący na
            Administratorze.
          </p>

          <h3 className={styles.subheading}>Reklamacje</h3>
          <p>
            Dane przekazane w związku z reklamacją przetwarzamy w celu jej
            rozpatrzenia i realizacji przysługujących Klientowi uprawnień.
          </p>
          <p>
            Podstawą przetwarzania może być art. 6 ust. 1 lit. b lub lit. c RODO,
            zależnie od charakteru sprawy i obowiązku Administratora.
          </p>

          <h3 className={styles.subheading}>Kontakt</h3>
          <p>
            Jeżeli kontaktujesz się z nami za pomocą poczty elektronicznej,
            telefonu lub formularza kontaktowego, wykorzystujemy przekazane dane
            w celu udzielenia odpowiedzi i prowadzenia korespondencji.
          </p>
          <p>
            Podstawą przetwarzania może być art. 6 ust. 1 lit. b RODO, jeżeli
            kontakt dotyczy zawarcia lub realizacji umowy, albo art. 6 ust. 1
            lit. f RODO – prawnie uzasadniony interes Administratora polegający na
            prowadzeniu komunikacji i obsłudze zapytań.
          </p>

          <h3 className={styles.subheading}>
            Dochodzenie i obrona przed roszczeniami
          </h3>
          <p>
            Dane dotyczące Zamówień i kontaktu z Klientem mogą być przechowywane
            w celu ustalenia, dochodzenia lub obrony przed roszczeniami.
          </p>
          <p>
            Podstawą jest art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes
            Administratora polegający na ochronie jego praw.
          </p>

          <h3 className={styles.subheading}>Newsletter i marketing e-mailowy</h3>
          <p>
            Jeżeli wyrazisz odpowiednią zgodę, Twój adres e-mail może być
            wykorzystywany do przesyłania wiadomości od Lumery, w tym porad,
            informacji o nowościach, produktach i promocjach.
          </p>
          <p>
            Zapis do newslettera jest całkowicie dobrowolny i nie jest warunkiem
            dokonania zakupu.
          </p>
          <p>
            Zgodę możesz wycofać w dowolnym momencie, w szczególności za pomocą
            linku rezygnacji znajdującego się w wiadomości lub poprzez kontakt z
            nami.
          </p>
          <p>
            Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania
            dokonanego przed jej wycofaniem.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>5. Komu możemy przekazywać dane?</h2>
          <p>
            Dane mogą być przekazywane podmiotom, z których usług korzystamy przy
            prowadzeniu strony i Sklepu, wyłącznie w zakresie niezbędnym do
            realizacji określonych zadań.
          </p>
          <p>Mogą to być w szczególności:</p>
          <ul>
            <li>dostawca hostingu i infrastruktury informatycznej,</li>
            <li>
              operator płatności Stripe (Stripe Payments Europe, Limited),
            </li>
            <li>dostawca systemu do obsługi Sklepu,</li>
            <li>dostawca poczty elektronicznej,</li>
            <li>dostawca systemu newsletterowego Resend (Resend, Inc.),</li>
            <li>biuro rachunkowe,</li>
            <li>dostawcy usług IT,</li>
            <li>
              dostawcy narzędzi analitycznych i marketingowych – jeżeli są
              wykorzystywane i istnieje odpowiednia podstawa prawna,
            </li>
            <li>
              podmioty uprawnione do otrzymania danych na podstawie obowiązujących
              przepisów prawa.
            </li>
          </ul>
          <p>
            Każdy podmiot otrzymuje dane wyłącznie w zakresie odpowiednim do celu,
            dla którego są one udostępniane.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>6. Jak długo przechowujemy dane?</h2>
          <p>
            Dane przechowujemy nie dłużej, niż jest to niezbędne do realizacji
            celu, dla którego zostały zebrane.
          </p>
          <p>W szczególności:</p>
          <ul>
            <li>
              dane dotyczące Zamówienia – przez okres realizacji umowy, a
              następnie przez okres niezbędny do rozliczeń i zabezpieczenia
              ewentualnych roszczeń,
            </li>
            <li>
              dokumentację księgową i podatkową – przez okres wymagany przepisami
              prawa,
            </li>
            <li>
              dane związane z reklamacjami – przez czas niezbędny do ich
              rozpatrzenia oraz zabezpieczenia ewentualnych roszczeń,
            </li>
            <li>
              dane wykorzystywane do newslettera – do momentu wycofania zgody lub
              zakończenia prowadzenia newslettera, z możliwością dalszego
              przechowywania niezbędnych informacji w celu wykazania faktu
              udzielenia lub wycofania zgody,
            </li>
            <li>
              dane przetwarzane na podstawie prawnie uzasadnionego interesu – do
              momentu ustania tego interesu albo skutecznego wniesienia
              sprzeciwu, jeżeli ma on zastosowanie.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>7. Twoje prawa</h2>
          <p>
            W związku z przetwarzaniem danych osobowych, w przypadkach
            przewidzianych przez RODO, możesz mieć prawo do:
          </p>
          <ul>
            <li>dostępu do swoich danych,</li>
            <li>otrzymania kopii danych,</li>
            <li>sprostowania nieprawidłowych danych,</li>
            <li>usunięcia danych,</li>
            <li>ograniczenia ich przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania,</li>
            <li>
              wycofania zgody w dowolnym momencie, jeżeli przetwarzanie odbywa się
              na podstawie zgody.
            </li>
          </ul>
          <p>
            Zakres poszczególnych praw zależy od podstawy i celu przetwarzania
            danych.
          </p>
          <p>
            W celu skorzystania ze swoich praw możesz skontaktować się z nami pod
            adresem: <strong>kontakt@lumera-clinic.pl</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>8. Prawo wniesienia skargi</h2>
          <p>
            Jeżeli uważasz, że Twoje dane osobowe są przetwarzane niezgodnie z
            obowiązującymi przepisami, masz prawo wniesienia skargi do organu
            nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>9. Dobrowolność podania danych</h2>
          <p>
            Podanie danych osobowych jest dobrowolne, jednak niektóre dane są
            niezbędne do zawarcia i wykonania umowy.
          </p>
          <p>
            Niepodanie danych wymaganych podczas składania Zamówienia może
            uniemożliwić jego realizację lub dostarczenie e-booka.
          </p>
          <p>
            Podanie danych w celu otrzymywania newslettera jest całkowicie
            dobrowolne i nie wpływa na możliwość dokonania zakupu.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>10. Pliki cookies</h2>
          <p>
            Strona Lumera może wykorzystywać pliki cookies oraz podobne
            technologie.
          </p>
          <p>Cookies mogą być wykorzystywane w szczególności w celu:</p>
          <ul>
            <li>zapewnienia prawidłowego działania strony i Sklepu,</li>
            <li>utrzymania bezpieczeństwa,</li>
            <li>zapamiętywania ustawień użytkownika,</li>
            <li>obsługi procesu zakupowego,</li>
            <li>
              prowadzenia statystyk i analizy sposobu korzystania ze strony –
              jeżeli takie narzędzia są wykorzystywane,
            </li>
            <li>
              prowadzenia działań marketingowych – jeżeli takie narzędzia są
              wykorzystywane i użytkownik wyraził wymaganą zgodę.
            </li>
          </ul>
          <p>
            Cookies niezbędne mogą być wykorzystywane w zakresie koniecznym do
            świadczenia usług i prawidłowego działania strony.
          </p>
          <p>
            W przypadku cookies lub podobnych technologii, które wymagają zgody,
            są one wykorzystywane po jej uzyskaniu.
          </p>
          <p>
            Użytkownik może zarządzać swoimi preferencjami dotyczącymi cookies za
            pomocą mechanizmu dostępnego na stronie oraz ustawień swojej
            przeglądarki.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            11. Przekazywanie danych poza Europejski Obszar Gospodarczy
          </h2>
          <p>
            Niektórzy dostawcy narzędzi wykorzystywanych przez stronę mogą
            przetwarzać dane poza Europejskim Obszarem Gospodarczym.
          </p>
          <p>
            Jeżeli takie przekazywanie danych ma miejsce, Administrator zapewnia
            stosowanie wymaganych prawem mechanizmów ochrony danych, odpowiednich
            do konkretnego transferu.
          </p>
          <p>
            Szczegółowe informacje dotyczące wykorzystywanych dostawców i
            ewentualnych transferów powinny odpowiadać faktycznej konfiguracji
            strony Lumera.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            12. Zautomatyzowane podejmowanie decyzji
          </h2>
          <p>
            O ile nie zostanie wskazane inaczej, dane osobowe nie są
            wykorzystywane do podejmowania wobec Ciebie decyzji opierających się
            wyłącznie na zautomatyzowanym przetwarzaniu, które wywoływałyby wobec
            Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie
            wpływały.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>13. Bezpieczeństwo danych</h2>
          <p>
            Stosujemy odpowiednie środki techniczne i organizacyjne mające na celu
            ochronę danych osobowych przed utratą, nieuprawnionym dostępem,
            zmianą, ujawnieniem lub innym niezgodnym z prawem wykorzystaniem.
          </p>
          <p>
            Dostęp do danych otrzymują wyłącznie osoby i podmioty, dla których
            jest to niezbędne do realizacji określonych zadań.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>14. Zmiany Polityki prywatności</h2>
          <p>
            Polityka prywatności może być aktualizowana, w szczególności w
            przypadku zmiany przepisów prawa, sposobu działania strony,
            wykorzystywanych narzędzi lub sposobu przetwarzania danych.
          </p>
          <p>
            Aktualna wersja Polityki prywatności jest zawsze dostępna na stronie
            internetowej Lumera.
          </p>
          <p>
            <strong>Data ostatniej aktualizacji: 1 września 2026 r.</strong>
          </p>
        </section>
      </div>
    </main>
  );
}
