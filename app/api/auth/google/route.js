import { googleClientId, validSignInRequest } from '../../../../lib/google.mjs';
import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { startSession } from '../../../../lib/session';

export async function POST(request) {
  const form = await request.formData();
  const csrf = request.cookies.get('g_csrf_token')?.value;
  if (!validSignInRequest(csrf, form.get('g_csrf_token'))) return new Response('Sign-in request expired. Try again.', { status: 403 });
  let profile;
  try {
    const ticket = await new OAuth2Client().verifyIdToken({ idToken: form.get('credential'), audience: googleClientId });
    profile = ticket.getPayload();
    if (!profile?.sub) throw new Error();
  } catch {
    return new Response('Google could not verify this sign-in. Please try again.', { status: 401 });
  }
  await startSession(profile.sub, profile.name || 'RecipeShare cook');
  return NextResponse.redirect(new URL('/profile', request.url), 303);
}
