import Link from 'next/link';
import { ratingLabel } from '../lib/recipes.mjs';
import { listRecipes } from '../lib/store.mjs';
import { categories, cuisines, filterRecipes } from '../lib/forms.mjs';
export const dynamic = 'force-dynamic';
export default async function Home({ searchParams }) {
  const { cuisine = '', category = '' } = await searchParams;
  const recipes = filterRecipes(await listRecipes(), cuisine, category);
  return <><h1>Browse recipes</h1><nav><Link href="/new">Add a recipe</Link></nav>
    <form className="filters"><label>Cuisine<select name="cuisine" defaultValue={cuisine}><option value="">All cuisines</option>{cuisines.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Category<select name="category" defaultValue={category}><option value="">All categories</option>{categories.map(x => <option key={x}>{x}</option>)}</select></label>
    <button>Filter</button><Link href="/">Clear</Link></form>
    {recipes.length === 0 && <p>No recipes found</p>}<section className="cards">{recipes.map(recipe =>
    <Link className="card" href={'/recipes/' + recipe.id} key={recipe.id}>
      <img src={recipe.image} alt={recipe.title} /><div className="caption">
      <small>{recipe.cuisine} · {recipe.category}</small><h2>{recipe.title}</h2>
      <span>{recipe.minutes} min · {ratingLabel(recipe.ratings)}</span></div>
    </Link>)}</section></>;
}
