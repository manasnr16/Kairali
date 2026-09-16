# Kairali Match Makers

A matrimony platform, split into two independent projects:

```
.
├── frontend/   React + Vite + Tailwind client (see frontend/README.md)
└── backend/    Express + MongoDB API (see backend/README.md)
```

## Quick start

```bash
# Backend — runs on http://localhost:3000
cd backend
npm install
npm run dev

# Frontend — runs on http://localhost:5173 (in a separate terminal)
cd frontend
npm install
npm run dev
```

Each folder has its own `package.json`, `node_modules`, and `.env` — install and run them independently. See each folder's own README for setup details (required environment variables, etc).
