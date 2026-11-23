# RecipeShare
Build the recipe-sharing website described in docs/spec.md, the source of truth for fields, fixed lists and acceptance criteria. Follow docs/plan.md in order.
Use Next.js App Router, JavaScript, Neon PostgreSQL and Vercel Hobby. Run npm install, npm run dev, npm test and npm run build from the project root.
Keep database reads and writes on the server. Use parameterized SQL, validate form inputs on the server, and read credentials from environment variables. Never commit secrets. Document variable names without values in .env.example.
Keep changes small. Check each working feature in the browser, add its regression test, run the suite and commit. Review deployment and update the README checklist before marking a feature done.
