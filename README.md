# Neovlašteni fitness instruktor

Anti-anksiozna fitness PWA. Bez pritiska teretane, bez bildanja egoa.

> **Dvostruki ton — strogo razdvojen**
>
> - **UI / navigacija / motivacija:** opušten, empatičan, ironičan, buntovnički.
> - **Upute za vježbe:** kineziološki precizni, klinički točni. **Bez šale.**
>
> Copy se NIKADA ne miješa. Ironija ne ulazi u upute.

## Tech stack

| Sloj           | Tehnologija                                          |
| -------------- | ---------------------------------------------------- |
| Frontend / PWA | Next.js 14 (App Router) + React 18 + Tailwind CSS    |
| Animacije      | Lottie (3D, neutralni modeli — placeholder za sada)  |
| Backend        | FastAPI (Python 3.11+)                               |
| ORM            | SQLAlchemy 2.0                                       |
| Baza           | PostgreSQL                                           |
| AI             | OpenAI API (Smart Fridge generator recepata)         |

## Dizajn sustav (Stealth)

- **Tema:** isključivo dark mode.
- **Pozadina:** Charcoal `#1A1A1A` / `#222222` / `#2B2B2B`.
- **Akcent A (pozitiv):** prigušeni mint `#7CE3B7`.
- **Akcent B (smiraj):** prigušeni violet `#8A6FD9`.
- **Zabranjeno:** agresivna crvena, neonske eksplozije, bildani vizuali.

Boje su definirane u [`frontend/tailwind.config.ts`](./frontend/tailwind.config.ts).

## Struktura repozitorija

```
neovlasetniclaude/
├── frontend/                          # Next.js 14 PWA
│   ├── public/
│   │   ├── manifest.webmanifest       # PWA manifest
│   │   └── lottie/                    # 3D Lottie placeholderi
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── layout.tsx             # Dark shell, mobile-first
│   │   │   ├── page.tsx               # Home (3 ulaza)
│   │   │   ├── check-in/page.tsx      # Dnevni Check-in
│   │   │   ├── training/page.tsx      # SafeSpace Trening
│   │   │   └── fridge/page.tsx        # Pametni Hladnjak
│   │   ├── components/
│   │   │   ├── check-in/              # EnergySlider, MoodCard, DailyCheckIn
│   │   │   ├── training/              # (uskoro)
│   │   │   ├── fridge/                # (uskoro)
│   │   │   └── ui/                    # zajednički UI primitivi
│   │   ├── data/
│   │   │   └── moodCopy.ts            # "Neovlašteni" copy — UI ton
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── cn.ts                  # className helper
│   │   └── styles/
│   │       └── globals.css            # Tailwind + custom slider
│   ├── next.config.mjs                # /api/* proxy → FastAPI
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                           # FastAPI
    ├── app/
    │   ├── main.py                    # FastAPI app + CORS + routeri
    │   ├── core/config.py             # Settings (pydantic-settings)
    │   ├── db/session.py              # SQLAlchemy engine + Base + get_db
    │   ├── models/check_in.py         # ORM model
    │   ├── schemas/                   # Pydantic schemas
    │   │   ├── check_in.py
    │   │   └── fridge.py
    │   ├── services/
    │   │   ├── recommendations.py     # energy → workout track
    │   │   └── fridge.py              # OpenAI recipe generator
    │   └── api/routes/
    │       ├── check_in.py            # POST /api/check-in
    │       └── fridge.py              # POST /api/fridge/recipe
    ├── tests/
    ├── requirements.txt
    └── .env.example
```

## Pokretanje (lokalno)

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env # popuni OPENAI_API_KEY i DATABASE_URL
uvicorn app.main:app --reload --port 8000
```

`/api/*` u Next.js-u proxa na FastAPI (vidi `frontend/next.config.mjs`).

## Status MVP-a

- [x] Dizajn sustav (dark, mint/violet)
- [x] Dnevni Check-in (slider 1–5 + "Neovlašteni" odgovor)
- [x] Backend skeleton + `POST /api/check-in`
- [x] Smart Fridge servis (OpenAI prompt)
- [ ] SafeSpace Trening ekran (Lottie + "Gužva je" alternativa)
- [ ] Smart Fridge frontend ekran
- [ ] PostgreSQL migracije (Alembic)
- [ ] Service worker + offline shell
