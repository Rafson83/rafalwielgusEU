import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  published: boolean | number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
  isScheduled?: boolean;
}

export function formatPolishDateWithWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  const weekday = d.toLocaleDateString('pl-PL', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return `${capitalizedWeekday}, ${day}`;
}

export const FALLBACK_POSTS: Post[] = [
  {
    id: 1,
    slug: 'manifest-long-life-learning',
    title: 'Manifest Long-Life Learning: Dlaczego wąska specjalizacja to ślepy zaułek',
    category: 'Rozwój',
    tags: 'long-life-learning, edukacja, rozwoj, psychologia, technologia, kariera',
    seoTitle: 'Manifest Long-Life Learning: Dlaczego wąska specjalizacja to ślepy zaułek — Rafał Wielgus',
    seoDescription:
      'W świecie automatyzacji i sztucznej inteligencji wygrywają ci, którzy łączą odległe kropki. Dlaczego uczenie się przez całe życie to jedyna trwała strategia?',
    published: 1,
    createdAt: '2026-09-15T09:00:00.000Z', // Pierwszy wtorek cyklu
    thumbnailUrl: '',
    content: `Przez całe dekady system edukacji i rynek pracy powtarzały nam jedno przykazanie: „Wybierz jedną dziedzinę, zrób z niej dyplom i trzymaj się jej kurczowo aż do emerytury”. Wąska specjalizacja miała być gwarancją bezpieczeństwa, stabilnej pensji i społecznego szacunku. Dziś, w świecie wykładniczego rozwoju sztucznej inteligencji, automatyzacji i nieustannych wstrząsów rynkowych, to przykazanie stało się niebezpieczną pułapką. Bycie wąskim specjalistą bez umiejętności patrzenia wszerz to najprostsza droga do zawodowej bezradności.

Zrozumiałem to na własnej skórze, nie z modnych książek o rozwoju, lecz w najbardziej bolesny sposób. Z wykształcenia jestem technikiem elektronikiem. Od szkoły podstawowej fascynowały mnie komputery, programowanie i obwody scalone. Kiedy zakładałem własny serwis AGD, byłem przekonany, że moja twarda wiedza techniczna wystarczy, by odnieść sukces. Umiałem zdiagnozować każdy moduł elektroniczny, wymienić procesor i przeprogramować pamięć EEPROM. A jednak mój biznes zakończył się spektakularnym bankructwem. Dlaczego? Ponieważ nie rozumiałem przepływów finansowych, psychologii klienta, negocjacji i zarządzania ryzykiem. Byłem sprawnym rzemieślnikiem, ale kompletnym dyletantem w sprawach, które decydują o przetrwaniu.

To bankructwo było moim najdroższym i najważniejszym życiowym MBA. Zamiast obrażać się na rzeczywistość, podjąłem decyzję, która zdefiniowała moje dalsze życie: nigdy więcej nie pozwolę zamknąć się w jednej szufladzie. Kiedy trafiłem do korporacji na stanowisko w kontroli jakości, nie skupiałem się tylko na pieczątkach i audytach. Chłonąłem metodyki zwinne (Agile), optymalizację procesów Lean i uczyłem się, jak wielkie organizacje radzą sobie z powtarzalnymi błędami. Niedługo później poszedłem na studia psychologiczne. Potrzebowałem zrozumieć, dlaczego ludzie podejmują irracjonalne decyzje i jak budować empatię, bez której nawet najsprawniejszy technik czy programista pozostaje tylko bezdusznym kalkulatorem.

Dziś pracuję w dziale utrzymania ruchu w firmie z branży recyklingu. Zmieniam świat od najbardziej fizycznej strony — dbając o to, by maszyny dawały surowcom drugie życie, a jednocześnie zgłębiam automatykę przemysłową i wdrażam narzędzia sztucznej inteligencji. I wiecie co? Wszystkie te z pozoru rozbieżne doświadczenia — elektronika, bankructwo, korporacyjny ład, psychologia i recykling — nagle złożyły się w jedną, niezwykle potężną całość.

Dlaczego wąska specjalizacja staje się ślepym zaułkiem? Ponieważ algorytmy, generatywne modele językowe i automatyzacja są bezkonkurencyjne właśnie w wąskich, powtarzalnych dziedzinach. Jeśli Twoja praca polega na mechanicznym powielaniu reguł w jednej dziedzinie, maszyna prędzej czy później zrobi to szybciej, taniej i bez snu. To, czego sztuczna inteligencja nie potrafi i długo nie będzie potrafiła, to łączenie odległych domen. Prawdziwa wartość rynkowa i innowacja powstają na styku: tam, gdzie technik rozumie psychologię użytkownika, programista myśli o kosztach recyklingu sprzętu, a menedżer potrafi sam napisać prosty skrypt automatyzujący nudne zadania.

Czym w mojej filozofii jest Long-Life Learning? To nie jest bezmyślne kolekcjonowanie kolorowych certyfikatów na LinkedInie ani czytanie streszczeń książek w aplikacjach. To postawa życiowa oparta na czterech twardych filarach:

Po pierwsze: Odwaga bycia początkującym. Z wiekiem zaczynamy panicznie bać się zadawania pytań. Boimy się, że wyjdziemy na niekompetentnych. Prawdziwy uczeń przez całe życie potrafi z uśmiechem powiedzieć: „Nie wiem, ale chętnie to rozłożę na części pierwsze i zrozumiem”. Kiedy zacząłem uczyć się nowoczesnych frameworków webowych i Pythona po latach pracy przy elektronice analogowej, czułem się zagubiony. Ale akceptacja tego dyskomfortu to jedyny warunek wzrostu.

Po drugie: Budowanie artefaktów zamiast konsumpcji wiedzy. Sama teoria bez wdrożenia to tylko szum informacyjny. Uczysz się programowania? Zbuduj własną stronę internetową. Uczysz się procesów jakościowych? Uporządkuj warsztat lub wyeliminuj powtarzający się błąd w swoim zespole. Wiedza staje się Twoją własnością dopiero wtedy, gdy stworzysz z niej coś namacalnego.

Po trzecie: Interdyscyplinarny transfer metafor. Gdy uczysz się elektroniki, dowiadujesz się o sprzężeniach zwrotnych. Kiedy pójdziesz na psychologię, odkryjesz, że te same pętle sprzężenia rządzą konfliktami w małżeństwie i w zespole produkcyjnym. Szukanie analogii między technologią a ludzką naturą to najszybszy akcelerator mądrości, jaki znam.

Po czwarte: Odporność na chwilowe mody (Signal over Noise). W technologii co kwartał pojawia się nowe, „rewolucyjne” narzędzie. Większość to efemerydy. Człowiek myślący w kategoriach Long-Life Learning inwestuje w fundamenty: podstawy logiki, strukturę danych, komunikację międzyludzką, krytyczne myślenie i zrozumienie fizycznego świata. Fundamenty nie starzeją się nigdy.

Nie musisz rzucać swojej obecnej pracy ani zaczynać trzech fakultetów naraz. Wystarczy, że przestaniesz traktować siebie jako „pana od jednej śrubki”. Pozwól sobie na ciekawość. Jeśli jesteś humanistą — sprawdź, jak działa prosty kod w HTML. Jeśli pracujesz z techniką lub maszynami — przeczytaj dobrą książkę o psychologii poznawczej. Wyjdź poza swój silos.

Ten blog powstał właśnie po to, by być przewodnikiem po tym świecie bez granic. Nie znajdziesz tu gotowych recept od samozwańczych guru. Znajdziesz tu warsztat człowieka, który każdego dnia uczy się na nowo, łączy kropki i nie boi się własnych błędów. Witaj w podróży.`,
  },
  {
    id: 2,
    slug: 'spektakularne-bankructwo-serwis-agd',
    title: 'Spektakularne bankructwo: Czego nauczył mnie upadek własnego serwisu AGD',
    category: 'Biznes',
    tags: 'biznes, przedsiebiorczosc, bankructwo, jakosc, procesy, finanse, porazka',
    seoTitle: 'Spektakularne bankructwo: Czego nauczył mnie upadek własnego serwisu AGD — Rafał Wielgus',
    seoDescription:
      'Bez lukrowania o upadku firmy, pułapce płynności i iluzji samowystarczalności. Jak bankructwo serwisu AGD stało się moim najważniejszym i najdroższym MBA.',
    published: 1,
    createdAt: '2026-09-17T09:00:00.000Z', // Czwartek cyklu
    thumbnailUrl: '',
    content: `W internecie wszyscy zarabiają miliony przed trzydziestką, a każda porażka na LinkedInie opisywana jest jako „fascynująca lekcja, za którą jestem niesamowicie wdzięczna”. Prawda o upadku własnego biznesu jest jednak znacznie bardziej brudna, bezwzględna i pozbawiona poezji. Prawda pachnie zapachem spalonego tranzystora o trzeciej w nocy, pustym kontem bankowym, natrętnym dzwonkiem telefonu i paraliżującym poczuciem wstydu przed rodziną i klientami.

Zanim trafiłem do korporacyjnej kontroli jakości, a później do utrzymania ruchu w branży recyklingu, byłem dumnym przedsiębiorcą. Zbudowałem od zera serwis AGD. Wydawało mi się, że mam w ręku wszystkie asy: byłem technikiem elektronikiem, kochałem grzebać w układach scalonych, a naprawa skomplikowanej płyty głównej w pralce czy zmywarce zajmowała mi mniej czasu niż konkurencji. Wierzyłem w naiwny mit powtarzany przez pokolenia: „Miej dobry fach w ręku, a klienci sami przyjdą, a biznes sam się obroni”. To jedno z najbardziej szkodliwych kłamstw, jakie można wmówić młodemu człowiekowi.

Firma działała przez kilka lat. Na początku wydawało się, że wszystko idzie świetnie: kalendarz pękał w szwach, jeździłem od klienta do klienta, telefon dzwonił bez przerwy. Czułem zapach niezależności. Niestety, bardzo szybko ta rzekoma niezależność przekształciła się w najcięższy etat świata. Pracowałem po 14–16 godzin na dobę, 7 dni w tygodniu. Jeżeli nie naprawiałem sprzętu u klienta, to siedziałem w warsztacie z lutownicą. Jeżeli nie lutowałem, to jechałem po części na drugi koniec miasta albo odpisywałem na wiadomości. Nie byłem przedsiębiorcą — byłem samozatrudnionym niewolnikiem własnego telefonu.

Pierwszą ścianą, w którą uderzyłem z pełną prędkością, był brutalny temat przepływów finansowych (cashflow). Nikt w technikum ani w żadnym poradniku dla początkujących nie wyjaśnił mi różnicy między „zyskiem na fakturze” a „gotówką w portfelu”. Kupowałem drogie moduły elektroniczne i programatory, zamrażając kapitał na półkach. Klienci zwlekali z płatnościami, marże zjadały rosnące koszty paliwa, podatki, narzędzia i nieprzewidziane reklamacje. Czasami okazywało się, że po trzech dniach walki z trudnym, nietypowym uszkodzeniem modułu inwerterowego zarobiłem mniej, niż gdybym zamiatał halę magazynową. Wystarczyło kilka większych zatorów płatniczych i seria pechowych awarii na gwarancji, by cała konstrukcja zaczęła się chwiać.

Drugim gwoździem do trumny był brak jakichkolwiek procesów i standardów. Wszystko opierało się na mojej głowie, moim czasie i mojej energii. Kiedy zachorowałem, firma nie zarabiała ani grosza. Kiedy byłem zmęczony, popełniałem proste błędy montażowe, które kosztowały podwójnie. Nie miałem procedur kwalifikacji klientów, więc brałem każde, nawet najbardziej toksyczne i nieopłacalne zlecenie. Wmawiałem sobie, że „klient nasz pan”, tracąc godziny na dyskusje z ludźmi, którzy oczekiwali cudów za ułamek rynkowej ceny.

Finał nie był filmowym dramatem. Był cichą, powolną agonią, która zakończyła się spektakularnym bankructwem. Musiałem zamknąć działalność z długami, sprzedać część sprzętu i spojrzeć w lustro z myślą: „Zawiodłeś”. Przez pierwsze tygodnie czułem się jak wrak. Czułem, że skoro nie poradziłem sobie z małym serwisem, to do niczego się nie nadaję.

Dopiero z perspektywy czasu zrozumiałem, że to bankructwo było najcenniejszym doświadczeniem mojego życia. Żadna uczelnia biznesowa nie nauczyłaby mnie tego, czego nauczyły mnie tamte zgliszcza. Oto 5 twardych lekcji, które ukształtowały całe moje późniejsze podejście do pracy, warsztatu i techniki:

Lekcja 1: Twardy fach to tylko 20% biznesu.
Możesz być geniuszem lutownicy, mistrzem Pythona albo wybitnym programistą PLC. Jeżeli nie potrafisz sprzedawać, nie rozumiesz rentowności, nie umiesz zarządzać marżą i nie znasz psychologii klienta — Twój talent zostanie zmarnowany. Biznes to system naczyń połączonych, a nie popis rzemieślniczej dumy.

Lekcja 2: Brak procesu to cichy zabójca.
Jeżeli Twoja praca polega na ciągłej improwizacji i „gaszeniu pożarów”, prędzej czy później spłoniesz. Dopiero po wejściu do korporacji i poznaniu kontroli jakości zrozumiałem potęgę standardów: instrukcji stanowiskowych, checklist i powtarzalnych procedur. Chaos nie jest romantyczny. Chaos zabija rentowność.

Lekcja 3: Gotówka jest tlenem (Cash is King).
Obrót to próżność, zysk to opinia, a gotówka na koncie to rzeczywistość. Jeśli Twoje pieniądze leżą w magazynie lub w niezapłaconych fakturach, jesteś bankrutem, który jeszcze o tym nie wie. Płynność finansowa i bufor bezpieczeństwa są ważniejsze niż jakiekolwiek plany ekspansji.

Lekcja 4: Asertywność i prawo do mówienia „nie”.
Nie każdy klient jest Twoim klientem. Błędna wycena i godzenie się na toksyczne warunki ze strachu przed brakiem pracy to gwarancja katastrofy. Prawdziwa dojrzałość polega na umiejętności odrzucania zleceń, które nie rokują lub generują więcej stresu niż wartości.

Lekcja 5: Porażka to wynik eksperymentu, a nie wyrok na Ciebie.
Najtrudniejszą rzeczą było oddzielenie upadku firmy od upadku mojego poczucia własnej wartości. Bankructwo firmy to fakt ekonomiczny: parametry układu zostały źle dobrane, układ uległ przeciążeniu i zadziałał bezpiecznik. Kropka. To nie oznacza, że jesteś bezwartościowym człowiekiem. To oznacza, że dostałeś twardą informację zwrotną od rzeczywistości.

Gdyby nie to bankructwo, nigdy nie poszedłbym do korporacji, by z pokorą uczyć się metodyk Agile i Lean. Nigdy nie poszedłbym na psychologię, by zrozumieć dynamikę ludzkich emocji. I nigdy nie doceniłbym stabilności i technologicznego piękna automatyki przemysłowej w dziale utrzymania ruchu.

Dziś, kiedy projektuję kurs „Kod Kariery” i uczę ludzi budowania własnej obecności w sieci, nie opowiadam im bajek o łatwym sukcesie. Uczę ich autorefleksji, twardej analizy własnych ograniczeń i tworzenia narzędzi, które mają solidne fundamenty. Bo w życiu i biznesie nie chodzi o to, by nigdy nie upaść. Chodzi o to, by z każdego upadku wstać z czystszą diagnozą i lepszym kodem.`,
  },
  {
    id: 3,
    slug: 'elektronik-na-kozetce-emocje',
    title: 'Elektronik na kozetce: Czego obwody i schematy nauczyły mnie o ludzkich emocjach',
    category: 'Psychologia',
    tags: 'psychologia, elektronika, emocje, relacje, rozwoj, empatia, technika',
    seoTitle: 'Elektronik na kozetce: Czego obwody i schematy nauczyły mnie o ludzkich emocjach — Rafał Wielgus',
    seoDescription:
      'Ludzie, podobnie jak obwody, ulegają przebiciom napięciowym, gdy brakuje im uziemienia i buforów. Co technik elektronik odkrył na studiach psychologicznych?',
    published: 1,
    createdAt: '2026-09-22T09:00:00.000Z', // Wtorek Tydzień 2
    thumbnailUrl: '',
    content: `Jako młody technik elektronik byłem przekonany, że świat jest logiczny, uporządkowany i przewidywalny. Jeśli obwód nie działa, bierzesz oscyloskop lub multimetr, mierzysz spadki napięć, szukasz zimnego lutu lub uszkodzonego tranzystora, wymieniasz element i sprzęt ożywa. Przez lata byłem nauczony myśleć zero-jedynkowo: sygnał jest albo go nie ma. Problem polega na tym, że gdy z takim podejściem wchodzisz w relacje z ludźmi, w zarządzanie zespołem albo w próby zrozumienia samego siebie — zderzasz się z rzeczywistością jak rozpędzony pociąg ze ścianą.

Kiedy po upadku mojej firmy i wejściu do korporacji zdecydowałem się pójść na studia psychologiczne, sporo osób z mojego technicznego otoczenia pukało się w czoło. „Rafał, po co technikowi ta humanistyczna papka? Przecież to tylko gadanie o uczuciach”. Dziś wiem, że to był jeden z najważniejszych kroków w moim rozwoju. Okazało się bowiem, że ludzka psychika wcale nie jest tak odległa od działania złożonych instalacji i obwodów, jak mogłoby się wydawać. Co więcej: prawa fizyki i elektroniki stanowią genialną metaforę procesów, które zachodzą w naszej głowie i w naszych relacjach.

Oto co technik elektronik zdiagnozował na psychologicznej kozetce:

1. Przebicia napięciowe i brak uziemienia (Grounding).
W elektronice uziemienie to przewód odprowadzający niebezpieczne ładunki do ziemi, chroniący delikatne podzespoły przed spaleniem. Z ludźmi jest dokładnie tak samo. Żyjemy pod ciągłym, wysokim napięciem: powiadomienia, terminy, kredyty, oczekiwania otoczenia. Jeśli nie masz „uziemienia” — kontaktu z naturą, fizycznego zmęczenia, snu, czasu offline i autentycznych rozmów — ładunek elektrostatyczny kumuluje się w Twoim układzie nerwowym. W końcu następuje przebicie dielektryka: wybuch złości o brudną szklankę w zlewie, atak paniki albo wypalenie. Zanim zaczniesz obwiniać siebie za „słaby charakter”, sprawdź, kiedy ostatnio podłączyłeś swój układ do ziemi.

2. Kondensatory, czyli pułapka buforowania emocji.
Kondensator magazynuje ładunek i oddaje go w ułamku sekundy, gdy jest potrzebny. Wielu z nas funkcjonuje jak kondensatory o zbyt dużej pojemności i zbyt niskim napięciu przebicia. Zbieramy w sobie urazy, przemilczamy niewygodne tematy w pracy, „zaciskamy zęby”, udając, że wszystko jest w porządku. Problem w tym, że żaden kondensator nie może ładować się w nieskończoność. Kiedy napięcie przekroczy próg krytyczny, następuje eksplozja — niszcząca nie tylko Ciebie, ale i elementy dookoła. Psychologia nauczyła mnie, że małe, bieżące rozładowania (asertywne mówienie o swoich granicach na bieżąco) są tysiąc razy bezpieczniejsze niż heroiczne tłumienie napięcia.

3. Rezystancja: Dlaczego pchanie na siłę pali układy.
Zgodnie z prawem Ohma prąd zależy od napięcia i oporu. Jeśli opór jest duży, a Ty na siłę zwiększasz napięcie, układ zaczyna się gwałtownie nagrzewać. W pracy i w życiu robimy to bez przerwy: widzimy opór w zespole lub we własnym ciele (prokrastynacja, zmęczenie) i zamiast zrozumieć, skąd ten opór wynika, podkręcamy presję („musisz bardziej się starać!”). Efekt? Przegrzanie i dym. Psychologia pokazała mi, że opór nie jest wrogiem — opór jest cenną informacją diagnostyczną. Mówi Ci: „Tutaj jest tarcie, zwolnij i sprawdź, co blokuje przepływ”.

4. Pętle sprzężenia zwrotnego (Feedback Loops).
W automatyce i akustyce sprzężenie zwrotne dodatnie to pisk mikrofonu przystawionego do głośnika — układ wzmacnia sam siebie aż do przesterowania. W relacjach międzyludzkich obserwuję to codziennie: lęk rodzi agresję, agresja rodzi obronę drugiej strony, obrona potęguje lęk. Bez świadomości procesowej tkwimy w takich pętlach latami, dziwiąc się, dlaczego rozmowa zawsze kończy się awanturą. Wyjście z pętli wymaga technicznej dyscypliny: ktoś musi świadomie zmienić parametry wejściowe, by zredukować sygnał błędu.

5. Człowiek to nie zepsuty przekaźnik.
Największą lekcją pokory było porzucenie odruchu technika: „natychmiastowego naprawiania”. Kiedy ktoś przychodzi do Ciebie z problemem, Twój techniczny mózg chce natychmiast wyciągnąć lutownicę: dać trzy rady, rozpisać plan naprawczy i zamknąć zgłoszenie. Ale ludzie nie potrzebują być naprawiani jak popsute tostery. Ludzie potrzebują być wysłuchani i zrozumiani. Prawdziwa empatia polega na gotowości posiedzenia z kimś przy wyłączonym silniku, zanim w ogóle zacznie się szukać przyczyn usterki.

Dziś, pracując na co dzień z automatyką i robotami na hali recyklingu, wiem jedno: najlepszymi specjalistami od techniki nie są ci, którzy znają na pamięć każdy rejestr sterownika PLC. Najlepsi technicy i automatycy to ci, którzy potrafią rozmawiać z operatorami, czują atmosferę w zespole i rozumieją, że za każdą zaciętą taśmą produkcyjną stoi zmęczony człowiek. Połączenie techniki z empatią to nie kompromis — to najpotężniejsza fuzja kompetencji, jaką możesz w sobie wypracować.`,
  },
  {
    id: 4,
    slug: 'kod-jako-wspolczesne-rzemioslo-logika-systemow',
    title: 'Kod jako współczesne rzemiosło: Dlaczego każdy powinien rozumieć logikę systemów',
    category: 'Technologia',
    tags: 'technologia, programowanie, kod, edukacja, html, automatyzacja, rzemioslo, web',
    seoTitle: 'Kod jako współczesne rzemiosło: Dlaczego każdy powinien rozumieć logikę systemów — Rafał Wielgus',
    seoDescription:
      'Programowanie to nie tajemna wiedza dla wybranych po politechnikach, ale współczesne pismo. Dlaczego zrozumienie logiki kodu daje Ci wolność i przewagę?',
    published: 1,
    createdAt: '2026-09-24T09:00:00.000Z', // Czwartek Tydzień 2
    thumbnailUrl: '',
    content: `Przez ostatnie dwadzieścia lat branża technologiczna zbudowała wokół programowania aurę współczesnego kapłaństwa. Wmawiano nam, że aby napisać prosty skrypt lub stworzyć stronę WWW, trzeba mieć wrodzony geniusz matematyczny, spędzić pięć lat na wydziale informatyki i pić kawę wyłącznie z kubka z binarnym kodem. W rezultacie miliony utalentowanych ludzi — prawników, logistyków, techników, marketingowców czy nauczycieli — zostało skutecznie zniechęconych do technologii, stając się bezradnymi petentami cyfrowego świata.

Czas wreszcie zerwać z tym mitem. Programowanie na podstawowym poziomie nie jest matematyką wyższą. Jest współczesnym rzemiosłem — odpowiednikiem czytania, pisania i posługiwania się prostymi narzędziami stolarskimi czy śrubokrętem. Sto lat temu analfabetyzm polegał na nieumiejętności złożenia liter w słowa. Dziś analfabetyzmem XXI wieku jest brak elementarnego rozumienia, jak działają systemy, algorytmy i reguły, które sterują naszym życiem.

Sam jestem samoukiem. W szkole podstawowej, gdy stawiałem pierwsze kroki przy starych komputerach i rozkręcałem pierwsze płytki drukowane, nie miałem pojęcia o skomplikowanych wzorach matematycznych. Kodowałem metodą prób i błędów. Chciałem, żeby migająca dioda zapalała się wtedy, gdy wcisnę przycisk. Chciałem, żeby prosty program w Basicu narysował na ekranie koło. Ta dziecięca ciekawość nauczyła mnie najważniejszej prawdy o kodzie: programowanie to po prostu sztuka precyzyjnego wydawania poleceń i dekompozycji dużych problemów na miniaturowe, wykonalne kroki.

Dlaczego uważam, że każdy człowiek myślący w duchu Long-Life Learning powinien posiąść podstawową znajomość logiki kodu (choćby HTML-a, CSS-a czy prostego Pythona)? Oto cztery powody:

1. Odzyskanie cyfrowej suwerenności.
Kiedy nie rozumiesz, jak działa przeglądarka internetowa, formularz na stronie czy baza danych, jesteś zmuszony wierzyć na słowo korporacjom i drogim agencjom. Każda drobna zmiana staje się barierą nie do przejścia. Kiedy potrafisz zajrzeć w narzędzia deweloperskie (DevTools w przeglądarce) i przeczytać strukturę strony, przestajesz być biernym konsumentem cudzych interfejsów — stajesz się świadomym użytkownikiem sieci.

2. Uporządkowanie własnego aparatu myślenia.
Kod jest bezlitosny, ale sprawiedliwy. Komputer nie domyśla się, co „miałeś na myśli”. Jeśli pominiesz średnik, źle zamkniesz nawias lub podasz złą ścieżkę do pliku — program nie zadziała. Ta bezwzględna dyscyplina uczy pokory i logicznego myślenia lepiej niż jakiekolwiek teoretyczne kursy logiki. Zaczynasz myśleć w kategoriach warunków brzegowych: „Co jeśli użytkownik poda pusty ciąg znaków?”, „Co się stanie, gdy zerwie się połączenie?”. Ten nawyk przewidywania skutków natychmiast przekłada się na jakość podejmowanych decyzji w biznesie i życiu prywatnym.

3. Dźwignia automatyzacji: Przestań być robotem przed komputerem.
Zastanów się, ile godzin w tygodniu marnujesz na klikanie tych samych tabelek w Excelu, kopiowanie danych między systemami czy formatowanie dokumentów. Człowiek nie został stworzony do powtarzania stu takich samych kliknięć. Komputer został do tego stworzony! Prosty skrypt napisany w kilkanaście minut potrafi wykonać w trzy sekundy pracę, która Tobie zajmowała całe popołudnie. Nie musisz budować sztucznej inteligencji — wystarczy, że nauczysz się zautomatyzować własną nudę.

4. Twoja osobista tożsamość w sieci (Własne wirtualne CV).
To jest fundament, na którym opieram mój kurs „Kod Kariery”. Kiedy wysyłasz rekruterowi plik PDF wygenerowany z darmowego szablonu, jesteś tylko jednym z pięciuset jednakowych załączników, które algorytm ATS przemieli w ułamku sekundy. Kiedy natomiast przesyłasz link do własnej, autorskiej strony WWW, postawionej przez Ciebie na darmowym hostingu GitHub Pages, napisaną czystym kodem w HTML i Tailwindzie — diametralnie zmieniasz zasady gry. Udowadniasz, że nie boisz się nowoczesnych narzędzi, dbasz o detale i masz odwagę budować własne produkty cyfrowe.

Nie musisz rzucać swojego zawodu, by zostać programistą na pełen etat. Wręcz przeciwnie! Najbardziej poszukiwanymi ludźmi na rynku są specjaliści łączący swoją pierwotną domenę (np. logistykę, finanse, kontrolę jakości, psychologię) ze znajomością kodu. Tacy ludzie budują mosty między biznesem a działami IT, oszczędzając firmom miliony złotych na nieporozumieniach.

Kod to nie czarna magia. To narzędzie, tak samo jak lutownica, ołówek czy klucz francuski. Weź je do ręki, przełam strach przed terminalem i zacznij tworzyć rzeczy, które zostają w sieci na Twoich własnych warunkach.`,
  },
  {
    id: 5,
    slug: 'lek-przed-byciem-poczatkujacym-glupie-pytania',
    title: 'Lęk przed byciem początkującym: Dlaczego dorośli boją się zadawać głupie pytania',
    category: 'Psychologia',
    tags: 'psychologia, rozwoj, edukacja, odwaga, ego, nauka, warsztat, autorefleksja',
    seoTitle:
      'Lęk przed byciem początkującym: Dlaczego dorośli boją się zadawać głupie pytania — Rafał Wielgus',
    seoDescription:
      'Dlaczego po trzydziestce paraliżuje nas strach przed wyjściem na dyletanta? O klątwie kompetencji, obronie ego i odwadze do bycia zielonym.',
    published: 1,
    createdAt: '2026-09-29T09:00:00.000Z', // Wtorek Tydzień 3
    thumbnailUrl: '',
    content: `Kiedy dziecko ma siedem lat, zadaje około trzystu pytań dziennie. Dlaczego niebo jest niebieskie? Skąd prąd wie, w którą stronę płynąć w kablu? Co się stanie, jak wrzucę monetę do gniazdka? Dziecko nie kalkuluje, czy pytanie brzmi mądrze. Nie boi się utraty reputacji. Po prostu chce zrozumieć świat.

A teraz przenieśmy się do sali konferencyjnej w korporacji albo na zebranie techniczne na hali produkcyjnej. Dwudziestu dorosłych ludzi w garniturach lub roboczych polarach słucha prezentacji o wdrożeniu nowego systemu ERP albo nowego protokołu sterowników PLC. Prowadzący rzuca skrótami, których połowa sali w ogóle nie rozumie. W pewnym momencie pyta: „Czy wszystko jest jasne? Czy ktoś ma pytania?”.

Zalega grobowa cisza. Ludzie potakują z mądrymi minami, notują coś nerwowo w notesach, a w środku oblewa ich zimny pot. Nikt nie podniesie ręki. Nikt nie powie: „Przepraszam, ale nie mam pojęcia, o czym pan mówi od dwudziestu minut. Proszę mi to wyjaśnić od podstaw”.

Dlaczego w dorosłym życiu wolimy brnąć w błąd, marnować tygodnie pracy i narażać projekty na katastrofę, byle tylko nie przyznać się do niewiedzy?

### Klątwa kompetencji: Gdy przeszłe sukcesy stają się więzieniem

Zjawisko to doskonale znam z własnego życiorysu. Przez lata byłem technikiem elektronikiem. W serwisie AGD, a potem na warsztacie czułem się pewnie: rozkładałem programatory, znałem zachowanie układów scalonych, potrafiłem po zapachu palonego rezystora zdiagnozować sekcję zasilacza. Zbudowałem sobie tożsamość człowieka, który „wie, jak to naprawić”.

I nagle, po trzydziestce, po bankructwie i wejściu w nowe obszary, stanąłem przed koniecznością nauki programowania od zera, a niedługo później poszedłem na studia psychologiczne.

Pamiętam ten paraliżujący dyskomfort, gdy po raz pierwszy odpaliłem terminal linuksowy i próbowałem uruchomić prosty skrypt w Pythonie. Skrypt wywalał błąd składniowy w kółko, a ja siedziałem przed monitorem ze ściśniętym gardłem. Mój wewnętrzny krytyk ryczał: „Rafał, masz ponad trzydzieści lat, naprawiałeś skomplikowane płyty główne, a teraz nie potrafisz zrozumieć prostej pętli 'for'? Daj sobie spokój, robisz z siebie pośmiewisko”.

To samo czułem na zajęciach z psychologii rozwojowej, gdy dwudziestolatki sypały nazwiskami teoretyków, a ja czułem się jak intruz w roboczych butach, który pomylił budynki.

Psychologia nazywa to zjawisko pułapką kompetencji (Competence Trap). Im więcej wiesz w jednej dziedzinie i im wyższy status zawodowy osiągnąłeś, tym trudniej znieść poczucie bycia kompletnym amatorem w innej. Nasze ego utożsamia wiedzę z poczuciem własnej wartości. Przyznanie: „nie wiem, jestem zielony” odbieramy niemal jak fizyczne zagrożenie dla naszej pozycji.

### Efekt reflektora: Nikt na Ciebie nie patrzy tak surowo, jak Ty sam

Drugim psychologicznym mechanizmem, który blokuje nas przed zadawaniem pytań, jest tzw. efekt reflektora (Spotlight Effect). Wydaje nam się, że oczy wszystkich ludzi dookoła są skierowane wyłącznie na nas. Wyobrażamy sobie, że jeśli zapytamy o banalną rzecz, całe otoczenie uzna nas za dyletantów i będzie pamiętać naszą wpadkę przez lata.

Prawda jest o wiele bardziej wyzwalająca: ludzie są zbyt zajęci martwieniem się o własną niepewność, by analizować Twoją. Co więcej — w 90% przypadków, kiedy ktoś na sali przełamuje strach i zadaje „głupie pytanie”, połowa obecnych w duchu oddycha z ulgą, myśląc: „Dzięki Bogu, że o to zapytał, bo sam nie miałem odwagi”.

### Lekcja z hali przemysłowej: Strach przed pytaniem kosztuje miliony

W pracy na hali produkcyjnej w dziale utrzymania ruchu lęk przed zadawaniem pytań przestaje być tylko dylematem psychologicznym — staje się realnym zagrożeniem dla bezpieczeństwa i ciągłości pracy.

Najgroźniejszy pracownik na hali to nie ten, który jest świeżo po szkole i mówi wprost: „Panie Rafale, nie wiem, jak odblokować ten siłownik pneumatyczny, boję się, że coś urwę”. Taki człowiek jest bezpieczny. Pokażesz mu raz, drugi, zrozumie i zapamięta.

Prawdziwą bombą z opóźnionym zapłonem jest pracownik z wieloletnim stażem, który wstydzi się przyznać, że nie rozumie nowego pulpitu dotykowego HMI. Zamiast zapytać, wciska przyciski na chybił-trafił, resetuje błędy bez przeczytania kodu usterki i udaje, że wszystko kontroluje. Efekt? Uszkodzona przekładnia, zerwana taśma transportowa i postój linii generujący dziesiątki tysięcy złotych strat na godzinę.

Wielokrotnie widziałem, jak jedno proste, z pozoru naiwne pytanie: „A dlaczego ta pompa właściwie pracuje tak głośno od trzech dni?” ujawniało wyciek oleju, który zignorowali wszyscy „wielcy eksperci”, bo uznali, że skoro nikt nie zgłasza, to tak ma być.

### Shoshin: Praktyka umysłu początkującego

W filozofii Zen istnieje pojęcie Shoshin — umysł początkującego. Oznacza ono postawę otwarcia, ciekawości i braku uprzedzeń podczas badania dowolnego problemu, dokładnie taką, jaką ma małe dziecko. W umyśle początkującego istnieje wiele możliwości; w umyśle eksperta — zaledwie kilka.

Jak wypracować w sobie tę odwagę na co dzień?

1. Zmień wewnętrzną narrację. Zamiast mówić sobie: „Powinienem to wiedzieć, jestem beznadziejny”, powiedz: „Jakie to ciekawe, że tego jeszcze nie rozumiem. Mam przed sobą nowy rewir do zbadania”.
2. Używaj techniki Feynmana. Kiedy próbujesz się czegoś nauczyć, zmuś się do wytłumaczenia tego zagadnienia w taki sposób, jakbyś mówił do dwunastolatka. Jeśli musisz używać trudnych słów i żargonu, to znaczy, że sam tego nie rozumiesz. Zadawaj pytania tak długo, aż sprowadzisz temat do fizycznych fundamentów.
3. Mów głośno: „Nie rozumiem, doprecyzuj proszę”. Zobaczysz, jak ogromny szacunek budzi ta deklaracja. Ludzie instynktownie wyczuwają autentyczność. Człowiek, który nie boi się przyznać do niewiedzy, jest postrzegany jako pewniejszy siebie niż ten, który maskuje braki napuszonym słownictwem.
4. Zbuduj odporność na błędy (Fail-safe mindset). W technice obwody zabezpiecza się bezpiecznikami. W nauce Twoim bezpiecznikiem jest zgoda na popełnianie błędów w bezpiecznym środowisku: w piaskownicy kodu, w domowym warsztacie, na własnej stronie WWW.

Long-Life Learning nie polega na stawaniu się wszystkowiedzącym mędrcem. Polega na nieustannej gotowości do bycia nowicjuszem. Następnym razem, gdy poczujesz ten znajomy ucisk w gardle przed zadaniem pytania — weź głęboki oddech, podnieś rękę i zapytaj. To nie jest dowód słabości. To pierwszy i najważniejszy krok do prawdziwej biegłości.`,
  },
  {
    id: 6,
    slug: 'ai-na-hali-produkcyjnej-modele-jezykowe-fizyczne-maszyny',
    title: 'AI na hali produkcyjnej: Jak połączyć modele językowe z fizycznymi maszynami',
    category: 'Automatyka & AI',
    tags: 'automatyka, sztuczna inteligencja, przemysl, utrzymanie ruchu, recykling, plc, llm, technologia',
    seoTitle:
      'AI na hali produkcyjnej: Jak połączyć modele językowe z fizycznymi maszynami — Rafał Wielgus',
    seoDescription:
      'Internet zachwyca się generowaniem wierszy przez AI, tymczasem na hali przemysłowej zacięła się taśma. Jak połączyć LLM z fizycznym światem czujników i maszyn?',
    published: 1,
    createdAt: '2026-10-01T09:00:00.000Z', // Czwartek Tydzień 3
    thumbnailUrl: '',
    content: `Gdy otwierasz LinkedIna albo serwisy technologiczne, sztuczna inteligencja jawi się jako wszechpotężna, niemal magiczna siła. Modele językowe piszą eseje, generują fotorealistyczne wideo, zdają egzaminy medyczne i analizują tysiące umów prawnych w ułamku sekundy. Wszystko to dzieje się w sterylnym, klimatyzowanym świecie chmury obliczeniowej.

A potem o szóstej rano wchodzisz na halę przemysłową w zakładzie recyklingu.

W powietrzu unosi się specyficzny zapach rozgrzanego oleju hydraulicznego i pyłu. Zespół przenośników taśmowych transportuje tony sprasowanego surowca. Nagle rozlega się głośny sygnał alarmowy, na wieży sygnalizacyjnej zapala się czerwone światło, a linia staje w miejscu. Na pulpicie operatorskim miga lakoniczny komunikat: „Błąd 0x4A: Przekroczenie prądu przeciążeniowego silnika M3. Blokada sekcji 2”.

W tym momencie cały ten marketingowy szum wokół AI zderza się z twardą, fizyczną ścianą. Żaden chatbot nie weźmie klucza francuskiego, nie wejdzie pod podest technologiczny i nie wymieni zatartego łożyska. Prawa fizyki, brud, wibracje i zużycie mechaniczne są absolutnie odporne na generatywne promptowanie.

Czy to oznacza, że nowoczesne narzędzia AI są w przemyśle bezużyteczną zabawką? Absolutnie nie. Oznacza to jedynie, że musimy przestać traktować AI jak wyrocznię, a zacząć jak precyzyjne narzędzie diagnostyczne w torbie technika.

### Gdzie kończy się chmura, a zaczyna fizyka

Podstawowy problem z wdrażaniem sztucznej inteligencji w fizycznym świecie polega na różnicy natur obu środowisk.

Świat modeli językowych (LLM) jest probabilistyczny — operuje na prawdopodobieństwie wystąpienia kolejnego słowa. Jeśli model pomyli się o 5% w streszczeniu artykułu, nikt nie ucierpi. 
Świat przemysłu i automatyki (sterowniki PLC, sieci Profinet, obwody bezpieczeństwa Safety) jest deterministyczny. Sygnał z wyłącznika krańcowego albo jest, albo go nie ma. Logika drabinkowa w sterowniku Siemens czy Omron nie dopuszcza „halucynacji”. Jeden błąd logiczny w sterowaniu prasą może zniszczyć formę wartą setki tysięcy złotych albo zagrozić życiu operatora.

Dlatego łączenie AI z maszynami nie polega na wpuszczaniu modelu językowego do bezpośredniego sterowania przekaźnikami w czasie rzeczywistym. Polega na zbudowaniu inteligentnego mostu informacyjnego pomiędzy maszyną a technikiem.

Oto cztery realne, pragmatyczne zastosowania, które wdrażam i testuję w codziennej praktyce utrzymania ruchu:

### 1. Inteligentny tłumacz DTR (Dokumentacji Techniczno-Ruchowej)

Każda nowoczesna linia przemysłowa to kilkadziesiąt opasłych segregatorów. Tysiące stron schematów elektrycznych, pneumatycznych, wykazów części zamiennych i instrukcji w języku niemieckim, włoskim czy angielskim.

Gdy o 2:30 w nocy dochodzi do awarii zaworu proporcjonalnego na stacji hydraulicznej, technik nie ma czasu wertować 600-stronicowej DTR-ki w poszukiwaniu tabeli z kodami błędów cewek. Tutaj lokalny model RAG (Retrieval-Augmented Generation), „nakarmiony” kompletną dokumentacją maszyn zakładu, działa jak objawienie.

Technik wyciąga tablet lub telefon i pisze:
„Linia sortowania, prasa kanałowa, błąd E-24. Zawór YV-12 nie osiąga pozycji bazowej. Podaj numer bezpiecznika w szafie R-3 i zalecaną rezystancję cewki według schematu.”

W trzy sekundy otrzymuje precyzyjną odpowiedź:
„Bezpiecznik F18 (sekcja 4B w szafie R-3). Prawidłowa rezystancja cewki zaworu wynosi 24,5 Ohm. Jeśli rezystancja spada poniżej 18 Ohm, sprawdź stan wtyczki Hirschmann pod kątem zaolejenia.”

To nie zastępuje myślenia technika. To oszczędza 45 minut bezproduktywnego szukania dokumentacji, skracając przestój linii o połowę.

### 2. Odczyt i semantyczna analiza logów przemysłowych

Nowoczesne sterowniki PLC i falowniki rejestrują tysiące zdarzeń na sekundę. Kiedy dochodzi do tzw. „awarii widmo” — linia sporadycznie wyłącza się raz na dwa dni bez wyraźnego powodu — analiza surowych plików CSV z logami jest dla człowieka koszmarem.

LLM radzą sobie z tym zadaniem fenomenalnie. Podając modelowi wyeksportowany fragment logów z magistrali komunikacyjnej (np. Modbus TCP czy Profinet), możemy poprosić o analizę sekwencji czasowej:
„Znajdź anomalie czasowe pomiędzy sygnałem potwierdzenia obecności detalu z fotokomórki B12 a impulsem załączenia sprzęgła elektromechanicznego w ostatnich 200 cyklach.”

Model w ułamku sekundy wyłapuje, że w 3 przypadkach czas odpowiedzi czujnika opóźnił się o 120 milisekund — co wskazuje na zabrudzenie optyki lub początek uszkodzenia przewodu w łańcuchu kablowym.

### 3. Asystent generowania skryptów i automatyzacji raportów

Wielu świetnych techników i automatyków ma doskonałe wyczucie mechaniki i elektrotechniki, ale nie pisze płynnie kodu w Pythonie czy skryptów bashowych do parsowania danych telemetrycznych.

AI działa tutaj jako wzmacniacz kompetencji. Potrzebujesz zintegrować dane z przetwornika temperatury z bazą SQLite i wyświetlić prosty wykres trendu w przeglądarce? Zamiast spędzać dwa dni na forach programistycznych, formułujesz zapytanie techniczne i w 5 minut masz gotowy szkielet działającego kodu, który po drobnej adaptacji wykonuje zadanie.

### 4. Predictive Maintenance oparty na mikromodelach

W utrzymaniu ruchu kluczem jest przejście od naprawiania awarii (reakcja) do przewidywania usterek (predykcja). Doświadczony technik potrafi przyłożyć dłoń do korpusu pompy i powiedzieć: „to łożysko zaraz padnie, bo ma inną wibrację”. 

Łącząc tanie akcelerometry MEMS i czujniki prądowe Halla z mikro-modelami uczenia maszynowego (TinyML uruchamianymi bezpośrednio na mikrokontrolerach ESP32 czy Raspberry Pi), możemy wyposażyć każdą kluczową maszynę w takie „elektroniczne ucho”. Model uczy się profilu wibracji zdrowego napędu i alarmuje technika na tygodnie przed tym, zanim łożysko ulegnie zatarciu i zablokuje wał.

### Pętla zwrotna zawsze zamyka się na człowieku

Najważniejsza konkluzja z pracy na fizycznej linii produkcyjnej jest jedna: sztuczna inteligencja jest tak dobra, jak dane, które do niej wprowadzisz, i ręce, które wdrożą jej wnioski.

Nawet najbardziej zaawansowany algorytm predykcyjny jest bezradny, gdy wtyczka M12 zaśniedzieje, a czujnik indukcyjny zostanie wygięty przez kawałek blachy na taśmie. Przyszłość przemysłu i automatyki nie należy do marzycieli wierzących w „fabryki bez ludzi”, ani do konserwatystów odrzucających cyfrowe narzędzia.

Należy do wszechstronnych techników i praktyków, którzy potrafią jedną ręką trzymać multimetr i klucz dynamometryczny, a drugą sprawnie posługiwać się modelami sztucznej inteligencji. To właśnie jest sedno interdyscyplinarności, o której piszę na tym blogu.`,
  },
  {
    id: 7,
    slug: 'utrzymanie-ruchu-w-zyciu-osobistym-prewencja-zamiast-reanimacji',
    title: 'Utrzymanie ruchu w życiu osobistym: Dlaczego prewencja jest tańsza niż reanimacja',
    category: 'Rozwój',
    tags: 'rozwoj, psychologia, utrzymanie ruchu, prewencja, zdrowie, nawyki, rzemioslo, automatyka',
    seoTitle:
      'Utrzymanie ruchu w życiu osobistym: Dlaczego prewencja jest tańsza niż reanimacja — Rafał Wielgus',
    seoDescription:
      'W fabryce maszyny mają planowe przeglądy i wymianę filtrów. W życiu jedziemy na 110% aż do zawału lub wypalenia. Czego technika uczy o dbaniu o siebie?',
    published: 1,
    createdAt: '2026-10-06T09:00:00.000Z', // Wtorek Tydzień 4
    thumbnailUrl: '',
    content: `W przemyśle istnieją dwie diametralnie różne filozofie dbania o park maszynowy.

Pierwsza nazywa się w branżowym żargonie „Run to Failure” (eksploatacja aż do awarii). Polega na tym, że maszyna pracuje na pełnych obrotach bez żadnych przerw, kontroli i wymiany materiałów eksploatacyjnych tak długo, aż z głośnym hukiem pęknie wał napędowy, zapali się uzwojenie stojana, a rozgrzany olej wyleje się na posadzkę. Wtedy do akcji wkracza ekipa ratunkowa: praca w nocy, sprowadzanie części ekspresowym kurierem za potrójną stawkę, nerwowe telefony od zarządu i koszmarne straty finansowe spowodowane przestojem.

Druga filozofia to TPM — Total Productive Maintenance (Kompleksowe Utrzymanie Ruchu). To codzienna, systematyczna rutyna: sprawdzanie poziomu oleju, czyszczenie optyki czujników, kontrola naciągu pasków klinowych i planowa wymiana łożysk po określonej liczbie roboczogodzin — zanim w ogóle zaczną hałasować.

Gdy obserwuję, jak współcześni ludzie zarządzają swoim zdrowiem, relacjami i energią życiową, mam nieodparte wrażenie, że 95% z nas prowadzi własne ciało i umysł według najgorszego, bandyckiego modelu „Run to Failure”.

Jedziemy na 110% obrotów. Ignorujemy piski w stawach, chroniczny ból karku, migreny i bezsenność. Zagłuszamy kontrolki ostrzegawcze trzecią kawą i napojem energetycznym. A potem, gdy układ nerwowy wreszcie ulega zwarciu — w postaci zawału, załamania psychicznego, depresji lub rozwodu — trafiamy na „kapitalny remont” na oddziale szpitalnym albo w gabinecie terapeutycznym, płacąc gigantyczną cenę za próbę reanimacji zgliszcz.

Wiem o tym aż za dobrze. Sam prowadziłem w ten sposób mój serwis AGD aż do bankructwa.

### Mój osobisty „Run to Failure”

Kiedy rozkręcałem własną firmę, uważałem, że odpoczynek jest dla słabych. Spałem po cztery godziny na dobę, jadłem w biegu na warsztacie z lutownicą w ręku, ignorowałem zmęczenie i powtarzałem sobie: „Odpocznę, jak zrealizuję wszystkie zlecenia”. Mój organizm wysyłał sygnały ostrzegawcze: drżenie powiek, skoki ciśnienia, rozdrażnienie, brak koncentracji. Traktowałem je jak uciążliwego natręta.

Finał? Kiedy układ uległ przeciążeniu, nie straciłem tylko pieniędzy i firmy. Straciłem zdrowie, wiarę w siebie i zdolność logicznego myślenia na długie miesiące. Koszt „reanimacji” mojego życia po tamtym krachu był nieporównywalnie wyższy niż zysk z zarwanych nocy.

Dopiero praca w dziale utrzymania ruchu na hali recyklingu wbiła mi do głowy fundamentalną zasadę techniki i warsztatu: **nie ma czegoś takiego jak maszyna niezniszczalna**. Każdy układ, który nie ma zaplanowanych przerw technicznych, w końcu sam wybierze moment zatrzymania — i będzie to najgorszy możliwy moment.

### 4 zasady Utrzymania Ruchu dla Twojego życia

Jak przenieść najlepsze standardy przemysłowego TPM do codziennego życia, by nie dopuścić do krytycznej awarii?

#### 1. Codzienna inspekcja autonomiczna (5 minut rano i wieczorem)
Na hali każdy operator przed uruchomieniem linii wykonuje tzw. checklistę autonomiczną: sprawdza stan osłon, obecność wycieków i ciśnienie w układzie pneumatycznym. 

Zrób to samo ze sobą. Zanim rano sięgniesz po telefon i nakarmisz mózg cyfrowym ściekiem powiadomień, usiądź na 3 minuty i zrób skan układu:
* Jak bije moje serce? Czy czuję napięcie w klatce piersiowej?
* Czy mój sen przyniósł regenerację, czy obudziłem się z długiem energetycznym?
* Co dziś jest moim priorytetem, a co zbędnym obciążeniem?

Jeśli czujesz, że Twój „prąd spoczynkowy” jest zbyt wysoki, nie planuj na ten dzień bicia rekordów wydajności. Zredukuj obciążenie, zanim zadziała bezpiecznik.

#### 2. Planowe postoje technologiczne to nie lenistwo
W fabryce nikt nie uważa planowego postoju linii za stratę czasu. Wszyscy wiedzą, że dwugodzinny przegląd w sobotę zapobiega dwutygodniowemu postojowi w środku sezonu produkcyjnego.

W życiu wmówiono nam toksyczny kult „wiecznego zapieprzu” (hustle culture). Jeśli nie pracujesz, czujesz poczucie winy. To błąd logiczny. Regeneracja nie jest nagrodą za wykonaną pracę — jest bezwzględnym warunkiem technicznym wykonania kolejnej pracy. Spacer po lesie, sen trwający 8 godzin, niedziela bez komputera to nie fanaberia. To wymiana oleju w Twoim procesorze.

#### 3. Wymiana filtrów (Higiena wejścia)
Jeżeli do precyzyjnego silnika hydraulicznego wlejesz zanieczyszczony olej z opiłkami metalu, pompa zatrze się w kilkanaście minut. Dlatego stosuje się filtry bocznikowe i magnetyczne.

Czym karmisz swój umysł? Jeśli od rana do wieczora pompujesz w siebie sensacyjne nagłówki, clickbaity, kłótnie w mediach społecznościowych i cudze frustracje, Twój filtr poznawczy ulega zapchaniu. Stajesz się nerwowy, przestraszony i niezdolny do głębokiego skupienia. Załóż filtr: wyłącz powiadomienia, usuń aplikacje drenujące uwagę, czytaj książki zamiast rolek na TikToku.

#### 4. Smarowanie łożysk, czyli mikronawyki w relacjach
Najczęstszą przyczyną zatarcia łożyska nie jest nagłe uderzenie pioruna, lecz brak jednej kropli smaru podawanej systematycznie przez automatyczną smarownicę. Tarcie rośnie powoli, temperatura rośnie niezauważalnie, aż metal spawa się z metalem.

Dokładnie tak samo umierają małżeństwa, przyjaźnie i relacje w zespołach. Nie z powodu wielkich zdrad, ale z powodu braku codziennego „smarowania”: dobrego słowa, uważnego wysłuchania bez telefonu w ręku, zwykłego „dziękuję, że jesteś”. Próba ratowania relacji drogim wyjazdem raz na pięć lat, gdy łożysko jest już spalone, to klasyczna, spóźniona reanimacja.

### Prewencja wymaga odwagi

Prewencja ma jedną wielką wadę psychologiczną: gdy działa, nic spektakularnego się nie dzieje. Wszystko po prostu pracuje stabilnie, cicho i miarowo. Nikt nie wręcza medali technikowi utrzymania ruchu za to, że maszyna nie stanęła ani razu w ciągu miesiąca. Wszyscy zauważają technikę dopiero wtedy, gdy wszystko się wali.

W życiu osobistym jest tak samo. Pójście na badania profilaktyczne, położenie się spać o 22:30 czy odmówienie kolejnego zlecenia nie wyglądają heroicznie na Instagramie. Ale to właśnie te ciche, prewencyjne decyzje decydują o tym, czy za dziesięć lat będziesz sprawnym, twórczym i szczęśliwym człowiekiem, czy wrakiem zbieranym z podłogi.

Zadbaj o swój układ, zanim on sam zmusi Cię do awaryjnego postoju.`,
  },
  {
    id: 8,
    slug: 'rzemioslo-kontra-masowka-wlasny-kawalek-internetu',
    title: 'Rzemiosło kontra masówka: Dlaczego warto mieć własny kawałek internetu',
    category: 'Biznes',
    tags: 'biznes, technologia, niezaleznosc, web, rzemioslo, edukacja, kod-kariery, suwerennosc',
    seoTitle:
      'Rzemiosło kontra masówka: Dlaczego warto mieć własny kawałek internetu — Rafał Wielgus',
    seoDescription:
      'W erze generatywnego śmieciowego contentu i algorytmów społecznościowych własna strona WWW staje się twierdzą suwerenności. Dlaczego rzemiosło wygrywa z plastikiem?',
    published: 1,
    createdAt: '2026-10-08T09:00:00.000Z', // Czwartek Tydzień 4
    thumbnailUrl: '',
    content: `Żyjemy w epoce cyfrowego fast foodu. Wystarczy wpisać jedno zdanie do modelu językowego, nacisnąć przycisk i po trzech sekundach otrzymać gotowy, gładki i doskonale nijaki wpis na bloga, e-book w formacie PDF albo serię postów na media społecznościowe.

Internet został zalany niewyobrażalną falą plastikowej, bezdusznej masówki. Wszyscy używają tych samych promptów, tych samych szablonów graficznych z Canvy i tych samych marketingowych chwytów. Efekt? Całkowita utrata smaku, tożsamości i zaufania. Wszystko wygląda jak zrobione z tej samej foremki z taniego tworzywa sztucznego.

A przecież w historii techniki już to przerabialiśmy.

Kiedy w XIX wieku rewolucja przemysłowa przyniosła masową produkcję, świat zachwycił się taniością i powtarzalnością. Ale bardzo szybko ludzie zorientowali się, że maszynowe odlewy nie mają duszy, psują się po kilku miesiącach i są pozbawione indywidualnego charakteru. W odpowiedzi narodził się ruch Arts and Crafts — powrót do szlachetnego rzemiosła, do pracy ludzkich rąk, do dbałości o detal, trwałość i autentyczność surowca.

Dziś stoimy dokładnie w tym samym punkcie zwrotnym w świecie technologii cyfrowych. W zalewie automatycznego śmieciowego contentu jedyną rzeczą, która przetrwa próbę czasu, jest cyfrowe rzemiosło.

### Wynajęta ziemia: Iluzja bezpieczeństwa na cudzych platformach

Największym błędem współczesnych twórców, specjalistów i przedsiębiorców jest budowanie całej swojej obecności zawodowej wyłącznie na „wynajętej ziemi”.

Zakładasz profil na LinkedInie, Instagramie czy TikToku. Spędzasz lata, publikując darmową treść, zbierając obserwujących i polubienia. Masz poczucie, że budujesz majątek. Tymczasem prawda jest brutalna: jesteś tylko pańszczyźnianym chłopem na włościach cyfrowego feudała.

Wystarczy jedna zmiana algorytmu, jedna automatyczna blokada konta przez nadgorliwy skrypt moderacyjny albo zmiana polityki monetyzacji korporacji z Doliny Krzemowej, by Twoje zasięgi spadły o 90% z dnia na dzień. Nie posiadasz bazy kontaktów do swoich czytelników. Nie kontrolujesz wyglądu ani kodu platformy. Nie masz żadnych praw własności.

Budowanie marki wyłącznie na platformach społecznościowych to odpowiednik postawienia luksusowego domu na ruchomych piaskach, do których nie masz nawet aktu notarialnego.

### Własna strona WWW: Twój cyfrowy warsztat i twierdza

Posiadanie własnej domeny, własnego serwera i strony internetowej zbudowanej na solidnym fundamencie to nie jest archaizm z lat 90. To najwyższy akt cyfrowej suwerenności.

Kiedy wchodzisz na moją stronę, widzisz surową, minimalistyczną typografię, ciepły terakotowy akcent nawiązujący do cegły i obwodów drukowanych, brak migających pop-upów i ciasteczkowego terroru. Dlaczego? Ponieważ to jest mój dom. Sam decyduję, jak wygląda każdy piksel, jak szybko ładują się teksty i w jakiej atmosferze przyjmuję czytelnika.

Własny kawałek internetu daje Ci trzy fundamentalne przewagi:

#### 1. Odporność na kaprysy algorytmów (Platform Independence)
Twoja strona nie zależy od humoru Marka Zuckerberga czy Elona Muska. Adres URL w Twojej domenie (taki jak rafalwielgus.eu) jest Twoją własnością tak długo, jak opłacasz roczny abonament za domenę. Nikt nie może Ci go wyłączyć, nikt nie obetnie Ci zasięgów za karę i nikt nie wciśnie reklam kasyna pomiędzy Twoje artykuły.

#### 2. Sygnał rzetelności i warsztatu (Proof of Work)
Gdy kandydat do pracy lub specjalista wysyła link do profilu na LinkedInie, rekruter widzi to samo, co u stu innych kandydatów: standardowy niebieski nagłówek i listę stanowisk.
Kiedy jednak wysyłasz link do własnej strony — czysto zakodowanej, z autorskimi esejami, z udokumentowanymi projektami i interaktywnym portfolio — wysyłasz potężny sygnał rynkowy: „Ten człowiek potrafi doprowadzić projekt do końca. Dba o jakość. Nie boi się technologii. Ma własne zdanie”. To jest rzemieślniczy znak jakości (makers mark).

#### 3. Długowieczność treści (Esej zamiast ulotnego posta)
Post w mediach społecznościowych żyje średnio 24 godziny. Potem znika w bezdennej otchłani feedu i nikt już do niego nie wraca.
Artykuł opublikowany na własnym blogu, zoptymalizowany pod kątem logiki i wyszukiwarek, pracuje dla Ciebie przez pięć, dziesięć, a nawet piętnaście lat. Ludzie trafiają na niego z Google, polecają go sobie na forach, cytują w newsletterach. Budujesz kapitał intelektualny, który nie ulega natychmiastowej amortyzacji.

### Od rzemiosła do „Kodu Kariery”

To właśnie z tego przekonania zrodziła się koncepcja mojego kursu „Kod Kariery”.

Nie chcę uczyć ludzi, jak zostać kolejnym trybikiem w machinie generycznego content marketingu. Chcę uczyć ich rzemiosła: jak przeprowadzić uczciwą diagnozę własnych mocnych stron, jak przestać wstydzić się swojej nietypowej drogi zawodowej i jak własnoręcznie postawić w sieci wirtualną tożsamość — stronę, która będzie ich najlepszym, autonomicznym ambasadorem.

W świecie, który zachłysnął się automatyczną masówką, autentyczność, ręczna robota i szacunek dla detalu stają się najbardziej deficytowym, a przez to najdroższym towarem na rynku.

Nie bój się być rzemieślnikiem. Kup własną domenę, weź do ręki cyfrowe dłuto i zbuduj w sieci coś, pod czym bez wstydu podpiszesz się własnym nazwiskiem.`,
  },
];

