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

export interface Product {
  id: string;
  slug: string;
  title: string;
  headline: string;
  tagline: string;
  category: 'Kurs & Warsztat' | 'Szablon & Narzędzie' | 'E-book & Przewodnik';
  status: 'W realizacji' | 'Dostępny' | 'Przedsprzedaż';
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
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
