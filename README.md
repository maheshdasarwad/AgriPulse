# AgriSmart Assistant

An AI-powered farming assistant with three tools:
- **Crop Advisor** — detailed growing plans for any crop
- **Crop Health Scanner** — analyze crop photos for diseases
- **Financial Planner** — budget and financial planning for your farm

Supports English and Marathi.

---

## Requirements

- Python 3.9+
- Node.js 18+ and npm

---

## Setup

### 1. Get a Google API Key

Go to https://aistudio.google.com/apikey and create a free API key for Gemini.

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Linux / Mac
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Open .env and paste your Google API key
```

Edit `.env`:
```
GOOGLE_API_KEY=your_key_here
PORT=8000
```

Start the backend:
```bash
uvicorn main:app --reload
```

The API will be running at http://localhost:8000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at http://localhost:5173

---

## How it works

- Frontend (React + Vite + Tailwind) runs at **localhost:5173**
- Backend (Python FastAPI) runs at **localhost:8000**
- The frontend proxies all `/api` requests to the backend automatically

---

## Build for production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder you can serve with any static file server.
