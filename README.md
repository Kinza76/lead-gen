# LeadGen+

## Quick start

1. Install dependencies (this auto-generates Prisma Client via `postinstall`):
   ```bash
   npm install
   ```
2. Copy env file and set secrets:
   ```bash
   cp .env.example .env
   ```
3. Create the local database schema:
   ```bash
   npx prisma db push
   ```
4. Start the app (forced to `127.0.0.1:3000`):
   ```bash
   npm run dev
   ```
5. Open:
   - http://127.0.0.1:3000
   - http://localhost:3000

## If localhost is refused

Run these checks in order:

```bash
npm install
npm run prisma:generate
npx prisma db push
npm run dev
```

If port 3000 is occupied, stop the conflicting process and re-run `npm run dev`.

## Prisma runtime fix

If you see:

`@prisma/client did not initialize yet. Please run "prisma generate" ...`

run:

```bash
npm run prisma:generate
```

Prisma Client generation runs automatically on `npm install` via `postinstall`.