let postsTableInitialized = false;

export async function ensurePostsTable() {
  if (postsTableInitialized) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT NULL,
        seoTitle VARCHAR(255) NULL,
        seoDescription TEXT NULL,
        thumbnailUrl VARCHAR(500) NULL,
        published BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        publishedAt TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const columns = [
      ['tags', 'TEXT NULL'],
      ['seoTitle', 'VARCHAR(255) NULL'],
      ['seoDescription', 'TEXT NULL'],
      ['thumbnailUrl', 'VARCHAR(500) NULL'],
    ];

    for (const [name, definition] of columns) {
      try {
        await db.query(`ALTER TABLE posts ADD COLUMN ${name} ${definition}`);
      } catch (error: unknown) {
        const errorCode = typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : undefined;
        if (errorCode !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }
    postsTableInitialized = true;
  } catch (err) {
    // If DB is unreachable (e.g. local dev without MySQL), don't crash
    console.warn('Database not available, using fallback posts repository:', err);
    postsTableInitialized = true;
  }
}

export async function getPublishedPosts(options?: {
  includeScheduled?: boolean;
  referenceDate?: Date;
}): Promise<Post[]> {
  const refDate = options?.referenceDate || new Date();
  const includeScheduled = options?.includeScheduled ?? false;

  try {
    await ensurePostsTable();
    const query = includeScheduled
      ? 'SELECT * FROM posts WHERE published = 1 ORDER BY createdAt DESC'
      : 'SELECT * FROM posts WHERE published = 1 AND createdAt <= ? ORDER BY createdAt DESC';
    const params = includeScheduled ? [] : [refDate.toISOString()];

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    if (rows && rows.length > 0) {
      return (rows as Post[]).map((p) => ({
        ...p,
        isScheduled: new Date(p.createdAt).getTime() > refDate.getTime(),
      }));
    }
  } catch {
    // Database unreachable, fallback below
  }

  const allFallback = FALLBACK_POSTS.map((p) => ({
    ...p,
    isScheduled: new Date(p.createdAt).getTime() > refDate.getTime(),
  }));

  if (includeScheduled) {
    return allFallback.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return allFallback
    .filter((p) => !p.isScheduled)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getAllPostsWithSchedule(referenceDate?: Date): Promise<Post[]> {
  return getPublishedPosts({ includeScheduled: true, referenceDate });
}

export async function getPostBySlug(
  slug: string,
  options?: { referenceDate?: Date }
): Promise<Post | null> {
  const refDate = options?.referenceDate || new Date();

  try {
    await ensurePostsTable();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM posts WHERE slug = ? LIMIT 1',
      [slug]
    );
    if (rows && rows.length > 0) {
      const p = rows[0] as Post;
      return {
        ...p,
        isScheduled: new Date(p.createdAt).getTime() > refDate.getTime(),
      };
    }
    const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
    if (!fallback) return null;
    return {
      ...fallback,
      isScheduled: new Date(fallback.createdAt).getTime() > refDate.getTime(),
    };
  } catch {
    const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
    if (!fallback) return null;
    return {
      ...fallback,
      isScheduled: new Date(fallback.createdAt).getTime() > refDate.getTime(),
    };
  }
}
