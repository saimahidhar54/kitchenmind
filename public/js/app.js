/* ═══════════════════════════════════════════════════════════
   KitchenMind – Client-Side App Logic
   SPA-like AJAX interactions, no page reloads
   ═══════════════════════════════════════════════════════════ */

const API_BASE = '/api';
const MEALSDB_API = 'https://www.themealdb.com/api/json/v1/1';

let allIngredients = [];
let deleteTargetId = null;

// ─── INIT ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadIngredients();
  fetchRecipes();
});

// ─── LOAD ALL INGREDIENTS ────────────────────────────────────

async function loadIngredients() {
  try {
    const res = await fetch(`${API_BASE}/ingredients`);
    const json = await res.json();
    if (json.success) {
      allIngredients = json.data;
      renderIngredients(allIngredients);
      updateStats(allIngredients);
    }
  } catch (err) {
    showToast('Failed to load ingredients', 'error');
  }
}

// ─── RENDER INGREDIENT CARDS ─────────────────────────────────

function renderIngredients(items) {
  const grid = document.getElementById('ingredientGrid');
  const emptyState = document.getElementById('emptyState');
  const itemCount = document.getElementById('itemCount');

  if (items.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('d-none');
    itemCount.textContent = '0 items';
    return;
  }

  emptyState.classList.add('d-none');
  itemCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  grid.innerHTML = items.map((item, i) => {
    const urgency = getUrgencyClass(item.expiry_date);
    const daysLeft = getDaysLeft(item.expiry_date);
    const expiryLabel = getExpiryLabel(daysLeft);
    const categoryEmoji = getCategoryEmoji(item.category);

    return `
      <div class="col-lg-4 col-md-6">
        <div class="ingredient-card glass-card d-flex gap-3 align-items-start urgency-${urgency.level}" style="animation-delay: ${i * 0.05}s">
          <div class="category-badge">${categoryEmoji}</div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="ingredient-name">${escapeHtml(item.name)}</div>
                <div class="ingredient-meta">
                  <span class="ingredient-qty">${item.quantity} ${item.unit}</span>
                  <span>•</span>
                  <span>${item.category}</span>
                </div>
              </div>
              <div class="ingredient-actions">
                <button class="btn btn-edit" onclick="openEditModal(${item.id})" title="Edit">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-delete" onclick="openDeleteModal(${item.id}, '${escapeHtml(item.name)}')" title="Delete">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="ingredient-expiry ${urgency.badge}">
                <i class="bi ${urgency.icon}"></i> ${expiryLabel}
              </span>
              ${item.notes ? `<span class="notes-badge">${escapeHtml(item.notes)}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── UPDATE STATS ────────────────────────────────────────────

function updateStats(items) {
  let fresh = 0, warning = 0, urgent = 0;

  items.forEach(item => {
    const days = getDaysLeft(item.expiry_date);
    if (days < 0) urgent++;
    else if (days <= 2) urgent++;
    else if (days <= 5) warning++;
    else fresh++;
  });

  animateCounter('statTotal', items.length);
  animateCounter('statFresh', fresh);
  animateCounter('statWarning', warning);
  animateCounter('statUrgent', urgent);
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  const current = parseInt(el.textContent) || 0;
  const step = target > current ? 1 : -1;
  const duration = 400;
  const steps = Math.abs(target - current);
  if (steps === 0) return;
  const interval = duration / steps;

  let val = current;
  const timer = setInterval(() => {
    val += step;
    el.textContent = val;
    if (val === target) clearInterval(timer);
  }, interval);
}

// ─── URGENCY HELPERS ─────────────────────────────────────────

function getDaysLeft(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function getUrgencyClass(expiryDate) {
  const days = getDaysLeft(expiryDate);
  if (days < 0) return { level: 'expired', badge: 'expiry-expired', icon: 'bi-x-circle-fill' };
  if (days <= 2) return { level: 'urgent', badge: 'expiry-urgent', icon: 'bi-fire' };
  if (days <= 5) return { level: 'warning', badge: 'expiry-warning', icon: 'bi-clock-fill' };
  return { level: 'fresh', badge: 'expiry-fresh', icon: 'bi-check-circle-fill' };
}

function getExpiryLabel(days) {
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Expires today!';
  if (days === 1) return 'Expires tomorrow';
  return `${days} days left`;
}

function getCategoryEmoji(category) {
  const map = {
    'Dairy': '🥛', 'Vegetables': '🥬', 'Fruits': '🍎', 'Meat': '🍗',
    'Grains': '🌾', 'Bakery': '🍞', 'Spices': '🌶️', 'Beverages': '🥤', 'Other': '📦'
  };
  return map[category] || '📦';
}

// ─── SEARCH & FILTER ─────────────────────────────────────────

function filterIngredients() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = allIngredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search);
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'expiry': return new Date(a.expiry_date) - new Date(b.expiry_date);
      case 'name': return a.name.localeCompare(b.name);
      case 'category': return a.category.localeCompare(b.category);
      case 'quantity': return b.quantity - a.quantity;
      default: return 0;
    }
  });

  renderIngredients(filtered);
}

