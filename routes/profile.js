const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { isLoggedIn } = require('../middleware/auth');

// ─── VIEW PROFILE ────────────────────────────────────────────

router.get('/profile', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.session.userId);

    res.render('profile/view', { 
      title: 'My Profile',
      user,
      profile: profile || {}
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load profile');
    res.redirect('/dashboard');
  }
});

// ─── UPDATE PROFILE ──────────────────────────────────────────

router.post('/profile/update', isLoggedIn, (req, res) => {
  const { daily_calories, daily_protein, daily_carbs, daily_fat, serving_size, allergies, dietary_preference } = req.body;

  try {
    const db = getDb();
    
    db.prepare(`
      UPDATE user_profiles 
      SET daily_calories = ?, daily_protein = ?, daily_carbs = ?, daily_fat = ?, 
          serving_size = ?, allergies = ?, dietary_preference = ?
      WHERE user_id = ?
    `).run(
      daily_calories || 2000,
      daily_protein || 50,
      daily_carbs || 250,
      daily_fat || 70,
      serving_size || 1,
      allergies || '',
      dietary_preference || '',
      req.session.userId
    );

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update profile');
    res.redirect('/profile');
  }
});

module.exports = router;
