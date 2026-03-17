const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'kitchenmind.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'pcs',
      category TEXT NOT NULL DEFAULT 'Other',
      expiry_date TEXT NOT NULL,
      added_date TEXT NOT NULL DEFAULT (date('now')),
      notes TEXT DEFAULT ''
    );
  `);

  // Seed some sample data if table is empty
  const count = db.prepare('SELECT COUNT(*) as cnt FROM ingredients').get();
  if (count.cnt === 0) {
    const insert = db.prepare(`
      INSERT INTO ingredients (name, quantity, unit, category, expiry_date, notes)
      VALUES (@name, @quantity, @unit, @category, @expiry_date, @notes)
    `);

    const today = new Date();
    const samples = [
      { name: 'Milk', quantity: 1, unit: 'litre', category: 'Dairy', expiry_date: addDays(today, 2), notes: 'Full cream' },
      { name: 'Tomatoes', quantity: 6, unit: 'pcs', category: 'Vegetables', expiry_date: addDays(today, 1), notes: '' },
      { name: 'Chicken Breast', quantity: 500, unit: 'grams', category: 'Meat', expiry_date: addDays(today, 3), notes: 'Boneless' },
      { name: 'Rice', quantity: 2, unit: 'kg', category: 'Grains', expiry_date: addDays(today, 60), notes: 'Basmati' },
      { name: 'Eggs', quantity: 12, unit: 'pcs', category: 'Dairy', expiry_date: addDays(today, 5), notes: '' },
      { name: 'Spinach', quantity: 250, unit: 'grams', category: 'Vegetables', expiry_date: addDays(today, 0), notes: 'Fresh bundle' },
      { name: 'Yogurt', quantity: 2, unit: 'cups', category: 'Dairy', expiry_date: addDays(today, 4), notes: 'Plain' },
      { name: 'Onions', quantity: 5, unit: 'pcs', category: 'Vegetables', expiry_date: addDays(today, 14), notes: '' },
      { name: 'Bread', quantity: 1, unit: 'loaf', category: 'Bakery', expiry_date: addDays(today, 1), notes: 'Whole wheat' },
      { name: 'Butter', quantity: 200, unit: 'grams', category: 'Dairy', expiry_date: addDays(today, 10), notes: 'Salted' },
    ];

    const insertMany = db.transaction((items) => {
      for (const item of items) insert.run(item);
    });
    insertMany(samples);
  }
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

module.exports = { getDb };
