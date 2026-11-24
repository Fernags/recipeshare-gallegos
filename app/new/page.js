import RecipeForm from './RecipeForm';
import { currentUser } from '../../lib/session';
export default async function NewRecipe() {
  const user = await currentUser();
  return <RecipeForm name={user?.name} />;
}
