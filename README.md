# ⚡ Generator Haseł - Desktop Flashcard Password Generator

Nowoczesna aplikacja desktopowa w formie **interaktywnych fiszek 3D (Flashcards)** służąca do generowania silnych, bezpiecznych haseł o **dowolnej długości**.

Projekt stworzony w ramach przedmiotu **Projektowanie aplikacji mobilnych i desktopowych (mobdesk)**.

---

## 🌟 Główne Funkcjonalności

1. **Generowanie haseł o dowolnej długości:**
   - Płynny suwak długości (od 4 do 64 znaków) z natychmiastowym podglądem.
   - Bezpośrednie pole numeryczne pozwalające wpisać **DOWOLNĄ długość** (np. `128`, `256`, `500+` znaków bez ograniczeń).
   - Szybkie przyciski presetów: `8`, `12`, `16 (Standard)`, `24 (Mocne)`, `32`, `64`, `128 (Ultra)`.

2. **Interaktywne Fiszki 3D (Flashcard UI):**
   - **Przód fiszki:**
     - Dynamiczne kolorowanie składni znaków (wielkie litery, małe litery, cyfry, symbole specjalne).
     - Wskaźnik siły hasła i estymacja czasu łamania metodą brute-force (od ułamków sekund po biliony lat).
     - Obliczanie entropii w bitach według standardu NIST/Shannon.
     - Szybkie kopiowanie do schowka jednym kliknięciem (`📋`).
     - Dodawanie do ulubionych (`★`).
   - **Tył fiszki (Obrót 3D):**
     - **Pisownia fonetyczna (Alfabet NATO):** ułatwia odczytanie hasła przez telefon lub bezwzrokowe zapamiętanie (np. `A` - Alpha, `b` - brawo, `9` - Dziewięć, `!` - Wykrzyknik).
     - **Autonomiczny kod QR (SVG):** wygenerowany offline bez połączenia z siecią, pozwalający natychmiast przenieść hasło na smartfon za pomocą aparatu.
     - **Skrót kryptograficzny SHA-256:** do weryfikacji integralności.

3. **Cztery Zaawansowane Tryby Generowania:**
   - 🎲 **Losowe (Kryptograficzne):** losowane za pomocą bezpiecznego generatora `crypto.getRandomValues()`.
   - 📚 **Fraza (Diceware):** łatwe do zapamiętania zdania z puli słów (np. `Bursztyn-Radar-Fala-42`).
   - 🗣️ **Wymowne (Sylaby):** pseudonaturalne hasła o strukturze spółgłoska-samogłoska, łatwe do wymówienia.
   - 🔢 **PIN:** wyłącznie cyfry o dowolnej długości (4, 6, 8, 16 cyfr).

4. **Talia Wygenerowanych Kart (Historia & Eksport):**
   - Historia wygenerowanych haseł w bieżącej sesji.
   - Możliwość kliknięcia dowolnej miniatury, aby przywrócić ją na główną fiszkę.
   - Eksport całej talii do formatu TXT lub skopiowanie zestawienia do schowka.

5. **Efekty Dźwiękowe & Personalizacja:**
   - Syntetyzowane dźwięki rozdawania kart, obrotu fiszki i kopiowania generowane przez Web Audio API (brak zewnętrznych plików audio, działa 100% offline).
   - Przełącznik motywów wizualnych: **Cyber Dark** (neon/obsydian), **Świetlisty (Light)**, **Matrix Emerald**.
   - Przełącznik języka: **Polski / Angielski**.
   - **Skróty klawiszowe:**
     - <kbd>Spacja</kbd> lub <kbd>Enter</kbd> = Nowe hasło
     - <kbd>F</kbd> = Obrót fiszki
     - <kbd>C</kbd> = Kopiuj hasło do schowka

---

## 🚀 Jak Uruchomić

### Sposób 1: Uruchomienie jako natywna aplikacja desktopowa (Electron)
W folderze projektu wpisz w terminalu:
```bash
npm start
```
*lub po prostu dwukrotnie kliknij plik `start.bat`.*

### Sposób 2: Bezpośrednie otwarcie w przeglądarce
Aplikacja została zaprojektowana w architekturze Zero-Dependency – możesz po prostu dwukrotnie kliknąć plik `index.html` lub otworzyć go w dowolnej przeglądarce (Google Chrome, Microsoft Edge, Firefox, Brave) bez konieczności uruchamiania serwera.

---

## 📁 Struktura Projektu

- `main.js` – Główny proces okna desktopowego Electron.
- `index.html` – Struktura semantyczna interfejsu fiszek i kontrolek.
- `styles.css` – Arkusz stylów Vanilla CSS z perspektywą 3D, glassmorphismem i motywami.
- `app.js` – Główny kontroler aplikacji, obsługa zdarzeń i talii fiszek.
- `generator.js` – Silnik generowania haseł, analiza entropii i słowniki.
- `sound.js` – Silnik dźwiękowy Web Audio API.
- `qrcode.js` – Wektorowy generator kodów QR offline.
- `start.bat` – Skrót uruchamiający aplikację jednym kliknięciem.
- `assets/` – Ikony i grafika aplikacji.

