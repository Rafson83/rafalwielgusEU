export interface ProductModule {
  number: string;
  title: string;
  description: string;
  lessons: string[];
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export type ProductStatus =
  | 'W realizacji'
  | 'Dostępny'
  | 'Przedsprzedaż'
  | 'W przygotowaniu'
  | 'Zapowiedź'
  | 'Szkic';

export interface Product {
  id: string;
  slug: string;
  title: string;
  headline: string;
  tagline: string;
  category: 'Kurs & Warsztat' | 'Szablon & Narzędzie' | 'E-book & Przewodnik';
  status: ProductStatus;
  statusLabel: string;
  price: string;
  priceNote?: string;
  badge: string;
  description: string;
  outcomes: {
    title: string;
    description: string;
  }[];
  forWhom: string[];
  notForWhom: string[];
  modules?: ProductModule[];
  faqs: ProductFaq[];
  ctaText: string;
  isFlagship?: boolean;
  isDraft?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'kod-kariery',
    slug: 'kod-kariery',
    title: 'Kod Kariery',
    headline: 'Odkryj swój potencjał. Zakoduj swoją przewagę.',
    tagline:
      'Praktyczny kurs łączący psychologiczną autorefleksję i diagnozę mocnych stron z nauką kodowania własnego, wirtualnego CV opublikowanego w sieci.',
    category: 'Kurs & Warsztat',
    status: 'W realizacji',
    statusLabel: 'W trakcie tworzenia — Zapisy na listę oczekujących',
    price: 'Przedsprzedaż wkrótce',
    priceNote: 'Dla zapisanych na listę: gwarancja najniższej ceny i bonusy premierowe',
    badge: 'Flagowy program',
    isFlagship: true,
    description:
      'Masz dość wysyłania setek szablonowych CV w próżnię? Czas zmienić strategię i wyróżnić się na rynku. Kod Kariery to praktyczny kurs, który łączy rozwój osobisty z twardymi umiejętnościami technicznymi. Zamiast teoretycznego lania wody zrobimy trzy konkretne rzeczy: zdiagnozujemy Twoje mocne i słabe strony oraz cechy charakteru, opracujemy skuteczną strategię docierania do właściwych decydentów i stworzymy narzędzie, które sprzeda Twoje umiejętności – Twoją własną stronę internetową z interaktywnym CV.',
    outcomes: [
      {
        title: 'Świadomość celu i diagnoza potencjału',
        description:
          'Przejdziesz rzetelny audyt kompetencyjny i psychologiczny. Dowiesz się, jakiej pracy naprawdę szukasz, gdzie masz luki do uzupełnienia i czy Twoja ścieżka to etat, czy własna działalność.',
      },
      {
        title: 'Skuteczny plan ataku na rynku pracy',
        description:
          'Stworzysz zoptymalizowane CV tekstowe oparte na twardych dowodach (a nie pustych deklaracjach) oraz nauczysz się docierać bezpośrednio do decydentów z pominięciem filtrów ATS.',
      },
      {
        title: 'Własna strona WWW z interaktywnym CV',
        description:
          'Napiszesz w HTML/Tailwind i opublikujesz na GitHub Pages nowoczesną stronę, która wyróżni Cię z tłumu tysięcy jednakowych plików PDF.',
      },
    ],
    forWhom: [
      'Dla osób, które chcą zmienić pracę lub branżę i nie chcą brać tego, co akurat jest, lecz to, czego naprawdę chcą.',
      'Dla tych, którzy wysyłają aplikacje bez odpowiedzi i czują frustrację tradycyjnym procesem rekrutacji.',
      'Dla humanistów i specjalistów nietechnicznych, którzy chcą przełamać lęk przed kodem i zyskać cyfrową przewagę.',
      'Dla każdego, kto wierzy w filozofię Long-Life Learning i budowanie własnej tożsamości w sieci.',
    ],
    notForWhom: [
      'Dla osób szukających magicznych pigułek bez włożenia wysiłku we własną autorefleksję.',
      'Dla tych, którzy oczekują suchej teorii akademickiej bez pisania kodu i wykonywania zadań wdrożeniowych.',
    ],
    modules: [
      {
        number: '01',
        title: 'Fundament Mentalny i Diagnoza',
        description: 'Autorefleksja, neurobiologia nauki i audyt tożsamości zawodowej.',
        lessons: [
          'Lekcja 1: Lifelong Learning, czyli dlaczego ciągła nauka to Twoja jedyna trwała przewaga',
          'Lekcja 2: Twój mózg lubi nowe wyzwania (praktyczne podstawy neurobiologii)',
          'Lekcja 3: Dlaczego stoisz w miejscu? O prokrastynacji, lęku przed oceną i wymówkach',
          'Lekcja 4: Mapa Twojej tożsamości zawodowej (wartości, mocne i słabe strony)',
          'Lekcja 5: Audyt samego siebie i świadomy wybór ścieżki (etat vs własna inicjatywa)',
        ],
      },
      {
        number: '02',
        title: 'Architektura Kariery – Jak skutecznie sprzedać umiejętności',
        description: 'Szukanie pracy jako projekt biznesowy i budowa marki osobistej.',
        lessons: [
          'Lekcja 1: Szukanie pracy to projekt (Twój własny lejek sprzedażowy)',
          'Lekcja 2: CV oparte na dowodach i liczbach, a nie deklaracjach',
          'Lekcja 3: Ukryty rynek pracy i omijanie algorytmów (Networking & Direct Search)',
          'Lekcja 4: Copywriting Twojej marki (język korzyści i most do kodowania)',
          'Lekcja 5: Rozmowa kwalifikacyjna jako partnerski dialog dwóch stron',
        ],
      },
      {
        number: '03',
        title: 'Cyfrowy Warsztat – Kodowanie interaktywnego CV',
        description: 'Od zera do pierwszej działającej strony internetowej w HTML i CSS.',
        lessons: [
          'Lekcja 1: Przełamanie strachu przed terminalem i przygotowanie warsztatu (VS Code)',
          'Lekcja 2: HTML, czyli solidny, semantyczny szkielet Twojej historii',
          'Lekcja 3: CSS i Tailwind – ubieranie szkieletu w profesjonalny, czysty design',
          'Lekcja 4: Rekruterzy mają smartfony (Projektowanie responsywne – RWD)',
          'Lekcja 5: Detale pokazujące zaangażowanie (Podstawy interaktywności i mikro-animacji)',
        ],
      },
      {
        number: '04',
        title: 'Światło Dzienne – Publikacja i rozwój marki w sieci',
        description: 'Wdrożenie na bezpłatny hosting, Git i dystrybucja Twojego portfolio.',
        lessons: [
          'Lekcja 1: Git, czyli Twój cyfrowy wehikuł czasu i kontrola wersji',
          'Lekcja 2: Profil na GitHub jako namacalny dowód Twoich kompetencji technologicznych',
          'Lekcja 3: Odpalenie strony na darmowym hostingu (GitHub Pages w praktyce)',
          'Lekcja 4: Dystrybucja – jak, kiedy i komu wysyłać link do interaktywnego CV',
          'Lekcja 5: Budowanie osobistej historii w sieci (Co dalej po publikacji?)',
        ],
      },
    ],
    faqs: [
      {
        question: 'Czy muszę umieć programować przed startem kursu?',
        answer:
          'Zdecydowanie nie! Moduł techniczny jest zaprojektowany od podstaw dla osób, które nigdy nie napisały ani jednej linijki kodu. Krok po kroku przeprowadzam Cię przez instalację narzędzi i budowę strony.',
      },
      {
        question: 'Na czym polega różnica między tym kursem a doradztwem kariery?',
        answer:
          'Większość doradców poprawia jedynie szablon Worda/Canvy. W „Kodzie Kariery” łączymy psychologiczną diagnozę z twardym wytworzeniem własnego produktu cyfrowego – działającej strony WWW, która staje się Twoją domeną i wizytówką na lata.',
      },
      {
        question: 'Kiedy kurs będzie dostępny?',
        answer:
          'Obecnie trwają prace nad materiałami wideo i ćwiczeniami. Zapisując się na listę oczekujących, otrzymasz darmowy arkusz audytu tożsamości oraz gwarancję najniższej ceny w przedsprzedaży.',
      },
    ],
    ctaText: 'Dołącz do listy oczekujących',
  },
  {
    id: 'system-long-life-learning',
    slug: 'system-long-life-learning',
    title: 'System Long-Life Learning',
    headline: 'Cyfrowy drugi mózg dla interdyscyplinarnego rozwoju.',
    tagline:
      'Kompletny szablon i metodyka zarządzania wiedzą w Obsidian & Notion dla tych, którzy uczą się wielu dziedzin jednocześnie.',
    category: 'Szablon & Narzędzie',
    status: 'W realizacji',
    statusLabel: 'W przygotowaniu',
    price: '49 PLN',
    badge: 'Szablon cyfrowy',
    description:
      'Jak łączyć notatki z elektroniki, psychologii, optymalizacji procesów i biznesu, by nie tonąć w chaosie zakładek? Ten szablon to sprawdzony w boju system kategoryzacji, łączenia myśli i destylacji wiedzy w duchu Zettelkasten i metody P.A.R.A., dostosowany do interdyscyplinarnych twórców.',
    outcomes: [
      {
        title: 'Koniec z gubieniem wiedzy',
        description: 'Jeden centralny magazyn dla artykułów, książek, wniosków z awarii i pomysłów na projekty.',
      },
      {
        title: 'Łączenie odległych kropek',
        description: 'Dzięki powiązaniom dwukierunkowym szybko odkrywasz analogie między np. procesami technicznymi a psychologią behawioralną.',
      },
      {
        title: 'Gotowe szablony notatek',
        description: 'Struktury na audyt wiedzy, retrospektywę tygodniową i konspekty projektów technicznych.',
      },
    ],
    forWhom: [
      'Dla osób samokształcących się, które czytają dużo, ale czują, że wiedza ulatuje.',
      'Dla specjalistów pracujących na styku techniki, zarządzania i edukacji.',
    ],
    notForWhom: [
      'Dla osób szukających prostej listy to-do w notatniku w telefonie.',
    ],
    faqs: [
      {
        question: 'Na jakich aplikacjach działa szablon?',
        answer: 'Szablon przygotowany jest w dwóch wersjach: jako skarbiec Markdown do aplikacji Obsidian oraz jako przestrzeń do Notion.',
      },
    ],
    ctaText: 'Powiadom mnie o premierze',
  },
  {
    id: 'od-awarii-do-procesu',
    slug: 'od-awarii-do-procesu',
    title: 'Od awarii do procesu',
    headline: 'Myślenie procesowe i kontrola jakości bez korpo-żargonu.',
    tagline:
      'Krótki, skondensowany przewodnik pokazujący, jak zamienić codzienne gaszenie pożarów w stabilne, powtarzalne standardy.',
    category: 'E-book & Przewodnik',
    status: 'W realizacji',
    statusLabel: 'W przygotowaniu',
    price: 'Bezpłatny e-book',
    badge: 'Przewodnik',
    description:
      'Praktyczna esencja z lat pracy w utrzymaniu ruchu i kontroli jakości w korporacji. Dowiedz się, jak identyfikować źródłowe przyczyny błędów (Root Cause Analysis), projektować procedury, które ludzie naprawdę chcą stosować, oraz wdrażać zwinne metodyki (Agile/Lean) bez zbędnej biurokracji.',
    outcomes: [
      {
        title: 'Matryca analizy przyczyn źródłowych',
        description: 'Narzędzie 5-Why i diagram Ishikawy w wersji pragmatycznej, gotowej do użycia na hali lub w biurze.',
      },
      {
        title: 'Standardyzacja bez nudy',
        description: 'Jak pisać instrukcje stanowiskowe i checklisty, z których zespół faktycznie korzysta.',
      },
    ],
    forWhom: [
      'Dla techników, automatyków, brygadzistów, właścicieli małych firm i każdego, kto ma dość powtarzających się wpadek.',
    ],
    notForWhom: [
      'Dla teoretyków zarządzania szukających skomplikowanych 300-stronicowych rozpraw akademickich.',
    ],
    faqs: [
      {
        question: 'W jakim formacie otrzymam przewodnik?',
        answer: 'Plik PDF oraz czytnikowy format ePub, sformatowany z dbałością o typografię.',
      },
    ],
    ctaText: 'Zapisz się po darmowy egzemplarz',
  },
  {
    id: 'kod-maszyny-plc',
    slug: 'kod-maszyny-plc',
    title: 'Kod Maszyny: PLC od zera w TIA Portal',
    headline: 'Od pierwszego styku do działającej linii. Programowanie sterowników bez drogiego sprzętu.',
    tagline:
      'Praktyczny kurs programowania sterowników Siemens S7-1200 w środowisku TIA Portal z wykorzystaniem symulatora PLCSIM i wirtualnej fabryki 3D Factory I/O. Od logiki drabinkowej (LAD) po tekst strukturalny (SCL).',
    category: 'Kurs & Warsztat',
    status: 'Szkic',
    statusLabel: 'Szkic roboczy — Wewnętrzny szkic produkcyjny',
    price: 'Przedsprzedaż wkrótce',
    priceNote: 'Dla zapisanych na listę startową: gotowe sceny 3D i biblioteki bloków FB/FC',
    badge: 'Kurs praktyczny (Szkic)',
    isDraft: true,
    description:
      'Masz dość kursów, w których instruktor przez 10 godzin omawia ikony w menu programu, a na koniec miga jedną diodą na stole? W „Kodzie Maszyny” od pierwszego dnia budujemy działający układ automatyki przemysłowej. Wykorzystujemy darmowe środowisko symulacyjne Siemens PLCSIM oraz wirtualną fabrykę 3D Factory I/O. Przechodzimy od intuicyjnego języka drabinkowego (LAD) do tekstu strukturalnego (SCL) — pisząc czytelny, bezpieczny kod przemysłowy z obsługą trybów pracy (Manual/Auto), procedur awaryjnego zatrzymania (Safety/E-Stop) i diagnostyką awarii maszyn.',
    outcomes: [
      {
        title: 'Architektura programu przemysłowego',
        description:
          'Przejdziesz od bezładnego łączenia styków do profesjonalnej struktury: bloki funkcyjne (FB), bloki danych (DB), funkcje pomocnicze (FC) i organizacja cyklu w OB1.',
      },
      {
        title: 'Most do programowania IT (SCL)',
        description:
          'Nauczysz się pisać logikę sterowania w Structured Control Language (pętle, warunki IF/CASE, operacje na tablicach i rejestrach), zyskując ogromną przewagę nad klasycznymi elektrykami.',
      },
      {
        title: 'Wirtualny rozruch bez ryzyka',
        description:
          'Uruchomisz kompletną stację transportowo-sortującą w symulatorze 3D, testując stany awaryjne i błędy czujników bez obawy o uszkodzenie fizycznej maszyny na hali.',
      },
    ],
    forWhom: [
      'Dla elektryków, techników i monterów, którzy chcą przestać bać się programowania PLC i wejść na wyższy poziom zarobków.',
      'Dla programistów IT, którzy chcą zejść na poziom fizycznych maszyn i sterowania czasem rzeczywistym.',
      'Dla studentów mechatroniki i pasjonatów techniki, którzy nie mają dostępu do drogiego fizycznego laboratorium sprzętowego.',
    ],
    notForWhom: [
      'Dla szukających akademickiej teorii układów regulacji bez pisania kodu i uruchamiania symulacji.',
      'Dla osób, które nie chcą instalować oprogramowania inżynierskiego na swoim komputerze.',
    ],
    modules: [
      {
        number: '01',
        title: 'Fundament i Warsztat Wirtualny',
        description: 'Środowisko TIA Portal, symulator PLCSIM i wirtualna fabryka Factory I/O.',
        lessons: [
          'Lekcja 1: Anatomia sterownika PLC (cykl skanowania, pamięć I/Q/M, wejścia binarne i analogowe)',
          'Lekcja 2: Instalacja i konfiguracja środowiska Siemens TIA Portal + PLCSIM',
          'Lekcja 3: Budowa wirtualnego stanowiska testowego w Factory I/O (czujniki, napędy, rolki)',
          'Lekcja 4: Pierwszy program i konfiguracja sprzętowa (Hardware Configuration)',
          'Lekcja 5: Diagnostyka połączenia i wgrywanie programu do symulatora',
        ],
      },
      {
        number: '02',
        title: 'Logika Drabinkowa (LAD) w Przemyśle',
        description: 'Praktyczne algorytmy sterowania maszyn w języku drabinkowym.',
        lessons: [
          'Lekcja 1: Styki NO/NC, cewki, pamięć samopodtrzymania i zbocza impulsów (R_TRIG, F_TRIG)',
          'Lekcja 2: Czas to pieniądz – timery w praktyce (TON, TOF, TP) na przykładzie opóźnień taśmociągu',
          'Lekcja 3: Liczniki (CTU, CTD) i obsługa pakowania detali w kartony',
          'Lekcja 4: Maszyna stanów w LAD (sekwencyjne sterowanie krok po kroku)',
          'Lekcja 5: Testy i debugowanie logiki na żywo w symulacji 3D',
        ],
      },
      {
        number: '03',
        title: 'Structured Control Language (SCL) – Most do IT',
        description: 'Programowanie strukturalne sterowników: pętle, tablice i zaawansowana logika.',
        lessons: [
          'Lekcja 1: Dlaczego tekst strukturalny wypiera drabinkę w złożonych projektach',
          'Lekcja 2: Zmienne, typy danych, struktury UDT i bloki danych (DB)',
          'Lekcja 3: Instrukcje warunkowe (IF..THEN, CASE..OF) do obsługi receptur produkcyjnych',
          'Lekcja 4: Pętle (FOR, WHILE) i indeksowanie tablic (kolejkowanie detali FIFO)',
          'Lekcja 5: Konwersja sygnałów analogowych (skalowanie NORM_X, SCALE_X czujników 4-20mA)',
        ],
      },
      {
        number: '04',
        title: 'Bezpieczeństwo, Diagnostyka i Panel HMI',
        description: 'Obwody Safety, obsługa awarii i budowa ekranu operatorskiego.',
        lessons: [
          'Lekcja 1: Bezpieczeństwo przede wszystkim (E-Stop, strefy bezpieczeństwa, blokady sprzętowe)',
          'Lekcja 2: Obsługa trybów pracy: Manual (ręczny), Auto (automatyczny), Baza (Home)',
          'Lekcja 3: Architektura alarmów i rejestracja przestojów maszyny',
          'Lekcja 4: Projektowanie prostego panelu operatorskiego HMI (WinCC Basic)',
          'Lekcja 5: Finałowy projekt: Uruchomienie autonomicznej stacji sortująco-paletyzującej',
        ],
      },
    ],
    faqs: [
      {
        question: 'Czy muszę kupować fizyczny sterownik PLC do tego kursu?',
        answer:
          'Nie! Cały kurs opiera się na 100% wiernej symulacji programowej przy użyciu Siemens PLCSIM oraz wirtualnego środowiska fabryki 3D Factory I/O. Kod, który napiszesz w symulatorze, wgrywa się do prawdziwego sterownika dokładnie w ten sam sposób.',
      },
      {
        question: 'Jaki komputer jest wymagany do pracy?',
        answer:
          'Zalecany jest komputer z systemem Windows 10 lub 11, procesorem min. 4-rdzeniowym, 8-16 GB pamięci RAM oraz dyskiem SSD.',
      },
      {
        question: 'Dla kogo przeznaczony jest język SCL?',
        answer:
          'SCL (Structured Control Language) jest dialektem zgodnym z normą IEC 61131-3. Jeśli znasz choćby podstawy Pythona, C lub JavaScriptu, poczujesz się w nim jak w domu. W kursie uczymy go od zupełnych podstaw.',
      },
    ],
    ctaText: 'Dołącz do listy oczekujących',
  },
  {
    id: 'sep-g1-bez-wkuwania',
    slug: 'sep-g1-bez-wkuwania',
    title: 'SEP G1 bez wkuwania: Zrozum fizykę, zdaj egzamin',
    headline: 'Ochrona przeciwporażeniowa i układy sieci od strony praktycznej. Zdaj uprawnienia E i D bez pamięciówki.',
    tagline:
      'Praktyczne kompendium wiedzy i interaktywny trenażer pytań komisji kwalifikacyjnej. Skupiony na zrozumieniu zjawisk fizycznych, układów TN/TT/IT, pomiarów instalacji i zasad pierwszej pomocy.',
    category: 'E-book & Przewodnik',
    status: 'Szkic',
    statusLabel: 'Szkic roboczy — Wewnętrzny szkic produkcyjny',
    price: '79 PLN',
    priceNote: 'Zawiera kompendium PDF/ePub, laminowane karty powtórkowe oraz trenażer pytań online',
    badge: 'Przewodnik & Trenażer (Szkic)',
    isDraft: true,
    description:
      'Większość osób podchodzi do egzaminu SEP z przerażeniem, wkuwając na pamięć setki oderwanych od życia pytań testowych. Kiedy jednak egzaminator zapyta: „A dlaczego w układzie TN-C nie wolno stosować wyłącznika RCD?”, zaczyna się panika. Ten przewodnik tłumaczy zasady działania sieci elektroenergetycznych językiem prostym, logicznym i rzemieślniczym. Zamiast regułek na blachę — zrozumiesz, jak płynie prąd zwarciowy, kiedy zadziała zabezpieczenie i jak przeprowadzić pomiary instalacji.',
    outcomes: [
      {
        title: 'Układy sieci bez tajemnic',
        description:
          'Zrozumiesz anatomię układów TN-C, TN-S, TN-C-S, TT i IT oraz czym grozi przerwanie przewodu PEN.',
      },
      {
        title: 'Ochrona przeciwporażeniowa w małym palcu',
        description:
          'Poznasz czasy samoczynnego wyłączenia zasilania (SWZ), zasadę działania różnicówek (RCD) i napięcia dotykowe bezpieczne.',
      },
      {
        title: 'Twarde procedury pomiarowe',
        description:
          'Dowiesz się, jak mierzyć pętlę zwarcia, rezystancję izolacji oraz uziemienia bez popełniania szkolnych błędów.',
      },
    ],
    forWhom: [
      'Dla osób podchodzących po raz pierwszy do uprawnień SEP Grupy 1 (Eksploatacja „E” lub Dozór „D”).',
      'Dla elektryków odnawiających uprawnienia po 5 latach, którzy chcą uporządkować aktualne normy i wiedzę.',
      'Dla automatyków, monterów paneli PV i instalatorów potrzebujących uprawnień do pracy na obiektach.',
    ],
    notForWhom: [
      'Dla osób szukających nielegalnych dróg na skróty — ten materiał uczy prawdziwego bezpieczeństwa życia i zdrowia.',
      'Dla tych, którzy wolą wkuwać odpowiedzi na oślep bez zrozumienia praw elektrotechniki.',
    ],
    modules: [
      {
        number: '01',
        title: 'Prawa Fizyki i Anatomia Układów Sieciowych',
        description: 'Podstawowe pojęcia, rodzaje sieci i zjawiska zwarciowe.',
        lessons: [
          'Lekcja 1: Układy sieciowe niskiego napięcia: TN-C, TN-S, TN-C-S, TT oraz IT',
          'Lekcja 2: Dlaczego uziemiamy punkt neutralny transformatora? Potencjał ziemi odniesienia',
          'Lekcja 3: Rozdział przewodu PEN na PE i N – zasada punktu podziału i uziemienia',
          'Lekcja 4: Asymetria obciążenia i śmiertelne niebezpieczeństwo upalenia zera w TN-C',
          'Lekcja 5: Drogi przepływu prądów zwarciowych i pętla zwarcia w różnych układach',
        ],
      },
      {
        number: '02',
        title: 'Ochrona Przeciwporażeniowa Podstawowa i Dodatkowa',
        description: 'Środki ochrony przed dotykiem bezpośrednim i pośrednim.',
        lessons: [
          'Lekcja 1: Napięcia dotykowe dopuszczalne długotrwale (50V, 25V, 12V) w zależności od warunków środowiskowych',
          'Lekcja 2: Samoczynne wyłączenie zasilania (SWZ) – warunki, czasy wyłączenia i charakterystyki aparatów',
          'Lekcja 3: Wyłączniki różnicowoprądowe (RCD): Typ AC, A, B – zasada działania przekładnika Ferrantiego',
          'Lekcja 4: Dlaczego różnicówka nie zadziała w sieci TN-C i jak poprawnie zabezpieczyć obwody',
          'Lekcja 5: Bardzo niskie napięcia bezpieczne: SELV, PELV, FELV – kluczowe różnice na egzaminie',
        ],
      },
      {
        number: '03',
        title: 'Pomiary Instalacji i Protokołowanie',
        description: 'Przyrządy pomiarowe, metodyka i interpretacja wyników.',
        lessons: [
          'Lekcja 1: Pomiar impedancji pętli zwarcia (Zs) – dobór współczynnika ia dla bezpieczników i wyłączników',
          'Lekcja 2: Pomiar rezystancji izolacji kabli i aparatów (napięcia probiercze 500V / 1000V)',
          'Lekcja 3: Badanie wyłączników RCD (czas zadziałania, prąd wyzwolenia, pomiar napięcia dotykowego)',
          'Lekcja 4: Pomiary rezystancji uziomów (metoda techniczna 3-przewodowa i udarowa)',
          'Lekcja 5: Prawidłowe sporządzenie protokołu pomiarowego i orzeczenie o zdatności instalacji',
        ],
      },
      {
        number: '04',
        title: 'BHP, Prace Pod Napięciem i Pierwsza Pomoc',
        description: 'Organizacja bezpiecznej pracy na instalacjach elektrycznych.',
        lessons: [
          'Lekcja 1: 5 Złotych Zasad Bezpieczeństwa przy pracach beznapięciowych (LOTO)',
          'Lekcja 2: Organizacja prac pod napięciem (PPN) i w pobliżu napięcia – polecenia pisemne i ustne',
          'Lekcja 3: Sprzęt ochronny i dielektryczny (rękawice, półbuty, dywaniki, drążki izolacyjne, wskaźniki napięcia)',
          'Lekcja 4: Zagrożenia łukiem elektrycznym i polem elektromagnetycznym',
          'Lekcja 5: Pierwsza pomoc przy porażeniu prądem elektrycznym: uwalnianie poszkodowanego i resuscytacja RKO',
        ],
      },
    ],
    faqs: [
      {
        question: 'Czy ten materiał nadaje uprawnienia SEP?',
        answer:
          'Nie. Uprawnienia państwowe nadają wyłącznie komisje kwalifikacyjne (np. SEP, SIMP, NOT). Ten produkt to kompleksowy podręcznik i trenażer pytań, który w 100% przygotowuje Cię merytorycznie do bezstresowego zdania egzaminu ustnego przed komisją.',
      },
      {
        question: 'Czy materiał obejmuje kategorię E (Eksploatacja) czy D (Dozór)?',
        answer:
          'Materiał został opracowany z myślą o obu kategoriach. Sekcje pomiarowe, protokołowanie i organizacja bezpiecznej pracy zawierają dokładne zagadnienia wymagane dla grupy Dozoru „D”.',
      },
      {
        question: 'Czym różni się trenażer online od zwykłych pytań w internecie?',
        answer:
          'Większość baz w sieci zawiera błędy i nie wyjaśnia przyczyn. W naszym trenażerze przy każdym pytaniu otrzymujesz precyzyjne wyjaśnienie ze schematem, dlaczego dana odpowiedź jest prawidłowa i jak argumentować ją przed egzaminatorem.',
      },
    ],
    ctaText: 'Dołącz do listy oczekujących',
  },
  {
    id: 'anatomia-schematu-elektrycznego',
    slug: 'anatomia-schematu-elektrycznego',
    title: 'Anatomia Schematu: Od kreski do szafy sterowniczej',
    headline: 'Jak czytać wielostronicową dokumentację przemysłową i zaprojektować własny układ automatyki.',
    tagline:
      'Praktyczny warsztat czytania, analizy i rysowania schematów elektrycznych w środowisku CAD (QElectroTech/EPLAN). Standardy przemysłowe, normy aparatowe i diagnostyka multimetrem.',
    category: 'Kurs & Warsztat',
    status: 'Szkic',
    statusLabel: 'Szkic roboczy — Wewnętrzny szkic produkcyjny',
    price: '199 PLN',
    priceNote: 'Zawiera gotowe biblioteki symboli i kompletny wielostronicowy projekt referencyjny szafy',
    badge: 'Warsztat CAD (Szkic)',
    isDraft: true,
    description:
      'Wchodzisz przed szafę sterowniczą, otwierasz segregator z 80 stronami schematu i widzisz plątaninę linii, symboli i odsyłaczy krzyżowych? Bez paniki. W tym warsztacie nauczysz się czytać dokumentację przemysłową jak wprawny muzyk czyta nuty. Rozłożymy na części pierwsze realny schemat linii produkcyjnej, poznamy oznaczenia wg normy PN-EN 81346, a następnie w darmowym narzędziu CAD zaprojektujesz od zera własną szafkę sterowniczą.',
    outcomes: [
      {
        title: 'Pewność przed szafą sterowniczą',
        description:
          'Błyskawicznie lokalizujesz aparaty, listwy zaciskowe i odsyłacze krzyżowe między stronami zasilania i sterowania.',
      },
      {
        title: 'Projektowanie własnego układu',
        description:
          'Narysujesz od zera obwody mocy silników, zasilanie 24V DC, obwód bezpieczeństwa (Safety) i podłączenie kart wejść/wyjść PLC.',
      },
      {
        title: 'Dobór zabezpieczeń i przewodów',
        description:
          'Nauczysz się poprawnie dobierać przekroje kabli, wyłączniki silnikowe, aparaturę modułową i zasilacze buforowe.',
      },
    ],
    forWhom: [
      'Dla techników utrzymania ruchu, którzy tracą godziny na dochodzenie, gdzie prowadzi dany przewód w maszynie.',
      'Dla monterów szaf sterowniczych, którzy chcą awansować do działu projektowania i prefabrykacji.',
      'Dla początkujących automatyków i elektroników potrzebujących zrozumieć warstwę sprzętową maszyn przemysłowych.',
    ],
    notForWhom: [
      'Dla osób, które nie chcą instalować programów CAD do rysowania schematów.',
      'Dla poszukujących kursu instalatorstwa domowego 230V — tu skupiamy się na automatyce i przemyśle.',
    ],
    modules: [
      {
        number: '01',
        title: 'Alfabet Automatyki i Normy Rysunkowe',
        description: 'Struktura schematu, oznaczenia aparatowe i logika odsyłaczy.',
        lessons: [
          'Lekcja 1: Struktura wielostronicowego schematu przemysłowego (Strona tytułowa, spis treści, zasilanie, sterowanie, I/O)',
          'Lekcja 2: Oznaczenia aparatów wg normy PN-EN 81346 (-Q, -K, -F, -S, -T, -B) – jak czytać kody wyposażenia',
          'Lekcja 3: Odsyłacze krzyżowe (Cross-references) – jak śledzić zestyki przekaźników i potencjały zasilania',
          'Lekcja 4: Listwy zaciskowe (-X1, -X2), tabele kablowe i schematy połączeń zewnętrznych',
          'Lekcja 5: Ćwiczenie praktyczne: Śledzenie sygnału awarii na 50-stronicowym schemacie referencyjnym',
        ],
      },
      {
        number: '02',
        title: 'Obwody Mocy i Zasilania w Maszynach',
        description: 'Zasilanie 400V/230V, transformatory i sekcja 24V DC.',
        lessons: [
          'Lekcja 1: Zasilanie główne, rozłączniki izolacyjne z blokadą drzwiową i ochrona przeciwprzepięciowa (SPD)',
          'Lekcja 2: Obwody napędowe: Styczniki, wyłączniki silnikowe (termiki), falowniki (VFD) i softstarty',
          'Lekcja 3: Sekcja zasilania sterowania: Zasilacze impulsowe 24V DC, redundancyjne i moduły selektywności',
          'Lekcja 4: Prowadzenie mas i potencjałów (0V DC, PE, FE) oraz unikanie pętli masy i zakłóceń EMI',
          'Lekcja 5: Dobór przekrojów przewodów i bezpieczników pod kątem obciążalności długotrwałej i spadków napięć',
        ],
      },
      {
        number: '03',
        title: 'Bezpieczeństwo Maszynowe (Safety) i Sygnały I/O',
        description: 'Przekaźniki bezpieczeństwa, kurtyny i integracja ze sterownikiem PLC.',
        lessons: [
          'Lekcja 1: Obwód zatrzymania awaryjnego (E-Stop): Układy dwukanałowe, kontrola zwarć międzykanałowych',
          'Lekcja 2: Przekaźniki bezpieczeństwa (PNOZ / Pilz) i moduły monitorowania rygli drzwiowych',
          'Lekcja 3: Sygnały cyfrowe I/O w PLC: Polaryzacja PNP vs NPN, optoizolacja i podłączenie krańcówek',
          'Lekcja 4: Sygnały analogowe: Pętle prądowe 4-20mA (dwu- i cztero-przewodowe) oraz pomiary 0-10V i PT100',
          'Lekcja 5: Prawidłowe ekranowanie kabli sygnałowych i podłączenie ekranów do szyny PE',
        ],
      },
      {
        number: '04',
        title: 'Projekt Własnej Szafy w QElectroTech',
        description: 'Rysowanie kompletnego projektu krok po kroku w darmowym narzędziu CAD.',
        lessons: [
          'Lekcja 1: Przygotowanie szablonu arkusza, ramki rysunkowej i tabelki znamionowej',
          'Lekcja 2: Rysowanie toru zasilania głównego i zabezpieczeń silnika taśmociągu',
          'Lekcja 3: Rysowanie sekcji zasilania 24V DC oraz pętli bezpieczeństwa',
          'Lekcja 4: Rozrysowanie kart wejść/wyjść sterownika Siemens S7-1200 z zaciskami',
          'Lekcja 5: Generowanie zestawienia materiałowego (BOM) i eksport dokumentacji do produkcyjnego pliku PDF',
        ],
      },
    ],
    faqs: [
      {
        question: 'Czy program QElectroTech jest darmowy?',
        answer:
          'Tak, QElectroTech to w 100% bezpłatne oprogramowanie open-source dostępne na Windows, macOS i Linux. Kurs skupia się na uniwersalnych zasadach projektowania, które wprost przekładają się również na pracę w komercyjnych pakietach, takich jak EPLAN czy AutoCAD Electrical.',
      },
      {
        question: 'Czy po kursie będę w stanie samodzielnie złożyć szafę?',
        answer:
          'Kurs uczy projektowania i czytania dokumentacji, z której monter prefabrykuje szafę. W połączeniu z wiedzą elektryczną zyskujesz kompletne fundamenty do samodzielnego okablowania i uruchomienia szafki sterowniczej.',
      },
    ],
    ctaText: 'Dołącz do listy oczekujących',
  },
  {
    id: 'przemyslowy-bridge-iot',
    slug: 'przemyslowy-bridge-iot',
    title: 'Przemysłowy Bridge: Od czujnika do chmury (Node-RED & Modbus)',
    headline: 'Połącz szafę sterowniczą ze światem webu. Zbieraj dane z maszyn i twórz pulpity operatorskie.',
    tagline:
      'Praktyczny przewodnik integrowania sterowników przemysłowych z nowoczesnym IT. Protokół Modbus TCP, broker MQTT, logika Node-RED i wizualizacja parametrów na żywo w przeglądarce.',
    category: 'Kurs & Warsztat',
    status: 'Szkic',
    statusLabel: 'Szkic roboczy — Wewnętrzny szkic produkcyjny',
    price: '149 PLN',
    priceNote: 'Gotowe flow Node-RED i kontenery Docker do natychmiastowego uruchomienia w warsztacie',
    badge: 'Hybryda Automatyka + IT (Szkic)',
    isDraft: true,
    description:
      'Świat automatyki i świat programowania webowego zbyt długo żyły w izolacji. Automatycy rzadko znają bazy danych i protokoły chmurowe, a programiści webowi boją się dotknąć rejestrów w maszynach. „Przemysłowy Bridge” to kurs pomostowy. Bierzemy fizyczny sterownik lub czujnik, odczytujemy go po protokole Modbus TCP, przesyłamy do brokera MQTT i za pomocą Node-RED wizualizujemy parametry w estetycznym, responsywnym pulpicie WWW.',
    outcomes: [
      {
        title: 'Opanowanie protokołu Modbus & MQTT',
        description:
          'Zrozumiesz rejestry Holding Registers, Coils, mapowanie adresów oraz architekturę Publish/Subscribe.',
      },
      {
        title: 'Wizualizacja w Node-RED bez backendu',
        description:
          'Zbudujesz lekki serwer telemetryczny, który przetwarza dane z maszyny w czasie rzeczywistym i wyświetla wykresy.',
      },
      {
        title: 'Archiwizacja i alerty powiadomień',
        description:
          'Skonfigurujesz zapis danych do bazy oraz powiadomienia e-mail w razie przekroczenia temperatur czy stanów awaryjnych.',
      },
    ],
    forWhom: [
      'Dla automatyków, którzy chcą tworzyć nowoczesne systemy monitorowania maszyn (OEE, monitoring mediów).',
      'Dla programistów IT, którzy chcą poznać protokoły Industrial IoT i komunikować się z fizycznym sprzętem.',
      'Dla techników utrzymania ruchu szukających sposobu na zdalny podgląd stanu urządzeń.',
    ],
    notForWhom: [
      'Dla osób szukających zaawansowanych systemów SCADA za setki tysięcy złotych — tu budujemy zwinne, lekkie rozwiązania.',
    ],
    modules: [
      {
        number: '01',
        title: 'Komunikacja Przemysłowa: Modbus bez Tajemnic',
        description: 'Architektura Client/Server, mapowanie rejestrów i odczyt danych.',
        lessons: [
          'Lekcja 1: Dlaczego 45-letni protokół Modbus nadal rządzi przemysłem? (RTU vs TCP)',
          'Lekcja 2: Cztery obszary danych: Coils, Discrete Inputs, Input Registers, Holding Registers',
          'Lekcja 3: Adresacja 0-based vs 1-based oraz formaty liczb (Float IEEE 754, Big-Endian vs Little-Endian)',
          'Lekcja 4: Odpytywanie sterownika PLC za pomocą darmowych narzędzi diagnostycznych (Modbus Poll / QModMaster)',
          'Lekcja 5: Konfiguracja serwera Modbus TCP w sterowniku Siemens S7-1200 (blok MB_SERVER)',
        ],
      },
      {
        number: '02',
        title: 'MQTT: Nowoczesny Standard Przesyłu Danych IoT',
        description: 'Lekka telemetria, broker Mosquitto i architektura Pub/Sub.',
        lessons: [
          'Lekcja 1: Zasada działania MQTT: Broker, Publisher, Subscriber i tematy (Topics)',
          'Lekcja 2: Poziomy jakości usług (QoS 0, 1, 2) oraz flagi Retain i Last Will & Testament (LWT)',
          'Lekcja 3: Uruchomienie brokera Eclipse Mosquitto w kontenerze Docker',
          'Lekcja 4: Formatowanie danych przemysłowych do formatu JSON dla systemów IT',
          'Lekcja 5: Testowanie transmisji narzędziem MQTT Explorer',
        ],
      },
      {
        number: '03',
        title: 'Node-RED: Graficzny Mózg Integracji',
        description: 'Tworzenie przepływów danych, transformacje i logika biznesowa.',
        lessons: [
          'Lekcja 1: Instalacja Node-RED w warsztacie i podstawy pracy z węzłami (Nodes)',
          'Lekcja 2: Odczyt cykliczny rejestrów Modbus w Node-RED i parsowanie surowych bajtów',
          'Lekcja 3: Transformacja danych za pomocą węzła Function (prosty JavaScript)',
          'Lekcja 4: Publikacja odczytanych parametrów na tematy brokera MQTT',
          'Lekcja 5: Obsługa utraty połączenia i automatyczne wznawianie transmisji',
        ],
      },
      {
        number: '04',
        title: 'Pulpit Operatorski (Dashboard) i Archiwizacja',
        description: 'Wizualizacja parametrów na żywo, baza danych i alerty.',
        lessons: [
          'Lekcja 1: Budowa responsywnego panelu operatorskiego w Node-RED Dashboard',
          'Lekcja 2: Wskaźniki zegarowe, wykresy trendów temperatury i kontrolki stanu maszyn',
          'Lekcja 3: Zapis historii pomiarów do bazy SQLite / PostgreSQL',
          'Lekcja 4: Węzeł powiadomień: Automatyczny e-mail / alert w razie przekroczenia limitu awaryjnego',
          'Lekcja 5: Finał: Wdrożenie i zabezpieczenie całego systemu w lokalnej sieci zakładowej',
        ],
      },
    ],
    faqs: [
      {
        question: 'Czy muszę umieć biegle programować w JavaScript?',
        answer:
          'Nie. Node-RED to środowisko wizualne typu low-code oparte na łączeniu klocków. W kursie pokazujemy krok po kroku proste, kilkulinijkowe skrypty do przeliczania wartości (np. temperatura = surowy_odczyt / 10).',
      },
      {
        question: 'Na jakim sprzęcie mogę uruchomić ten most?',
        answer:
          'Na dowolnym domowym komputerze, serwerze przemysłowym IPC lub minikomputerze Raspberry Pi z systemem Linux/Windows.',
      },
    ],
    ctaText: 'Dołącz do listy oczekujących',
  },
];

export function getAllProducts(options?: { includeDrafts?: boolean }): Product[] {
  const includeDrafts = options?.includeDrafts ?? false;
  if (includeDrafts) {
    return PRODUCTS;
  }
  return PRODUCTS.filter((p) => !p.isDraft && p.status !== 'Szkic');
}

export function getProductBySlug(
  slug: string,
  options?: { includeDrafts?: boolean }
): Product | undefined {
  const includeDrafts = options?.includeDrafts ?? false;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return undefined;
  if (!includeDrafts && (product.isDraft || product.status === 'Szkic')) {
    return undefined;
  }
  return product;
}
