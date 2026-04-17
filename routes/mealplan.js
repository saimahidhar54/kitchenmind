const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { isLoggedIn } = require('../middleware/auth');

// ─── GET MEAL PLAN ───────────────────────────────────────────

router.get('/api/mealplan', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT mp.*, r.title, r.ingredients, r.calories, r.protein, r.carbs, r.fat
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.user_id = ?
    `;
    
    const params = [req.session.userId];
    
    if (startDate && endDate) {
      query += ' AND mp.meal_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY mp.meal_date ASC, mp.meal_type ASC';
    
    const meals = db.prepare(query).all(...params);
    res.json({ success: true, data: meals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ADD TO MEAL PLAN ────────────────────────────────────────

router.post('/api/mealplan', isLoggedIn, (req, res) => {
  try {
    const { recipe_id, meal_date, meal_type, servings } = req.body;
    
    if (!recipe_id || !meal_date || !meal_type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO meal_plans (user_id, recipe_id, meal_date, meal_type, servings)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.session.userId, recipe_id, meal_date, meal_type, servings || 1);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE FROM MEAL PLAN ───────────────────────────────────

router.delete('/api/mealplan/:id', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM meal_plans WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GENERATE SHOPPING LIST FROM MEAL PLAN ───────────────────

router.post('/api/mealplan/generate-shopping-list', isLoggedIn, (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const db = getDb();
    
    // Get all meals in the date range
    const meals = db.prepare(`
      SELECT mp.servings, r.ingredients
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.user_id = ? AND mp.meal_date BETWEEN ? AND ?
    `).all(req.session.userId, startDate, endDate);
    
    // Aggregate ingredients
    const shoppingList = {};
    
    meals.forEach(meal => {
      const ingredients = JSON.parse(meal.ingredients || '[]');
      ingredients.forEach(ing => {
        const key = `${ing.name}_${ing.unit}`;
        if (!shoppingList[key]) {
          shoppingList[key] = { name: ing.name, quantity: 0, unit: ing.unit };
        }
        shoppingList[key].quantity += (ing.quantity || 0) * meal.servings;
      });
    });
    
    // Save to shopping list
    const insertStmt = db.prepare(`
      INSERT INTO shopping_lists (user_id, ingredient_name, quantity, unit)
      VALUES (?, ?, ?, ?)
    `);
    
    Object.values(shoppingList).forEach(item => {
      insertStmt.run(req.session.userId, item.name, item.quantity, item.unit);
    });
    
    res.json({ success: true, items: Object.values(shoppingList) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
