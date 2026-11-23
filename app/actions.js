'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { parseRecipe } from '../lib/forms.mjs';
import { saveRecipe, addRating } from '../lib/store.mjs';
export async function create(previous, form) {
  let data;
  try { data = parseRecipe(form); } catch (error) { return error.message; }
  if (!process.env.DATABASE_URL) return 'The recipe database is not connected yet.';
  await saveRecipe({ ...data, id: crypto.randomUUID(), ratings: [] });
  revalidatePath('/');
  redirect('/');
}
export async function rate(id, form) {
  await addRating(id, Number(form.get('stars')));
  revalidatePath('/');
  revalidatePath('/recipes/' + id);
}
