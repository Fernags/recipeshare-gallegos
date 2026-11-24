import { googleClientId } from '../../lib/google.mjs';
import { redirect } from 'next/navigation';
import { currentUser } from '../../lib/session';
export default async function SignIn() {
  if (await currentUser()) redirect('/profile');
  return <article><h1>Sign in</h1><p>Sign in with Google to manage your recipes and rate dishes.</p>
    <>
      <div id="g_id_onload" data-client_id={googleClientId} data-login_uri={process.env.NODE_ENV === 'production' ? 'https://recipeshare-gallegos.vercel.app/api/auth/google' : 'http://localhost:3000/api/auth/google'} data-ux_mode="redirect" data-auto_prompt="false" />
      <div className="g_id_signin" data-type="standard" />
      <script async src="https://accounts.google.com/gsi/client" />
    </>
  </article>;
}
