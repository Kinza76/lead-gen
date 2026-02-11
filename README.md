# LeadGen+

## Quick start

1. Install dependencies (this now auto-generates Prisma Client via `postinstall`):
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
4. Start the app:
   ```bash
   npm run dev
   ```

## Prisma runtime fix

If you ever see:

`@prisma/client did not initialize yet. Please run "prisma generate" ...`

run:

```bash
npm run prisma:generate
```

This repo also runs `prisma generate` automatically on `npm install`, `npm run dev`, and `npm run build`.
