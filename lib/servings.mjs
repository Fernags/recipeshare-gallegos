const fractions = { '½': 1/2, '⅓': 1/3, '⅔': 2/3, '¼': 1/4, '¾': 3/4, '⅛': 1/8, '⅜': 3/8, '⅝': 5/8, '⅞': 7/8 };
const amount = /^(?:(\d+)\s+)?(\d+)\/(\d+)|^(\d*)\s*([½⅓⅔¼¾⅛⅜⅝⅞])|^(\d*\.\d+|\d+)/;
function scaleAmount(text, ratio) {
  const match = text.match(amount);
  if (!match) return null;
  let value;
  if (match[2]) value = Number(match[1] || 0) + Number(match[2]) / Number(match[3]);
  else if (match[5]) value = Number(match[4]) + fractions[match[5]];
  else value = Number(match[6]);
  if (!Number.isFinite(value)) return null;
  return { quantity: String(Number((value * ratio).toFixed(3))), rest: text.slice(match[0].length) };
}
export function scaleIngredient(line, base, servings) {
  if (base === servings) return line;
  const ratio = servings / base;
  const first = scaleAmount(line, ratio);
  if (!first) return line;
  const range = first.rest.match(/^(\s*(?:[-–]|to)\s*)(?=\d|[½⅓⅔¼¾⅛⅜⅝⅞])/);
  if (range) {
    const second = scaleAmount(first.rest.slice(range[0].length), ratio);
    if (second) return first.quantity + range[0] + second.quantity + second.rest;
  }
  return first.quantity + first.rest;
}
