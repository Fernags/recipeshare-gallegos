import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ratingLabel } from '../../../lib/recipes.mjs';
import { getRecipe } from '../../../lib/store.mjs';
import { rate } from '../../actions.js';
export const dynamic = 'force-dynamic';
export default async function RecipePage({ params }) {
  const recipe = await getRecipe((await params).id);
  if (!recipe) notFound();
  return <article><Link href="/">← All recipes</Link><h1>{recipe.title}</h1>
    <p>{recipe.cuisine} · {recipe.category} · {recipe.minutes} min</p>
    <img className="hero" src={recipe.image} alt={recipe.title} />
    <p>By {recipe.author} · {ratingLabel(recipe.ratings)}</p>
    <form action={rate.bind(null, recipe.id)}><label>Your rating<select name="stars" required defaultValue=""><option value="">Choose stars</option>{[1,2,3,4,5].map(x => <option key={x} value={x}>{x} ★</option>)}</select></label><button>Rate recipe</button></form>
    <h2>Ingredients</h2><ul>{recipe.ingredients.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>Steps</h2><ol>{recipe.steps.map(step => <li key={step}>{step}</li>)}</ol></article>;
}
