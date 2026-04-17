// utils/nutrition.js
async function getNutrients(ingredientsList) {
  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  const response = await fetch(
    `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Recipe', ingr: ingredientsList })
    }
  );
  const data = await response.json();
  return {
    calories: data.calories,
    protein: data.totalNutrients?.PROCNT?.quantity,
    carbs:   data.totalNutrients?.CHOCDF?.quantity,
    fat:     data.totalNutrients?.FAT?.quantity,
    fiber:   data.totalNutrients?.FIBTG?.quantity,
  };
}
module.exports = { getNutrients };