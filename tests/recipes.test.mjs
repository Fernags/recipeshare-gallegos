import test from 'node:test';
import assert from 'node:assert/strict';
import { findRecipe, ratingLabel, recipes } from '../lib/recipes.mjs';
test('each sample supplies the fields displayed on a recipe card', () => {
  for (const recipe of recipes) {
    for (const field of ['title','category','cuisine','image']) assert.ok(recipe[field]);
    assert.equal(new URL(recipe.image).protocol, 'https:');
    assert.equal(ratingLabel(recipe.ratings), 'No ratings yet');
  }
});
test('each card ID resolves to its complete recipe', () => {
  for (const card of recipes) {
    const detail = findRecipe(card.id);
    assert.ok(detail.author && detail.minutes && detail.ingredients.length && detail.steps.length);
  }
  assert.equal(findRecipe('missing'), undefined);
});
import { filterRecipes, parseRecipe } from '../lib/forms.mjs';
test('cuisine and category must both match', () => {
  const recipe = { cuisine: 'Iranian', category: 'Main Dish' };
  const all = [recipe, { ...recipe, category: 'Soup' }];
  assert.deepEqual(filterRecipes(all, 'Iranian', 'Main Dish'), [recipe]);
  assert.deepEqual(filterRecipes(all, '', ''), all);
  assert.deepEqual(filterRecipes(all, 'Japanese', ''), []);
});
test('required field errors identify the missing field', () => {
  assert.throws(() => parseRecipe(new Map([['author','Fern']])), /title/);
});
test('ratings show the current average and vote count', () => {
  assert.equal(ratingLabel([1,5]), '3.0 / 5 (2)');
});
