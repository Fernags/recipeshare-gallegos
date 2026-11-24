import { currentUser } from '../lib/session';
import { signOut } from './actions';
import Link from 'next/link';
import './style.css';
export const metadata = { title: 'RecipeShare', description: 'Browse and share recipes from around the world.' };
export default async function Layout({ children }) {
  const user = await currentUser();
  return <html lang="en"><body><header><Link href="/">RecipeShare</Link><nav>{user ? <><Link href="/profile">My recipes</Link><form action={signOut}><button>Sign out</button></form></> : <a href="/signin">Sign in</a>}</nav></header><main>{children}</main></body></html>;
}
