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
