import Link from 'next/link';
import './style.css';
export const metadata = { title: 'RecipeShare', description: 'Browse and share recipes from around the world.' };
export default function Layout({ children }) {
  return <html lang="en"><body><header><Link href="/">RecipeShare</Link></header><main>{children}</main></body></html>;
}
