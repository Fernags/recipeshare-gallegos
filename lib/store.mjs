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
    ...recipes.map(recipe => sql`INSERT INTO recipes (id, body) VALUES (${recipe.id}, ${JSON.stringify(recipe)}::jsonb) ON CONFLICT DO NOTHING`)
  ]).catch(error => { initialized = undefined; throw error; });
  await initialized;
  return sql;
}
export async function listRecipes() {
  const sql = await database();
  return sql ? (await sql`SELECT body FROM recipes ORDER BY created_at DESC, id`).map(row => row.body) : recipes;
}
export async function getRecipe(id) {
  const sql = await database();
  return sql ? (await sql`SELECT body FROM recipes WHERE id = ${id}`)[0]?.body : recipes.find(recipe => recipe.id === id);
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
export async function addRating(id, stars) {
  const sql = await database();
  if (!sql) throw new Error('Connect the recipe database to enable ratings.');
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error('Choose 1 to 5 stars.');
  await sql`UPDATE recipes SET body = jsonb_set(body, '{ratings}', (body->'ratings') || to_jsonb(${stars}::integer)) WHERE id = ${id}`;
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
