export const recipes = [
  {
    id: 'margherita-pizza', title: 'Margherita Pizza', cuisine: 'Italian', category: 'Main Dish',
    author: 'RecipeShare Kitchen', minutes: 35,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=960&q=85',
    ingredients: ['1 pizza dough ball', '3 tbsp tomato sauce', '3 oz fresh mozzarella', 'Fresh basil'],
    steps: ['Heat the oven to 475°F. Stretch the dough onto a baking sheet.', 'Spread the sauce over the dough and add torn mozzarella.', 'Bake for 12–15 minutes until golden. Finish with basil.'],
    ratings: []
  },
  {
    id: 'buttermilk-pancakes', title: 'Buttermilk Pancakes', cuisine: 'American', category: 'Breakfast',
    author: 'RecipeShare Kitchen', minutes: 20,
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=960&q=85',
    ingredients: ['1 cup flour', '1 tsp baking powder', '½ tsp baking soda', '1 cup buttermilk', '1 egg', '1 tbsp melted butter'],
    steps: ['Whisk the dry ingredients together.', 'Stir in buttermilk, egg and butter just until combined.', 'Pour quarter-cup portions into a lightly buttered skillet over medium heat. Flip once bubbles form and cook until golden.'],
    ratings: []
  }
];
export function ratingLabel(ratings) {
  if (!ratings.length) return 'No ratings yet';
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return average.toFixed(1) + ' / 5 (' + ratings.length + ')';
}
export function findRecipe(id) {
  return recipes.find(recipe => recipe.id === id);
}
