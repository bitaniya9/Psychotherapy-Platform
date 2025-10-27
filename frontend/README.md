# Melkam Frontend (prototype)

This folder contains a Next.js + TypeScript prototype wired to the existing backend.

What is included

- Next.js (pages router)
- TypeScript
- Tailwind CSS (configuration)
- react-hook-form for forms
- react-toastify for notifications
- lucide-react for icons
- react-calendar for calendar widgets (placeholder)
- axios-based `lib/api.ts` for backend integration

Environment

- Create a `.env.local` in `frontend/` with:

```
NEXT_PUBLIC_API_BASE=http://localhost:3000
```

Run locally

1. cd frontend
2. npm install
3. npm run dev

Notes

- This is a UI scaffold and example wiring. Replace the placeholder styles/components with actual shadcn components or extended UI from the Figma design.
- I wrapped Next pages with `BrowserRouter` so you can use `react-router-dom` as requested. You can also migrate to Next's router if desired.
