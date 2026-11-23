import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findRecipe, ratingLabel } from '../../../lib/recipes.mjs';
export default async function RecipePage({ params }) {
  const recipe = findRecipe((await params).id);
  if (!recipe) notFound();
  return <article><Link href="/">← All recipes</Link><h1>{recipe.title}</h1>
    <p>{recipe.cuisine} · {recipe.category} · {recipe.minutes} min</p>
    <img className="hero" src={recipe.image} alt={recipe.title} />
    <p>By {recipe.author} · {ratingLabel(recipe.ratings)}</p>
    <h2>Ingredients</h2><ul>{recipe.ingredients.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>Steps</h2><ol>{recipe.steps.map(step => <li key={step}>{step}</li>)}</ol></article>;
}
