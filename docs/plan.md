# RecipeShare build plan
| Step | Files | Test to add | Browser or deployment check |
|---|---|---|---|
| 1. Browse sample recipes (M1) | app/page.js, app/layout.js, app/style.css, lib/recipes.mjs | Check card fields for each seed | Open home and inspect each photo, title, cuisine, category and rating. |
| 2. Open recipe details (M2) | app/recipes/[id]/page.js | Look up a known and missing ID | Click a card and verify author, ingredients, steps, minutes and image. |
| 3. Add recipes (M3) | app/new/page.js, app/actions.js, lib/recipes.mjs | Reject blank fields and invalid choices | Submit once with a missing title, then complete it and find the new card. |
| 4. Filter recipes (M4) | app/page.js, lib/recipes.mjs | Combine both selections and clear them | Select Iranian and Main Dish, try an empty intersection, then clear. |
| 5. Deploy early | package.json, README.md | Run tests and production build | Import the repository on Vercel Hobby and open the public page. |
| 6. Persist and seed (M6, M7) | lib/store.mjs, db/schema.sql, .env.example | Check seed IDs remain unique after rerunning setup | Connect Neon, add a recipe and reopen on another device after redeployment. |
| 7. Rate recipes (M5) | app/actions.js, recipe detail and home pages | Check a 1 and a 5 average to 3 with count 2 | Submit a rating and check both views. |
| 8. Finish engineering checks | .github/workflows/ci.yml, README.md | Run the suite and build in Actions | Check green main, live URL, run instructions and feature checklist. |
