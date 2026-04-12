# Bemata — test animacije meni knjige

Izolovani mini-projekat (ne dira `index.html` / glavni sajt).

## Pokretanje

```bash
cd menu-book-demo
npm install
npm run dev
```

Otvori URL koji Vite ispiše (npr. `http://localhost:5173`).

## Slike unutar knjige

PNG-ovi su u `public/menu/01.png` … `11.png` (kopirani iz Cursor assets-a), redosled kao u tvom briefu:

| Fajl | Sadržaj |
|------|---------|
| 01 | Alkoholna pića |
| 02 | Poslastice i torte |
| 03 | Predjela, prilozi, supe, potaži i sendviči |
| 04 | Kafe i Bemata specijaliteti |
| 05 | Čajevi |
| 06 | Naslovnica (Bemata) |
| 07 | Doručak |
| 08 | Glavna jela |
| 09 | Veganska / vegetarijanska jela |
| 10 | Obrok salate |
| 11 | Pića |

Na demo stranici **Nazad / Napred** menja dvostrani spread; poslednji spread je str. 11 + prazna desna strana.

Da zameniš slike, zameni fajlove u `public/menu/` (zadrži imena `01.png` … `11.png`) ili promeni `MENU_PAGE_LABELS` / URL logiku u `MenuBookDemo.tsx`.

## Produkcijski build

```bash
npm run build
npm run preview
```
