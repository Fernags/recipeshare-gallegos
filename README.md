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
| M3 submissions | Done. Required fields are checked and a submitted recipe appears on the live home page. |
| M4 filters | Done. Combined cuisine and category choices filter the cards. Clearing restores the list. |
| M5 ratings | Done. A submitted rating updates the average and count on the detail page and home card. |
| M6 persistence | Recipes and ratings are saved in Neon PostgreSQL. |
| M7 seed recipes | Done. Italian pizza and American pancakes have different cuisines and categories. |
| S1 Google sign-in, S2 author editing, S3 signed-in ratings, S4 image upload | Not done |
| S5 keyword search | Implemented. Matches title or ingredient alongside cuisine and category. |
| S6 sorting | Implemented. Newest first by default, or highest average rating with newer recipes first on ties. |
| Could: phone-friendly layout | Partly done. Responsive CSS added, awaiting device checks. |
