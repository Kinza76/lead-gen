# LeadGen+

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file and set secrets:
   ```bash
   cp .env.example .env
   ```
3. Create/update local database schema:
   ```bash
   npx prisma db push
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

`npm run dev` now always runs `prisma generate` first via `predev`.

## Fix for `@prisma/client did not initialize yet`

Run the exact sequence below:

```bash
git pull --rebase
npm install
npm run clean
# clean is cross-platform (Windows/macOS/Linux)
npm run prisma:generate
npx prisma db push
npm run dev
```

Then open:
- http://127.0.0.1:3000
- http://localhost:3000

## Why this works

- `predev`, `prebuild`, and `prestart` force Prisma Client generation before Next.js executes routes.
- `clean` removes stale `.next` output so old compiled files (that still reference `new PrismaClient(...)` at import time) cannot keep crashing runtime.


If the stack trace still points to `export const prisma = globalForPrisma.prisma ?? new PrismaClient(...)`, your local branch is running older code. Pull latest commits, then run the recovery sequence above.
