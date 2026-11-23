'use client';
import { useState } from 'react';
import { scaleIngredient } from '../../../lib/servings.mjs';
export default function Ingredients({ ingredients, base }) {
  const [servings, setServings] = useState(base);
  const valid = Number.isInteger(Number(servings)) && Number(servings) >= 1 && Number(servings) <= 100;
  return <section><h2>Ingredients</h2>
    <label>Servings<input type="number" min="1" max="100" value={servings}
      onChange={event => setServings(event.target.value)} /></label>
    {valid ? <ul>{ingredients.map((line, index) => <li key={index}>{scaleIngredient(line, base, Number(servings))}</li>)}</ul>
      : <p>Enter a whole number from 1 to 100.</p>}
  </section>;
}
