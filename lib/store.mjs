import { neon } from '@neondatabase/serverless';
import { recipes } from './recipes.mjs';

function store() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}
let initialized;
export async function database() {
  const sql = store();
  if (!sql) return null;
  initialized ??= sql.transaction([
    sql`CREATE TABLE IF NOT EXISTS recipes (id text PRIMARY KEY, body jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS recipe_photos (id text PRIMARY KEY REFERENCES recipes(id), jpeg text NOT NULL)`,
    sql`CREATE TABLE IF NOT EXISTS recipe_sessions (token_hash text PRIMARY KEY, subject text NOT NULL, name text NOT NULL, expires_at timestamptz NOT NULL)`,
    sql`CREATE TABLE IF NOT EXISTS recipe_votes (recipe_id text REFERENCES recipes(id) ON DELETE CASCADE,
      subject text NOT NULL, stars integer NOT NULL CHECK (stars BETWEEN 1 AND 5), PRIMARY KEY (recipe_id, subject))`,
    sql`CREATE OR REPLACE VIEW recipes_with_ratings AS SELECT r.id, r.created_at,
      jsonb_set(r.body, '{ratings}', COALESCE(r.body->'ratings', '[]'::jsonb) ||
        COALESCE((SELECT jsonb_agg(v.stars) FROM recipe_votes v WHERE v.recipe_id = r.id), '[]'::jsonb)) AS body
      FROM recipes r`,
    ...recipes.map(recipe => sql`INSERT INTO recipes (id, body) VALUES (${recipe.id}, ${JSON.stringify(recipe)}::jsonb) ON CONFLICT DO NOTHING`)
  ]).catch(error => { initialized = undefined; throw error; });
  await initialized;
  return sql;
}
export async function listRecipes() {
  const sql = await database();
  return sql ? (await sql`SELECT body FROM recipes_with_ratings ORDER BY created_at DESC, id`).map(row => row.body) : recipes;
}
export async function getRecipe(id) {
  const sql = await database();
  return sql ? (await sql`SELECT body FROM recipes_with_ratings WHERE id = ${id}`)[0]?.body : recipes.find(recipe => recipe.id === id);
}
export async function saveRecipe(recipe, photo) {
  const sql = await database();
  if (!sql) throw new Error('Connect the recipe database to enable submissions.');
  const insert = sql`INSERT INTO recipes (id, body) VALUES (${recipe.id}, ${JSON.stringify(recipe)}::jsonb)`;
  if (photo) {
    await sql.transaction([insert, sql`INSERT INTO recipe_photos (id, jpeg) VALUES (${recipe.id}, ${photo.toString('base64')})`]);
  } else {
    await insert;
  }
}
export async function getPhoto(id) {
  const sql = await database();
  if (!sql) return null;
  return (await sql`SELECT jpeg FROM recipe_photos WHERE id = ${id}`)[0]?.jpeg;
}
export async function addRating(id, subject, stars) {
  if (!subject) throw new Error('Sign in to rate recipes.');
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error('Choose 1 to 5 stars.');
  const sql = await database();
  const rows = await sql`INSERT INTO recipe_votes (recipe_id, subject, stars)
    SELECT id, ${subject}::text, ${stars}::integer FROM recipes
    WHERE id = ${id} AND (body->>'owner') IS DISTINCT FROM ${subject}
    ON CONFLICT (recipe_id, subject) DO UPDATE SET stars = excluded.stars RETURNING stars`;
  if (!rows.length) throw new Error('This recipe is unavailable for rating.');
}

export async function updateOwnedRecipe(id, subject, changes, photo) {
  if (!subject) throw new Error('Sign in to edit a recipe.');
  const sql = await database();
  const update = sql`UPDATE recipes SET body = body || ${JSON.stringify(changes)}::jsonb
    WHERE id = ${id} AND body->>'owner' = ${subject} RETURNING id`;
  const operations = [update];
  if (photo) {
    operations.push(sql`INSERT INTO recipe_photos (id, jpeg)
      SELECT id, ${photo.toString('base64')} FROM recipes WHERE id = ${id} AND body->>'owner' = ${subject}
      ON CONFLICT (id) DO UPDATE SET jpeg = excluded.jpeg`);
  }
  const [updated] = await sql.transaction(operations);
  if (!updated.length) throw new Error('Only the author can edit this recipe.');
}
export async function deleteOwnedRecipe(id, subject) {
  if (!subject) throw new Error('Sign in to delete a recipe.');
  const sql = await database();
  const [, removed] = await sql.transaction([
    sql`DELETE FROM recipe_photos USING recipes WHERE recipes.id = recipe_photos.id
      AND recipes.id = ${id} AND recipes.body->>'owner' = ${subject}`,
    sql`DELETE FROM recipes WHERE id = ${id} AND body->>'owner' = ${subject} RETURNING id`
  ]);
  if (!removed.length) throw new Error('Only the author can delete this recipe.');
}
