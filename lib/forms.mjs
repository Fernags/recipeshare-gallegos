export const cuisines = ['American','Arabic','Chinese','German','Indian','Iranian','Italian','Japanese','Mexican','Other'];
export const categories = ['Breakfast','Main Dish','Fast Food','Soup','Salad','Dessert','Snack','Drink'];
export function parseRecipe(form) {
  const fields = ['author','title','cuisine','category','ingredients','steps','minutes','image'];
  const data = Object.fromEntries(fields.map(key => [key, String(form.get(key) ?? '').trim()]));
  for (const key of fields) if (!data[key]) throw new Error('Please fill in ' + key + '.');
  if (!cuisines.includes(data.cuisine) || !categories.includes(data.category)) throw new Error('Choose a listed cuisine and category.');
  data.minutes = Number(data.minutes);
  if (!Number.isSafeInteger(data.minutes) || data.minutes < 1) throw new Error('Enter a positive whole number of minutes.');
  if (!URL.canParse(data.image) || !['https:','http:'].includes(new URL(data.image).protocol)) throw new Error('Enter an HTTP or HTTPS image link.');
  for (const key of ['ingredients','steps']) data[key] = data[key].split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return data;
}
export function filterRecipes(list, cuisine, category) {
  return list.filter(recipe => (!cuisine || cuisine === recipe.cuisine) && (!category || category === recipe.category));
}
