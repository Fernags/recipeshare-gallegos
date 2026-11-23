import { neon } from '@neondatabase/serverless';
import { recipes } from './recipes.mjs';

function store() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}
let initialized;
async function database() {
  const sql = store();
  if (!sql) return null;
  initialized ??= sql.transaction([
    sql`CREATE TABLE IF NOT EXISTS recipes (id text PRIMARY KEY, body jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS recipe_photos (id text PRIMARY KEY REFERENCES recipes(id), jpeg text NOT NULL)`,
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
