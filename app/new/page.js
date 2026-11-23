'use client';
import { useActionState } from 'react';
import { create } from '../actions';
import { cuisines, categories } from '../../lib/forms.mjs';
export default function NewRecipe() {
  const [error, action, pending] = useActionState(create, '');
  return <article><h1>Add a recipe</h1><form action={action} className="entry">
    <label>Author name<input name="author" required /></label><label>Title<input name="title" required /></label>
    {Object.entries({ cuisine: cuisines, category: categories }).map(([name, options]) => <label key={name}>{name}<select name={name} defaultValue="" required><option value="">Choose {name}</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>)}
    <label>Ingredients (one per line)<textarea name="ingredients" required /></label><label>Steps (one per line)<textarea name="steps" required /></label>
    <label>Prep time in minutes<input type="number" min="1" name="minutes" required /></label>
    <label>Image link<input type="url" name="image" required /></label>
    {error && <p role="alert">{error}</p>}<button disabled={pending}>Share recipe</button>
  </form></article>;
}
