import Link from 'next/link';
import { ratingLabel, sortRecipes } from '../lib/recipes.mjs';
import { listRecipes } from '../lib/store.mjs';
import { categories, cuisines, filterRecipes } from '../lib/forms.mjs';
export const dynamic = 'force-dynamic';
export default async function Home({ searchParams }) {
  const params = await searchParams;
  const read = key => typeof params[key] === 'string' ? params[key] : '';
  const cuisine = read('cuisine');
  const category = read('category');
  const keyword = read('q');
  const sort = read('sort') === 'highest' ? 'highest' : 'newest';
  const recipes = sortRecipes(filterRecipes(await listRecipes(), cuisine, category, keyword), sort);
  return <><h1>Browse recipes</h1><nav><Link href="/new">Add a recipe</Link></nav>
    <form className="filters" key={JSON.stringify([keyword, cuisine, category, sort])}>
    <label>Search recipes<input type="search" name="q" placeholder="Title or ingredient" defaultValue={keyword} /></label>
    <label>Cuisine<select name="cuisine" defaultValue={cuisine}><option value="">All cuisines</option>{cuisines.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Category<select name="category" defaultValue={category}><option value="">All categories</option>{categories.map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Sort by<select name="sort" defaultValue={sort}><option value="newest">Newest</option><option value="highest">Highest rated</option></select></label>
    <button>Apply</button><Link href="/">Clear</Link></form>
    {recipes.length === 0 && <p>No recipes found</p>}<section className="cards">{recipes.map(recipe =>
    <Link className="card" href={'/recipes/' + recipe.id} key={recipe.id}>
      <img src={recipe.image} alt={recipe.title} /><div className="caption">
      <small>{recipe.cuisine} · {recipe.category}</small><h2>{recipe.title}</h2>
      <span>{recipe.minutes} min · {ratingLabel(recipe.ratings)}</span></div>
    </Link>)}</section></>;
}
