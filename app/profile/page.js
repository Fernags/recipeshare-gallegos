import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '../../lib/session';
import { database } from '../../lib/store.mjs';
export default async function Profile() {
  const user = await currentUser();
  if (!user) redirect('/signin');
  const sql = await database();
  const mine = await sql`SELECT id, body->>'title' AS title FROM recipes WHERE body->>'owner' = ${user.subject} ORDER BY created_at DESC, id`;
  return <article><h1>My recipes</h1><p>Signed in as {user.name}</p>
    <Link href="/new">Add a recipe</Link>
    {mine.length ? <ul>{mine.map(recipe => <li key={recipe.id}><Link href={'/recipes/' + recipe.id}>{recipe.title}</Link></li>)}</ul> : <p>Your recipes will appear here when you share one while signed in.</p>}
  </article>;
}
