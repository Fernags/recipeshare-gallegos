'use client';
import { useActionState, useState } from 'react';
import { create } from '../actions';
import { cuisines, categories } from '../../lib/forms.mjs';
export default function NewRecipe() {
  const [error, action, pending] = useActionState(create, '');
  const [hasPhoto, setHasPhoto] = useState(false);
  return <article><h1>Add a recipe</h1><form action={action} className="entry">
    <label>Author name<input name="author" required /></label><label>Title<input name="title" required /></label>
    {Object.entries({ cuisine: cuisines, category: categories }).map(([name, options]) => <label key={name}>{name}<select name={name} defaultValue="" required><option value="">Choose {name}</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>)}
    <label>Ingredients (one per line)<textarea name="ingredients" required /></label><label>Steps (one per line)<textarea name="steps" required /></label>
    <label>Prep time in minutes<input type="number" min="1" name="minutes" required /></label>
    <label>Upload a food photo (JPEG, PNG or WebP, up to 3 MB)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={event => {
      const file = event.target.files[0];
      event.target.setCustomValidity(file?.size > 3 * 1024 * 1024 ? 'Choose a photo under 3 MB.' : '');
      setHasPhoto(Boolean(file));
    }} /></label>
    <label>Or use an image link<input type="url" name="image" disabled={hasPhoto} required={!hasPhoto} /></label>
    {error && <p role="alert">{error}</p>}<button disabled={pending}>Share recipe</button>
  </form></article>;
}
