# AgriSmart Assistant

An AI-powered farming assistant with three tools:

- **Crop Advisor** — detailed growing plans for any crop  
- **Crop Health Scanner** — analyze crop photos for diseases  
- **Financial Planner** — budget and financial planning for your farm  

Supports **English** and **Marathi**.

---

## Project Structure

```text
AgriPulse/
├── README.md
├── backend/
│   ├── .gitignore
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── crop_advisor.py
│   │   ├── financial_planner.py
│   │   ├── health.py
│   │   └── image_analyzer.py
│   └── services/
│       ├── __init__.py
│       ├── crop_advisor.py
│       ├── financial_planner.py
│       └── image_analyzer.py
└── frontend/
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── api/
        │   └── client.ts
        ├── components/
        │   ├── MarkdownRenderer.tsx
        │   ├── layout/
        │   │   └── Header.tsx
        │   ├── tabs/
        │   │   ├── CropAdvisorTab.tsx
        │   │   ├── FinancialPlannerTab.tsx
        │   │   └── ImageScannerTab.tsx
        │   └── ui/
        │       ├── alert.tsx
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── select.tsx
        │       ├── tabs.tsx
        │       ├── toast.tsx
        │       ├── toaster.tsx
        │       ├── toggle.tsx
        │       ├── toggle-group.tsx
        │       └── tooltip.tsx
        ├── contexts/
        │   └── LanguageContext.tsx
        ├── hooks/
        │   └── use-toast.ts
        ├── lib/
        │   └── utils.ts
        └── pages/
            ├── Home.tsx
            └── not-found.tsx
```

---

## Requirements

- Python 3.9+
- Node.js 18+
- npm

---

## Setup

### 1. Get a Google API Key

Go to: https://aistudio.google.com/apikey

Create a free Gemini API key.

---

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Linux / Mac
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
```

Edit `.env`

```env
GOOGLE_API_KEY=your_key_here
PORT=8000
```

Start backend:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## How It Works

- **Frontend:** React + Vite + Tailwind  
- **Backend:** FastAPI + Python  
- Frontend automatically proxies `/api` requests to backend.

---

## Build for Production

```bash
cd frontend
npm run build
```

Creates:

```text
dist/
```

You can deploy that folder using Netlify, Vercel, Nginx, Apache, etc.
