#  KitchenMind - Smart Kitchen Management System

**A comprehensive web application for intelligent kitchen inventory management, personalized meal planning, and zero-waste cooking.**

---

##  Project Team

- **Sai Mahidhar** (25MCMT29)
- **Shaik Jani Begum** (25MCMT09)

**Course:** M.Tech Computer Science - Software Engineering Lab 2025-26  
**Institution:** [Your Institution Name]  
**Submission Date:** April 21, 2026

---

##  Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

##  Features

###  User Authentication
- Secure registration and login system
- Password hashing with bcrypt
- Session-based authentication
- User-specific data isolation

###  Inventory Management
- Add, edit, and delete ingredients
- Track quantities and expiry dates
- Categorize ingredients (Dairy, Vegetables, Meat, etc.)
- Search and filter functionality
- Expiry alerts ("Rescue My Food" feature)

###  User Profiles
- Personalized nutritional goals (calories, protein, carbs, fat)
- Allergy tracking
- Dietary preferences (Vegetarian, Vegan, Keto, etc.)
- Serving size customization (number of people cooking for)

###  Recipe Management
- Browse recipes from TheMealDB API
- Filter recipes based on allergies
- Filter by dietary preferences
- Scale recipes to serving size
- Save favorite recipes

###  Meal Planning
- Schedule meals by date and type (breakfast, lunch, dinner, snack)
- View meal plans in calendar format
- Track planned nutrition

###  Smart Shopping Lists
- Auto-generate shopping lists from meal plans
- Manual item addition
- Check off purchased items
- Aggregate duplicate items
- Clear completed items

###  Nutrition Tracking
- Log consumed meals
- View daily nutrition summaries
- Track progress toward goals

---

##  Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite with better-sqlite3
- **Authentication:** bcryptjs, express-session
- **Validation:** express-validator

### Frontend
- **Template Engine:** EJS
- **CSS Framework:** Bootstrap 5
- **Icons:** Bootstrap Icons
- **Fonts:** Google Fonts (Inter)

### External APIs
- **TheMealDB API** - Recipe data

---

##  Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/saimahidhar54/kitchenmind.git
   cd kitchenmind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

##  Usage

### First Time Setup

1. **Register an Account**
   - Click "Get Started" or "Register"
   - Enter username, email, and password
   - Submit the form

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Set Up Your Profile**
   - Navigate to "Profile" from the navbar
   - Set your nutritional goals
   - Add any allergies (comma-separated)
   - Select dietary preference
   - Set serving size (number of people)
   - Click "Save Changes"

4. **Add Ingredients**
   - Click "Add" button in the navbar
   - Fill in ingredient details:
     - Name
     - Quantity and unit
     - Category
     - Expiry date
     - Optional notes
   - Click "Save"

5. **Browse Recipes**
   - Scroll to "Recipe Suggestions" section
   - Click on any recipe to view details
   - Recipes are filtered based on your allergies and preferences

6. **Plan Meals**
   - (Feature to be accessed via API or future UI)
   - Schedule recipes for specific dates and meal types

7. **Generate Shopping List**
   - (Feature to be accessed via API)
   - Create shopping lists from meal plans

---


##  API Documentation

### Authentication Endpoints

#### POST `/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Redirect to `/login` with success message

---

#### POST `/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Redirect to `/dashboard` with session cookie

---

#### GET `/logout`
Destroy user session and logout.

**Response:** Redirect to `/`

---

### Ingredient Endpoints

#### GET `/api/ingredients`
Get all ingredients for the authenticated user.

**Headers:** Requires authentication (session cookie)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Milk",
      "quantity": 1,
      "unit": "litre",
      "category": "Dairy",
      "expiry_date": "2026-04-20",
      "added_date": "2026-04-17",
      "notes": "Full cream"
    }
  ]
}
```

---

#### POST `/api/ingredients`
Add a new ingredient.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "Tomatoes",
  "quantity": 6,
  "unit": "pcs",
  "category": "Vegetables",
  "expiry_date": "2026-04-25",
  "notes": "Fresh from market"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "user_id": 1,
    "name": "Tomatoes",
    "quantity": 6,
    "unit": "pcs",
    "category": "Vegetables",
    "expiry_date": "2026-04-25",
    "added_date": "2026-04-17",
    "notes": "Fresh from market"
  }
}
```

---

#### PUT `/api/ingredients/:id`
Update an existing ingredient.

**Headers:** Requires authentication

**Request Body:** Same as POST

**Response:** Updated ingredient object

---

#### DELETE `/api/ingredients/:id`
Delete an ingredient.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Ingredient deleted successfully."
}
```

---

### Profile Endpoints

#### GET `/profile`
View user profile page.

**Headers:** Requires authentication

**Response:** HTML page

---

#### POST `/profile/update`
Update user profile settings.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "daily_calories": 2200,
  "daily_protein": 60,
  "daily_carbs": 275,
  "daily_fat": 75,
  "serving_size": 2,
  "allergies": "peanuts, shellfish",
  "dietary_preference": "vegetarian"
}
```

**Response:** Redirect to `/profile` with success message

---

### Recipe Endpoints

