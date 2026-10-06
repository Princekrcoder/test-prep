# TestPrep

A secure, scalable mock-test preparation platform for placement and competitive exams.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | Neon PostgreSQL |
| Auth | Google OAuth + JWT HttpOnly cookies |
| Hosting | Vercel (frontend) + Render (backend) |

## Project Structure

```
testprep/
├─ frontend/     # Next.js 14 App Router → deploys to Vercel
├─ backend/      # Express + Prisma → deploys to Render
└─ shared/       # Zod schemas + TypeScript types (no runtime deps)
```

## Getting Started

### Prerequisites
- Node.js 20+
- A Neon PostgreSQL database

### 1. Install dependencies

```bash
cd shared && npm install && npm run build
cd ../backend && npm install
cd ../frontend && npm install
```

### 2. Set up environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in your values in backend/.env

# Frontend  
cp frontend/.env.example frontend/.env.local
# Fill in your values in frontend/.env.local
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Start development servers

```bash
# From root -- starts both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Deployment

- **Frontend**: Connect `frontend/` folder to Vercel. Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
- **Backend**: Connect `backend/` folder to Render. Use `render.yaml` config. Set all env vars in Render dashboard.

## Security Notes

- Answer keys (`isCorrect`, `explanationMd`) are **never** sent to the client during an active attempt
- Scores are computed server-side only -- client-submitted scores are ignored
- All tokens stored in HttpOnly cookies -- never localStorage
- Every attempt route verifies ownership before responding
