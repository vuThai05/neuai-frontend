# How to Run the Frontend Locally
## 1. Create file .env.local
```
# Local development
NEXT_PUBLIC_API_URL=http://localhost:8000
```
## 2. Run local
```
npm install
npm run dev
```

# How to Run the Backend Locally (Python)

## 1. Create file .env
```
# MongoDB Connection String
MONGODB_URI=YOUR_MONGODB_URI
MONGODB_DB=YOUR_MONGODB_DB

# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Frontend URL for CORS (Next.js dev server)
FRONTEND_URL=http://localhost:3000
```

## 2. Create the Python Virtual Environment
### macOS / Linux
```
python3 -m venv .venv
```
### Windows (PowerShell)
```
python -m venv .venv
```

## 3. Create the Python Virtual Environment
### macOS / Linux
```
source .venv/bin/activate
```
### Windows (PowerShell)
```
.\.venv\Scripts\activate
```

## 4. Install requirements.txt and run local
```
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### NOTE: Take essential info of file .env in pinned messages of NCKHSV 2026
