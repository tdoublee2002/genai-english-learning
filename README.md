# genai-english-learning

Internal POC for learning English vocabulary with a Next.js App Router frontend + Python backend.

## Frontend (Next.js)

### Prerequisites
- Node.js 20+
- npm

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the backend URL:
   ```bash
   export NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```
   If not set, the app defaults to `http://localhost:8000`.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Backend
See the backend setup guide in `backend/README.md`.
