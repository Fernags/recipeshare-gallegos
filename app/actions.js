'use server';
import { currentUser, endSession } from '../lib/session';
import { preparePhoto } from '../lib/photos.mjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { parseRecipe } from '../lib/forms.mjs';
import { saveRecipe, addRating, getRecipe, updateOwnedRecipe, deleteOwnedRecipe } from '../lib/store.mjs';
export async function create(previous, form) {
  const user = await currentUser();
  if (user) form.set('author', user.name);
  let data;
  const id = crypto.randomUUID();
  let photo;
  try {
    const file = form.get('photo');
    data = parseRecipe(form, file?.size ? '/photos/' + id : '');
    if (file?.size) photo = await preparePhoto(file);
  } catch (error) { return error.message; }
  if (!process.env.DATABASE_URL) return 'The recipe database is not connected yet.';
  await saveRecipe({ ...data, id, owner: user?.subject ?? null, ratings: [] }, photo);
  revalidatePath('/');
  redirect('/');
}
export async function rate(id, form) {
  await addRating(id, Number(form.get('stars')));
  revalidatePath('/');
  revalidatePath('/recipes/' + id);
}

export async function signOut() {
  await endSession();
  redirect('/');
}
export async function edit(id, previous, form) {
  const user = await currentUser();
  if (!user) return 'Sign in to edit this recipe.';
  const recipe = await getRecipe(id);
  if (recipe?.owner !== user.subject) return 'Only the author can edit this recipe.';
  form.set('author', user.name);
  const file = form.get('photo');
  if (!form.get('image')) form.set('image', recipe.image);
  try {
    const photo = file?.size ? await preparePhoto(file) : null;
    const keepUpload = form.get('image') === recipe.image && recipe.image.startsWith('/photos/');
    const image = photo ? '/photos/' + id + '?v=' + crypto.randomUUID() : keepUpload ? recipe.image : '';
    await updateOwnedRecipe(id, user.subject, parseRecipe(form, image), photo);
  } catch (error) { return error.message; }
  revalidatePath('/');
  redirect('/recipes/' + id);
}
export async function remove(id, form) {
  const user = await currentUser();
  if (!user || form.get('confirm') !== 'on') throw new Error('Confirm deletion as the recipe author.');
  await deleteOwnedRecipe(id, user.subject);
  revalidatePath('/');
  redirect('/profile');
}
