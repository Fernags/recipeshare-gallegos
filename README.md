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
| S1 Google sign-in | Done. Google sign-in, sign-out, automatic author name and personal recipe listing verified in production. |
| S2 author editing | Done. Owners can edit and delete. Verified owner editing and blocked editing of another recipe in production. Database tests cover deletion. |
| S3 signed-in ratings | Done. Verified replacement votes keep the same count. Guest voting and self-ratings are blocked. |
| S4 image upload | Implemented. Upload a JPEG, PNG or WebP (up to 3 MB) or enter an image link. Uploaded photos persist in Neon. |
| Could: servings scaler | Implemented. Change servings on a detail page to scale ingredient quantities. Recipes created before this feature start at four servings. |
| S5 keyword search | Implemented. Matches title or ingredient alongside cuisine and category. |
| S6 sorting | Implemented. Newest first by default, or highest average rating with newer recipes first on ties. |
| Could: phone-friendly layout | Partly done. Responsive CSS added, awaiting device checks. |

## Google sign-in setup
The production web client ID is public. Set GOOGLE_CLIENT_ID to override it for a separate deployment. Register the production origin and its /api/auth/google redirect URI. For local testing, also register http://localhost:3000 and http://localhost:3000/api/auth/google. Google verifies the user's identity and the server verifies the signed credential. Existing anonymous recipes retain their original attribution and votes.
