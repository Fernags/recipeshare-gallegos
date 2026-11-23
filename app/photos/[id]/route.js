import { getPhoto } from '../../../lib/store.mjs';
export async function GET(request, { params }) {
  const photo = await getPhoto((await params).id);
  if (!photo) return new Response(null, { status: 404 });
  return new Response(Buffer.from(photo, 'base64'), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}
