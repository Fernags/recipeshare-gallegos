# RecipeShare
Browse recipes by cuisine and category, share a recipe and rate dishes from one to five stars. Built with Next.js, React and Neon PostgreSQL for ECE 35400.

## Run locally
Use Node.js 22 and npm. Run `npm install`. Copy `.env.example` to `.env.local` and set DATABASE_URL to your Neon connection string. Run `npm run dev` and open http://localhost:3000. Run `npm test` for the unit suite or `npm run build` for a production build.

The server creates the recipes table and inserts two samples on its first database request. With no database configured, the sample recipes are available for browsing.

## Deployment
Import this repository on Vercel Hobby, set DATABASE_URL in the project environment and deploy main. Live app: https://recipeshare-gallegos.vercel.app

## Feature checklist
| Feature | Status |
|---|---|
| M1 browsing, M2 details | Done. Recipe cards and the detail view checked in production. |
| M3 submissions, M4 filters, M5 ratings, M6 persistence, M7 seed recipes | Partly done. The production homepage shows both samples and the empty filter result works. Database-backed checks are pending. |
| S1 Google sign-in, S2 author editing, S3 signed-in ratings, S4 image upload, S5 keyword search, S6 sorting | Not done |
| Could: phone-friendly layout | Partly done. Responsive CSS added, awaiting device checks. |
