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
test('keyword matches title or ingredient while respecting both dropdowns', () => {
  const staple = { title: 'Pilaf', ingredients: ['1 cup basmati rice'], cuisine: 'Iranian', category: 'Main Dish' };
  const pudding = { ...staple, title: 'Rice pudding', ingredients: ['milk'], category: 'Dessert' };
  const all = [staple, pudding, { ...staple, cuisine: 'Italian' }];
  assert.deepEqual(filterRecipes(all, 'Iranian', 'Main Dish', ' RICE '), [staple]);
  assert.deepEqual(filterRecipes(all, '', 'Dessert', 'rice'), [pudding]);
  assert.deepEqual(filterRecipes(all, '', '', 'apple'), []);
});
import { sortRecipes } from '../lib/recipes.mjs';
test('highest rated uses averages, with stable newest-first ties and unrated last', () => {
  const unrated = { ratings: [] }, recent = { ratings: [3,5] }, best = { ratings: [5] }, older = { ratings: [4] };
  const newest = [unrated, recent, best, older];
  assert.deepEqual(sortRecipes(newest, 'highest'), [best, recent, older, unrated]);
  assert.deepEqual(sortRecipes(newest, 'newest'), [unrated, recent, best, older]);
});
import { scaleIngredient } from '../lib/servings.mjs';
test('halving servings scales whole, mixed, fractional and ranged quantities', () => {
  for (const [line, expected] of [['2 eggs','1 eggs'], ['1 1/2 cups rice','0.75 cups rice'], ['½ cup milk','0.25 cup milk'], ['2–4 cloves','1–2 cloves'], ['Salt to taste','Salt to taste']]) {
    assert.equal(scaleIngredient(line, 4, 2), expected);
    assert.equal(scaleIngredient(line, 4, 4), line);
  }
});