#### GET `/api/recipes/personalized`
Get personalized recipe recommendations.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": [],
  "userPreferences": {
    "allergies": ["peanuts", "shellfish"],
    "dietary": "vegetarian",
    "servingSize": 2
  }
}
```

---

#### POST `/api/recipes`
Save a recipe.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "Vegetable Stir Fry",
  "ingredients": [
    {"name": "Broccoli", "quantity": 200, "unit": "grams"},
    {"name": "Carrots", "quantity": 150, "unit": "grams"}
  ],
  "instructions": "1. Heat oil...",
  "calories": 250,
  "protein": 8,
  "carbs": 35,
  "fat": 10,
  "servings": 2,
  "allergens": ""
}
```

**Response:**
```json
{
  "success": true,
  "id": 1
}
```

---

### Meal Plan Endpoints

#### GET `/api/mealplan`
Get meal plans for a date range.

**Headers:** Requires authentication

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "recipe_id": 1,
      "meal_date": "2026-04-18",
      "meal_type": "lunch",
      "servings": 2,
      "title": "Vegetable Stir Fry",
      "calories": 250
    }
  ]
}
```

---

#### POST `/api/mealplan`
Add a meal to the plan.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "recipe_id": 1,
  "meal_date": "2026-04-18",
  "meal_type": "lunch",
  "servings": 2
}
```

**Response:**
```json
{
  "success": true,
  "id": 1
}
```

---

### Shopping List Endpoints

#### GET `/api/shopping-list`
Get shopping list items.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "ingredient_name": "Broccoli",
      "quantity": 200,
      "unit": "grams",
      "checked": 0,
      "created_at": "2026-04-17T10:00:00.000Z"
    }
  ]
}
```

---

#### POST `/api/shopping-list`
Add item to shopping list.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "ingredient_name": "Broccoli",
  "quantity": 200,
  "unit": "grams"
}
```

**Response:**
```json
{
  "success": true,
  "id": 1
}
```

---

##  Database Schema

### Tables

1. **users**
   - id (PK)
   - username (UNIQUE)
   - email (UNIQUE)
   - password (hashed)
   - created_at

2. **user_profiles**
   - id (PK)
   - user_id (FK → users.id, UNIQUE)
   - daily_calories
   - daily_protein
   - daily_carbs
   - daily_fat
   - serving_size
   - allergies
   - dietary_preference

3. **ingredients**
   - id (PK)
   - user_id (FK → users.id)
   - name
   - quantity
   - unit
   - category
   - expiry_date
   - added_date
   - notes

4. **recipes**
   - id (PK)
   - user_id (FK → users.id)
   - title
   - ingredients (JSON)
   - instructions
   - calories, protein, carbs, fat, fiber
   - servings
   - allergens
   - created_at

5. **meal_plans**
   - id (PK)
   - user_id (FK → users.id)
   - recipe_id (FK → recipes.id)
   - meal_date
   - meal_type
   - servings
   - created_at

6. **shopping_lists**
   - id (PK)
   - user_id (FK → users.id)
   - ingredient_name
   - quantity
   - unit
   - checked
   - created_at

7. **nutrition_log**
   - id (PK)
   - user_id (FK → users.id)
   - recipe_id (FK → recipes.id)
   - date
   - servings

---

##  Screenshots

*(Add screenshots of your application here)*

1. Landing Page
2. Login/Register
3. Dashboard with Ingredients
4. Profile Settings
5. Recipe Recommendations
6. Rescue My Food Alert

---

##  Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[SRS_OOAD.md](docs/SRS_OOAD.md)** - Software Requirements Specification from Object-Oriented Analysis and Design perspective
- **[SRS_SSAD.md](docs/SRS_SSAD.md)** - Software Requirements Specification from Structured Systems Analysis and Design perspective
- **[product_backlog.md](docs/product_backlog.md)** - Agile product backlog
- **[user_stories.md](docs/user_stories.md)** - User stories
- **[use_case_manage_ingredients.md](docs/use_case_manage_ingredients.md)** - Use case documentation

---

##  Future Enhancements

1. **AI-Powered Recipe Generation**
   - Integration with Claude/GPT for custom recipe creation
   - Generate recipes based on available ingredients

2. **Mobile Application**
   - React Native or Flutter mobile app
   - Barcode scanning for quick ingredient addition

3. **Social Features**
   - Share recipes with friends
   - Community recipe ratings and reviews

4. **Advanced Analytics**
   - Waste reduction metrics
   - Cost tracking
   - Nutrition trend charts

5. **Smart Notifications**
   - Email/SMS alerts for expiring items
   - Meal prep reminders

6. **Integration with Smart Devices**
   - Smart refrigerator integration
   - Voice assistant support (Alexa, Google Home)

7. **Multi-language Support**
   - Internationalization (i18n)
   - Support for multiple languages

---

##  License

This project is developed as part of an academic course and is intended for educational purposes.

---

##  Acknowledgments

- **TheMealDB API** for providing free recipe data
- **Bootstrap** for the UI framework
- **Express.js** community for excellent documentation
- Course instructors and peers for guidance and feedback

---

##  Contact

For questions or feedback, please contact:

- **Sai Mahidhar** - [GitHub](https://github.com/saimahidhar54)
- **Shaik Jani Begum** - [GitHub] (https://github.com/Jani-Begum05)

---

**Made with for Software Engineering Lab 2025-26**
