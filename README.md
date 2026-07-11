# rafalwielgus.eu - Personal Blog & Portfolio

[Wersja polska poniżej](#pl---wersja-polska)

This is a personal blog and portfolio project built with **Next.js** and **Prisma**. It features a modern, clean design to share thoughts on business, psychology, programming, electronics, and management.

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma (v7)
- **Database**: SQLite (Local development) / MySQL (Hostinger production)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Rafson83/rafalwielgusEU.git
   cd rafalwielgusEU
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Sync the database schema:
   ```bash
   npx prisma db push
   ```

### Development Server
Run the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## PL - Wersja polska

Osobisty blog oraz portfolio oparte na technologii **Next.js** i **Prisma**. Nowoczesna, czysta przestrzeń do dzielenia się przemyśleniami z zakresu biznesu, psychologii, programowania, elektroniki i zarządzania.

## Stos Technologiczny
- **Framework**: Next.js (App Router, TypeScript)
- **Stylizacja**: Tailwind CSS
- **ORM**: Prisma (v7)
- **Baza danych**: SQLite (Lokalnie w procesie deweloperskim) / MySQL (Produkcja na Hostingerze)

## Jak zacząć

### Wymagania wstępne
Upewnij się, że masz zainstalowane środowisko [Node.js](https://nodejs.org/).

### Instalacja
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/Rafson83/rafalwielgusEU.git
   cd rafalwielgusEU
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Skonfiguruj zmienne środowiskowe, tworząc plik `.env` w głównym katalogu projektu:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Zsynchronizuj schemat bazy danych:
   ```bash
   npx prisma db push
   ```

### Serwer deweloperski
Uruchom serwer lokalnie:
```bash
npm run dev
```
Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, aby zobaczyć stronę.