// ─── ADD / EDIT MODAL ────────────────────────────────────────

function openAddModal() {
  document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle-fill text-accent"></i> Add Ingredient';
  document.getElementById('ingredientForm').reset();
  document.getElementById('ingredientId').value = '';
  document.getElementById('btnSave').innerHTML = '<i class="bi bi-check-lg"></i> Save';

  // Set default expiry to 7 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  document.getElementById('ingredientExpiry').value = defaultDate.toISOString().split('T')[0];

  const modal = new bootstrap.Modal(document.getElementById('ingredientModal'));
  modal.show();
}

async function openEditModal(id) {
  try {
    const res = await fetch(`${API_BASE}/ingredients/${id}`);
    const json = await res.json();
    if (!json.success) return showToast('Ingredient not found', 'error');

    const item = json.data;
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil-fill text-accent"></i> Edit Ingredient';
    document.getElementById('ingredientId').value = item.id;
    document.getElementById('ingredientName').value = item.name;
    document.getElementById('ingredientQty').value = item.quantity;
    document.getElementById('ingredientUnit').value = item.unit;
    document.getElementById('ingredientCategory').value = item.category;
    document.getElementById('ingredientExpiry').value = item.expiry_date;
    document.getElementById('ingredientNotes').value = item.notes || '';
    document.getElementById('btnSave').innerHTML = '<i class="bi bi-check-lg"></i> Update';

    const modal = new bootstrap.Modal(document.getElementById('ingredientModal'));
    modal.show();
  } catch (err) {
    showToast('Error loading ingredient', 'error');
  }
}

async function saveIngredient() {
  const id = document.getElementById('ingredientId').value;
  const data = {
    name: document.getElementById('ingredientName').value.trim(),
    quantity: parseFloat(document.getElementById('ingredientQty').value),
    unit: document.getElementById('ingredientUnit').value,
    category: document.getElementById('ingredientCategory').value,
    expiry_date: document.getElementById('ingredientExpiry').value,
    notes: document.getElementById('ingredientNotes').value.trim(),
  };

  // Validate
  if (!data.name || !data.quantity || !data.unit || !data.category || !data.expiry_date) {
    return showToast('Please fill in all required fields', 'error');
  }

  try {
    const isEdit = !!id;
    const url = isEdit ? `${API_BASE}/ingredients/${id}` : `${API_BASE}/ingredients`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (json.success) {
      bootstrap.Modal.getInstance(document.getElementById('ingredientModal')).hide();
      showToast(isEdit ? 'Ingredient updated!' : 'Ingredient added!', 'success');
      loadIngredients();
    } else {
      showToast(json.error || 'Failed to save', 'error');
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
  }
}

// ─── DELETE ──────────────────────────────────────────────────

function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteName').textContent = name;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const res = await fetch(`${API_BASE}/ingredients/${deleteTargetId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      showToast('Ingredient deleted', 'info');
      loadIngredients();
    } else {
      showToast(json.error || 'Failed to delete', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }

  deleteTargetId = null;
}

// ─── RESCUE MY FOOD ──────────────────────────────────────────

