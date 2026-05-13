# Convex Backend Setup

## Initialize

```bash
npx convex dev
```

This will:
1. Prompt you to create a Convex account / log in
2. Create a deployment
3. Generate `convex/_generated/` types
4. Give you a `VITE_CONVEX_URL` value

## Seed Data

After Convex is running, visit:
```
http://localhost:5173/dev/seed
```
Or run the seed mutation from the Convex dashboard.

## Deploy

```bash
npx convex deploy
```
