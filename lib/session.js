import { cache } from 'react';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import { database } from './store.mjs';

const production = process.env.NODE_ENV === 'production';
const cookieName = production ? '__Host-recipe-session' : 'recipe-session';
const digest = value => createHash('sha256').update(value).digest('hex');

export const currentUser = cache(async () => {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const sql = await database();
  if (!sql) return null;
  const [user] = await sql`SELECT subject, name FROM recipe_sessions WHERE token_hash = ${digest(token)} AND expires_at > now()`;
  return user ?? null;
});

export async function startSession(subject, name) {
  const token = randomBytes(32).toString('hex');
  const sql = await database();
  await sql.transaction([
    sql`DELETE FROM recipe_sessions WHERE expires_at <= now()`,
    sql`INSERT INTO recipe_sessions VALUES (${digest(token)}, ${subject}, ${name}, now() + interval '7 days')`
  ]);
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: production, sameSite: 'lax', path: '/', maxAge: 604800 });
}
export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) {
    const sql = await database();
    await sql`DELETE FROM recipe_sessions WHERE token_hash = ${digest(token)}`;
  }
  jar.delete(cookieName);
}