async function showRescue() {
  const section = document.getElementById('rescueSection');
  section.classList.remove('d-none');
  section.scrollIntoView({ behavior: 'smooth' });

  try {
    const res = await fetch(`${API_BASE}/rescue`);
    const json = await res.json();
    const rescueGrid = document.getElementById('rescueGrid');

    if (json.success && json.data.length > 0) {
      rescueGrid.innerHTML = json.data.map(item => {
        const daysLeft = getDaysLeft(item.expiry_date);
        const urgency = getUrgencyClass(item.expiry_date);
        const emoji = getCategoryEmoji(item.category);

        return `
          <div class="col-lg-4 col-md-6">
            <div class="ingredient-card glass-card d-flex gap-3 align-items-start urgency-${urgency.level}">
              <div class="category-badge">${emoji}</div>
              <div class="flex-grow-1">
                <div class="ingredient-name">${escapeHtml(item.name)}</div>
                <div class="ingredient-meta">
                  <span class="ingredient-qty">${item.quantity} ${item.unit}</span>
                  <span>•</span>
                  <span>${item.category}</span>
                </div>
                <div class="mt-2">
                  <span class="ingredient-expiry ${urgency.badge}">
                    <i class="bi ${urgency.icon}"></i> ${getExpiryLabel(daysLeft)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Also try to fetch recipes for the first near-expiry ingredient
      if (json.data.length > 0) {
        fetchRecipesForIngredient(json.data[0].name);
      }
    } else {
      rescueGrid.innerHTML = `
        <div class="col-12 text-center py-4">
          <div style="font-size: 3rem">🎉</div>
          <h5 class="mt-2">All clear!</h5>
          <p class="text-muted">No ingredients are expiring soon. Great job!</p>
        </div>
      `;
    }
  } catch (err) {
    showToast('Failed to load rescue data', 'error');
  }
}

function hideRescue() {
  document.getElementById('rescueSection').classList.add('d-none');
}

// ─── RECIPE SUGGESTIONS ─────────────────────────────────────

async function fetchRecipes() {
  const grid = document.getElementById('recipeGrid');
  const loading = document.getElementById('recipeLoading');
  loading.classList.remove('d-none');
  grid.innerHTML = '';

  try {
    // Fetch from multiple categories for variety
    const categories = ['Chicken', 'Vegetarian', 'Dessert', 'Pasta', 'Seafood', 'Breakfast'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    const res = await fetch(`${MEALSDB_API}/filter.php?c=${randomCat}`);
    const json = await res.json();

    if (json.meals && json.meals.length > 0) {
      const meals = json.meals.slice(0, 6); // Show 6 recipes
      grid.innerHTML = meals.map(meal => `
        <div class="col-lg-4 col-md-6">
          <div class="recipe-card glass-card" onclick="window.open('https://www.themealdb.com/meal/${meal.idMeal}', '_blank')">
            <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}" loading="lazy">
            <div class="recipe-body">
              <div class="recipe-category">${randomCat}</div>
              <div class="recipe-title">${escapeHtml(meal.strMeal)}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    grid.innerHTML = '<div class="col-12 text-center text-muted py-4">Unable to load recipes. Check your internet connection.</div>';
  }

  loading.classList.add('d-none');
}

async function fetchRecipesForIngredient(ingredientName) {
  try {
    const res = await fetch(`${MEALSDB_API}/search.php?s=${encodeURIComponent(ingredientName)}`);
    const json = await res.json();
    const grid = document.getElementById('recipeGrid');

    if (json.meals && json.meals.length > 0) {
      const meals = json.meals.slice(0, 6);
      grid.innerHTML = meals.map(meal => `
        <div class="col-lg-4 col-md-6">
          <div class="recipe-card glass-card" onclick="window.open('https://www.themealdb.com/meal/${meal.idMeal}', '_blank')">
            <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}" loading="lazy">
            <div class="recipe-body">
              <div class="recipe-category">${escapeHtml(meal.strCategory || 'Recipe')}</div>
              <div class="recipe-title">${escapeHtml(meal.strMeal)}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    // Silently fail for rescue-based recipes
  }
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────

function showToast(message, type = 'info') {
  const toast = document.getElementById('appToast');
  const toastBody = document.getElementById('toastBody');
  toast.className = `toast align-items-center border-0 toast-${type}`;
  toastBody.textContent = message;
  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();
}

// ─── UTILITIES ───────────────────────────────────────────────

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
