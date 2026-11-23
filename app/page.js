import Link from 'next/link';
import { recipes, ratingLabel } from '../lib/recipes.mjs';
export default function Home() {
  return <><h1>Browse recipes</h1><section className="cards">{recipes.map(recipe =>
    <Link className="card" href={'/recipes/' + recipe.id} key={recipe.id}>
      <img src={recipe.image} alt={recipe.title} /><div className="caption">
      <small>{recipe.cuisine} · {recipe.category}</small><h2>{recipe.title}</h2>
      <span>{recipe.minutes} min · {ratingLabel(recipe.ratings)}</span></div>
    </Link>)}</section></>;
}
