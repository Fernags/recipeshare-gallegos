import { redirect } from 'next/navigation';
import { currentUser } from '../../lib/session';
export default async function SignIn() {
  if (await currentUser()) redirect('/profile');
  return <article><h1>Sign in</h1><p>Sign in with Google to manage your recipes and rate dishes.</p>
    {process.env.GOOGLE_CLIENT_ID ? <>
      <div id="g_id_onload" data-client_id={process.env.GOOGLE_CLIENT_ID} data-login_uri="/api/auth/google" data-ux_mode="redirect" data-auto_prompt="false" />
      <div className="g_id_signin" data-type="standard" />
      <script async src="https://accounts.google.com/gsi/client" />
    </> : <p>Google sign-in is awaiting configuration.</p>}
  </article>;
}
