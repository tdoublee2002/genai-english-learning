# Frontend

Next.js UI for the vocabulary learning app.

## Prerequisites
- Node.js 20+
- npm
- Running backend API (default: `http://localhost:8000`)

## Run Local
1. Go to the frontend folder
```bash
cd frontend
```

2. Create `frontend/.env.local`
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

3. Install dependencies
```bash
npm install
```

4. Start dev server
```bash
npm run dev
```

Open `http://localhost:3000`
