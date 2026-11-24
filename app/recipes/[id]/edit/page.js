import { notFound, redirect } from 'next/navigation';
import { currentUser } from '../../../../lib/session';
import { getRecipe } from '../../../../lib/store.mjs';
import RecipeForm from '../../../new/RecipeForm';
import { remove } from '../../../actions';
export default async function EditRecipe({ params }) {
  const user = await currentUser();
  if (!user) redirect('/signin');
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe || recipe.owner !== user.subject) notFound();
  return <><RecipeForm recipe={recipe} name={user.name} />
    <article><form action={remove.bind(null, id)}>
      <label><input type="checkbox" name="confirm" required /> Permanently delete this recipe</label>
      <button>Delete recipe</button></form></article></>;
}
