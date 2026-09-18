# rafalwielgus.eu — Platforma Autorska & Warsztat Twórcy

> **Oficjalny serwis, blog esejistyczny i katalog programów edukacyjnych Rafała Wielgusa.**  
> Przestrzeń łącząca praktyczną elektronikę, automatykę przemysłową w branży recyklingu, programowanie oraz psychologię w duchu idei **Long-Life Learning** (uczenia się przez całe życie).

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-CSS_4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Google Consent Mode v2](https://img.shields.io/badge/Consent_Mode-v2_RODO-green)](https://developers.google.com/tag-platform/security/guides/consent)

---

## 🧭 O Autorze i Filozofii Serwisu

Rafał Wielgus to **technik elektronik**, wieloletni praktyk automatyki przemysłowej i utrzymania ruchu maszyn w branży recyklingu, programista samouk oraz badacz procesów jakościowych i psychologii poznawczej.

Platforma powstała jako manifest przeciwko powierzchownej wiedzy i wąskiej specjalizacji. To cyfrowy warsztat, w którym twarda technika spotyka się z ludzką psychiką, procesami ciągłego doskonalenia (Kaizen / Lean) oraz odwagą do uczenia się przez całe życie.

---

## ⚡ Główne Moduły i Możliwości Systemu

### 1. 📝 Blog Esejistyczny & Trójstopniowy Cykl Publikacji
Artykuły na blogu publikowane są w regularnym cyklu z pełną kontrolą widoczności:
* **🟡 Szkic roboczy (`draft`):** Wpis całkowicie ukryty przed czytelnikami na stronie głównej i `/blog`. Dostępny wyłącznie w kokpicie administratora oraz przez dedykowany podgląd z tokenem bezpieczeństwa (`?preview=true`).
* **🟣 Zapowiedź (`scheduled`):** Artykuł oznaczony jako zaplanowany na wyznaczony dzień i godzinę w przyszłości. Na liście bloga pojawia się z wyróżnioną etykietą zapowiedzi i zegarem odliczającym.
* **🟢 Opublikowany (`published`):** Artykuł w pełni dostępny publicznie dla czytelników z estetycznym formatowaniem edytorialnym (Playfair Display + Inter).

### 2. ✍️ Markdown Studio w Kokpicie Administratora (`/admin`)
Wbudowane, nowoczesne środowisko edycji treści eliminujące konieczność dotykania kodu źródłowego:
* **Pasek narzędzi szybkiego formatowania (Toolbar):**
  * Nagłówki sekcji od `H1` do `H6` (`## `, `### `).
  * Pogrubienia (`**tekst**`), kursywy (`*tekst*`), kod liniowy (`` `kod` ``).
  * Listy punktowane (`•`) i numerowane (`1.`).
  * Cytaty edytorialne (`„” Cytat`).
  * **Dedykowane ramki warsztatowe:**
    * `💡 Lekcja z warsztatu` (`> 💡 **Lekcja z warsztatu:** ...`)
    * `⚠️ Uwaga techniczna` (`> ⚠️ **Uwaga techniczna:** ...`)
  * Bloki kodu wielolinijkowego z nagłówkiem języka (`plc`, `python`, `ts`).
  * Generowanie tabel Markdown i poziomych separatorów.
* **Panel Podpowiedzi & Gotowe Klocki Twórcy:**
  * Boczny panel z gotowymi szablonami do wstawienia jednym kliknięciem: *Wstęp z haczykiem*, *Lekcja z awarii*, *Tabela: Błąd vs Praktyk*, *Podsumowanie i konkluzja*.
* **Tryb Podziału na Żywo (Split View):**
  * Pisanie po lewej stronie z natychmiastowym podglądem sformatowanego artykułu po prawej.
  * Opcje widoku: *Tylko Edytor*, *Podział (Split)*, *Tylko Podgląd*.
* **Statystyki w czasie rzeczywistym:**
  * Licznik słów, znaków, akapitów i szacowany czas czytania (np. `~4 min`).
* **Zarządzanie parametrami SEO:**
  * Slug z generatorem z tytułu (polskie znaki &rarr; bezpieczny URL), meta opis, meta tytuł, miniaturka i tagi.

### 3. 💡 Inkubator Projektów & 📦 Katalog Produktów Cyfrowych (`/produkty`)
Dwustopniowy lejek R&D i sprzedaży produktów edukacyjnych:
* **Zakładka „Projekty (Szkice)”:** Wewnętrzny warsztat nowych pomysłów i szkiców programów (np. *Uprawnienia SEP G1*, *Czytanie i Projektowanie Schematów Elektrycznych*, *Programowanie Sterowników PLC*, *Kod Maszyny*). Projekty są niewidoczne w publicznym katalogu.
* **Przycisk „🚀 Uruchom Zapowiedź → Produkty”:** Jedno kliknięcie zmienia status na `Zapowiedź`, dynamicznie przenosząc kartę do zakładki Produktów i publikując ją na `/produkty` ze zbieraniem zapisów na listę startową.
* **Edycja produktów w panelu:** Bezpośrednia edycja nagłówków (`headline`), krótkich haseł (`tagline`), pełnych opisów, cen i statusów.
* **Możliwość cofnięcia do Projektów:** Przycisk `🔒 Cofnij do Projektów` natychmiast wycofuje produkt z widoku publicznego z powrotem do wersji roboczej.

### 4. 🛡️ Prywatność, RODO & Analityka (Google Consent Mode v2)
* Wdrożone Google Analytics 4 (`G-99SN2BETRJ`) w architekturze **Server Component**, eliminującej błędy hydracji i ostrzeżenia React 19.
* **Google Consent Mode v2:** Domyślna blokada śledzenia (`analytics_storage: 'denied'`, `ad_storage: 'denied'`) do momentu wyraźnej zgody użytkownika w banerze cookies.
* Pełna zgodność z RODO / UODO, anonimizacja IP oraz możliwość ponownego wywołania ustawień prywatności ze stopki strony.

### 5. 🗄️ Hybrydowa Odporność Danych (Dual-Storage Engine)
* System korzysta z bazy **MySQL (Hostinger)**, gdy jest osiągalna.
* **Automatyczny fallback plikowy:** W przypadku braku bazy (np. w środowisku lokalnym lub na Vercelu bez tunelu) system płynnie przełącza się na lokalne pliki JSON (`data/posts_override.json`, `data/custom_posts.json`, `data/products_override.json`).
* Wszystkie zmiany wprowadzone w panelu administratora są natychmiast utrwalane i spójne między widokiem publicznym a panelem admina.

---

## 🛠️ Stos Technologiczny

| Warstwa | Technologia | Zastosowanie |
|---|---|---|
| **Framework** | Next.js 16.3 (App Router) | Architektura hybrydowa SSR / RSC / Client Components |
| **UI & Logika** | React 19 | Najnowszy standard komponentów z obsługą bezpiecznego renderowania |
| **Stylizacja** | Tailwind CSS v4 | Nowoczesne utility-first CSS, responsywny design mobile-first |
| **Typowanie** | TypeScript 5 | Ścisła kontrola typów i interfejsów danych |
| **Silnik Markdown** | Własny komponent `MarkdownView` | Lekki, bezpieczny parser bez zewnętrznych zależności |
| **Baza danych** | MySQL2 / JSON Store | Hybrydowe przechowywanie danych produkcyjnych i lokalnych |
| **Newsletter** | Resend API | Zapisy na newsletter i listy oczekujących na kursy |
| **Hosting & CI/CD** | Vercel & GitHub | Automatyczny deployment po każdym pushu na gałąź `main` |

---

## 🚀 Jak Uruchomić Projekt Lokalnie

### 1. Wymagania wstępne
* Zainstalowane środowisko **Node.js** (rekomendowane v20+ lub v24+)
* Menedżer pakietów **npm**

### 2. Klonowanie i instalacja zależności
```bash
git clone https://github.com/Rafson83/rafalwielgusEU.git
cd rafalwielgusEU
npm install
```

### 3. Konfiguracja środowiska
Utwórz plik `.env.local` w katalogu głównym projektu:
```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-99SN2BETRJ"

# Autoryzacja administratora
ADMIN_PASSWORD_HASH="<twoj_hash_bcrypt>"
JWT_SECRET="<twoj_tajny_klucz_jwt>"

# Opcjonalne połączenie z MySQL (Hostinger)
DB_HOST="localhost"
DB_USER="twoj_uzytkownik"
DB_PASSWORD="twoje_haslo"
DB_NAME="twoja_baza"

# Newsletter (Resend)
RESEND_API_KEY="re_..."
```

### 4. Uruchomienie serwera deweloperskiego
```bash
npm run dev
```
Strona będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000).  
Panel administratora znajduje się pod: [http://localhost:3000/admin](http://localhost:3000/admin).

### 5. Kompilacja produkcyjna
```bash
npm run build
```

---

## 📁 Struktura Katalogów

```text
rafalwielgusEU/
├── data/                         # Pliki trwałości danych i nadpisań admina
│   ├── posts_override.json       # Zmiany statusów, tytułów i treści artykułów
│   ├── custom_posts.json         # Nowo utworzone artykuły z panelu
│   └── products_override.json    # Nadpisania statusów i opisów produktów
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # Kokpit administratora i ekran logowania
│   │   ├── api/                  # REST API (posts, products, auth, newsletter)
│   │   ├── blog/                 # Widok listy artykułów oraz pojedynczy wpis [slug]
│   │   ├── produkty/             # Publiczny katalog produktów cyfrowych
│   │   ├── o-mnie/               # Osobista historia i manifest Rafała Wielgusa
│   │   └── layout.tsx            # Główny layout z czcionkami i analityką
│   ├── components/               # Komponenty wielokrotnego użytku
│   │   ├── MarkdownView.tsx      # Bezpieczny renderer Markdown (H1-H6, kody, lekcje)
│   │   ├── Navbar.tsx            # Responsywne menu z drawerem hamburgera
│   │   ├── CookieBanner.tsx      # Baner cookies zgodny z RODO i Consent Mode v2
│   │   ├── GoogleAnalytics.tsx   # Serwerowa integracja GA4
│   │   └── NewsletterBox.tsx     # Formularz zapisu na newsletter
│   └── lib/                      # Moduły danych i logiki serwerowej
│       ├── posts.ts              # Domyślne wpisy esejistyczne (fallback)
│       ├── posts-server.ts       # Zarządzanie postami w panelu admina (CRUD)
│       ├── products.ts           # Baza kursów i programów edukacyjnych
│       └── products-server.ts    # Pipeline projektów i produktów
└── public/                       # Zasoby statyczne (obrazy, ikony, manifest)
```

---

## 📄 Licencja

Projekt autorski &copy; Rafał Wielgus. Wszelkie prawa zastrzeżone.
