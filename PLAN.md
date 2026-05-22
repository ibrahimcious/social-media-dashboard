# Social Media Content Planner — Project Plan

## Decisions

| Decision | Choice |
|---|---|
| Type | Web app, team access via shared password |
| Framework | TanStack Start |
| Database | Turso (serverless SQLite) + Prisma v7 |
| Auth | Single shared password via env var + TanStack session cookie |
| Styling | Tailwind CSS + shadcn/ui, minimal/clean + dark mode toggle |
| Views | Table + Calendar |
| Filtering | Platform, Status, Date range + column sort |
| Reminders | Visual only — color-coded rows (red = overdue, yellow = due within 3 days) |
| Add/Edit/Delete | Modal/Drawer (Sheet) |
| Deployment | Vercel |

---

## Columns

| Column | Type | Options |
|---|---|---|
| Publish Date | Date | — |
| Platform | Multi-select | Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Facebook |
| Title / Idea | Short text | — |
| Format | Select | Reel, Carousel, Static Post, Story, Thread, Short, Video |
| Content Pillar | Select | Educational, Inspirational, Promotional, Behind the Scenes, Entertainment |
| Caption Draft | Long text | — |
| CTA | Select | Follow, Link in Bio, Comment, Share, DM, Visit Website |
| Asset Link | URL | — |
| Status | Select | Idea → In Progress → Review → Scheduled → Published |
| Priority | Select | Low, Medium, High |

Options/labels live in `src/lib/constants.ts`.

---

## Project Structure

```
social-media-dashboard/
├── prisma/
│   ├── schema.prisma          # ContentItem model (sqlite provider)
│   └── seed.ts                # 3 sample items for local dev
├── prisma.config.ts           # Prisma v7 config (datasource URL for migrations)
├── src/
│   ├── db.ts                  # PrismaClient with PrismaLibSql adapter
│   ├── types.ts               # Shared ContentItem TypeScript type
│   ├── router.tsx             # TanStack Router setup
│   ├── lib/
│   │   ├── constants.ts       # Platform/Format/Status/Priority option lists + color maps
│   │   ├── session.ts         # TanStack Start session helper (useSession wrapper)
│   │   └── utils.ts           # shadcn cn() utility
│   ├── functions/
│   │   ├── auth.ts            # loginFn, logoutFn, getAuthFn server functions
│   │   └── content.ts         # getItemsFn, createItemFn, updateItemFn, deleteItemFn
│   ├── components/
│   │   ├── ContentDrawer.tsx  # Add/Edit/Delete side drawer (Sheet)
│   │   ├── FilterBar.tsx      # Platform + Status + Date range filters
│   │   └── ui/                # shadcn/ui primitives
│   ├── routes/
│   │   ├── __root.tsx         # HTML shell + dark mode flash prevention
│   │   ├── index.tsx          # Redirects / → /dashboard
│   │   ├── login.tsx          # Password gate page
│   │   ├── dashboard.tsx      # Layout: header, nav tabs, dark mode toggle, logout
│   │   └── dashboard/
│   │       ├── index.tsx      # Table view (TanStack Table)
│   │       └── calendar.tsx   # Calendar view (react-big-calendar)
│   └── styles.css             # Tailwind + shadcn CSS vars + dark mode overrides for calendar
├── .env.local                 # Local dev secrets (git-ignored)
├── .env.local.example         # Template for new devs
└── vercel.json                # Vercel deployment config
```

---

## Stack

| Layer | Package |
|---|---|
| Framework | `@tanstack/react-start` (latest) |
| Routing | `@tanstack/react-router` (latest) |
| Table | `@tanstack/react-table` (latest) |
| Database ORM | `prisma` v7 + `@prisma/adapter-libsql` |
| DB client | `@libsql/client` (Turso/libSQL) |
| UI components | `shadcn/ui` (Tailwind + Radix) |
| Calendar | `react-big-calendar` + `date-fns` localizer |
| Validation | `zod` |
| Styling | `tailwindcss` v4 |

---

## Environment Variables

```bash
# .env.local (local dev)
DASHBOARD_PASSWORD=team123
TURSO_DATABASE_URL=file:./dev.db         # local: file path | prod: libsql://...turso.io
SESSION_SECRET=at-least-32-chars-secret!!
TURSO_AUTH_TOKEN=                         # only needed for remote Turso
```

For Vercel, set all four in the dashboard (no `file:` URL — use real Turso credentials).

---

## NPM Scripts

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Sync schema → database (no migration file)
npm run db:migrate   # Create and apply a migration file
npm run db:seed      # Seed 3 sample content items
npm run db:studio    # Open Prisma Studio
```

---

## Completed

- [x] Phase 1 — TanStack Start scaffold + Turso/libSQL swap + Prisma v7 config
- [x] Phase 2 — All dependencies installed (react-big-calendar, zod, shadcn components)
- [x] Phase 3 — Auth: login page, shared password, TanStack session cookie, route guards
- [x] Phase 4 — Server functions: getItems (with filters), createItem, updateItem, deleteItem
- [x] Phase 5 — Table view: TanStack Table, FilterBar, color-coded rows, ContentDrawer
- [x] Phase 6 — Calendar view: react-big-calendar, status-colored events, click to add/edit
- [x] Phase 7 — Layout: header, nav tabs (Table / Calendar), dark mode toggle
- [x] Phase 8 — Deployment config: `.env.local.example`, `vercel.json`
- [x] Local SQLite seeded with 3 sample items
- [x] Zero TypeScript errors

---

## Remaining / Nice-to-have

- [ ] **Toast notifications** — success/error feedback after save/delete (add `sonner` package, it's shadcn-compatible)
- [ ] **Loading states** — skeleton rows in table while fetching after filter change
- [ ] **Bulk status update** — checkbox column + "Mark as Published" batch action
- [ ] **Export to CSV** — download table as spreadsheet
- [ ] **Content count by platform** — small stat cards above the table
- [ ] **Mobile layout** — table scrolls horizontally on small screens (mostly works, but drawer could use responsive tweaks)
- [ ] **Vercel deployment** — provision Turso DB, set env vars, `git push`

---

## Deploying to Vercel

1. Create a Turso database:
   ```bash
   turso db create content-planner
   turso db show content-planner --url      # → TURSO_DATABASE_URL
   turso db tokens create content-planner   # → TURSO_AUTH_TOKEN
   ```

2. Push schema to Turso:
   ```bash
   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run db:push
   ```

3. Set env vars in Vercel dashboard:
   - `DASHBOARD_PASSWORD`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `SESSION_SECRET` (32+ random chars)

4. `git push` → Vercel auto-deploys.
