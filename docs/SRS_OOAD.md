# Software Requirements Specification (SRS)
## KitchenMind - Smart Kitchen Management System
### Object-Oriented Analysis and Design (OOAD) Perspective

**Project Team:**
- Sai Mahidhar (25MCMT29)
- Shaik Jani Begum (25MCMT09)

**Course:** M.Tech Computer Science - Software Engineering Lab 2025-26  
**Submission Date:** April 21, 2026

---

## 1. Introduction

### 1.1 Purpose
This SRS document describes the functional and non-functional requirements for KitchenMind, a smart kitchen management system designed to reduce food waste, manage inventory, and provide personalized meal planning with an object-oriented design approach.

### 1.2 Scope
KitchenMind is a web-based application that helps users:
- Manage kitchen inventory with expiry tracking
- Create personalized user profiles with dietary preferences
- Generate recipe recommendations based on available ingredients and user preferences
- Plan meals and generate shopping lists
- Track nutritional intake

### 1.3 Definitions and Acronyms
- **OOAD**: Object-Oriented Analysis and Design
- **CRUD**: Create, Read, Update, Delete
- **SRS**: Software Requirements Specification
- **UML**: Unified Modeling Language

---

## 2. Overall Description

### 2.1 Product Perspective
KitchenMind is a standalone web application built using:
- **Backend**: Node.js with Express.js
- **Database**: SQLite with better-sqlite3
- **Frontend**: EJS templates with Bootstrap 5
- **Architecture**: MVC (Model-View-Controller) pattern

### 2.2 Product Functions
1. User authentication and authorization
2. Ingredient inventory management
3. User profile and preference management
4. Recipe recommendation engine
5. Meal planning system
6. Shopping list generation
7. Nutrition tracking

### 2.3 User Classes and Characteristics
- **End Users**: Home cooks who want to manage their kitchen efficiently
- **Characteristics**: Basic computer literacy, smartphone/web browser access

---

## 3. Object-Oriented Analysis

### 3.1 Core Domain Objects

#### 3.1.1 User
**Attributes:**
- id: Integer (Primary Key)
- username: String (Unique)
- email: String (Unique)
- password: String (Hashed)
- created_at: DateTime

**Responsibilities:**
- Authenticate credentials
- Manage session
- Own ingredients, recipes, and meal plans

**Relationships:**
- Has one UserProfile
- Has many Ingredients
- Has many Recipes
- Has many MealPlans
- Has many ShoppingListItems

#### 3.1.2 UserProfile
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- daily_calories: Integer
- daily_protein: Integer
- daily_carbs: Integer
- daily_fat: Integer
- serving_size: Integer
- allergies: String (comma-separated)
- dietary_preference: String

**Responsibilities:**
- Store user nutritional goals
- Manage dietary restrictions
- Provide serving size preferences

**Relationships:**
- Belongs to one User

#### 3.1.3 Ingredient
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- name: String
- quantity: Float
- unit: String
- category: String
- expiry_date: Date
- added_date: Date
- notes: String

**Responsibilities:**
- Track inventory levels
- Monitor expiry dates
- Categorize food items
- Alert on near-expiry

**Relationships:**
- Belongs to one User
- Can be part of many Recipes

#### 3.1.4 Recipe
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- title: String
- ingredients: JSON (Array of ingredient objects)
- instructions: Text
- calories: Float
- protein: Float
- carbs: Float
- fat: Float
- fiber: Float
- servings: Integer
- allergens: String
- created_at: DateTime

**Responsibilities:**
- Store recipe information
- Calculate nutritional values
- Scale servings
- Check allergen compatibility

**Relationships:**
- Belongs to one User
- Can be in many MealPlans
- References many Ingredients

#### 3.1.5 MealPlan
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- recipe_id: Integer (Foreign Key)
- meal_date: Date
- meal_type: String (breakfast, lunch, dinner, snack)
- servings: Integer
- created_at: DateTime

**Responsibilities:**
- Schedule meals
- Track planned consumption
- Generate shopping lists

**Relationships:**
- Belongs to one User
- References one Recipe

#### 3.1.6 ShoppingListItem
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- ingredient_name: String
- quantity: Float
- unit: String
- checked: Boolean
- created_at: DateTime

**Responsibilities:**
- Track items to purchase
- Mark items as purchased
- Aggregate quantities

**Relationships:**
- Belongs to one User

#### 3.1.7 NutritionLog
**Attributes:**
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- recipe_id: Integer (Foreign Key)
- date: Date
- servings: Float

**Responsibilities:**
- Track consumed meals
- Calculate daily nutrition totals

**Relationships:**
- Belongs to one User
- References one Recipe

---

### 3.2 Class Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ - id            │
│ - username      │
│ - email         │
│ - password      │
│ - created_at    │
├─────────────────┤
│ + authenticate()│
│ + register()    │
│ + logout()      │
└────────┬────────┘
         │ 1
         │
         │ 1
┌────────┴────────┐
│  UserProfile    │
├─────────────────┤
│ - daily_calories│
│ - allergies     │
│ - serving_size  │
├─────────────────┤
│ + updateGoals() │
└─────────────────┘

         │ 1
         │
         │ *
┌────────┴────────┐
│   Ingredient    │
├─────────────────┤
│ - name          │
│ - quantity      │
│ - expiry_date   │
├─────────────────┤
│ + isExpiring()  │
│ + update()      │
└─────────────────┘

         │ 1
         │
         │ *
┌────────┴────────┐
│     Recipe      │
├─────────────────┤
│ - title         │
│ - ingredients   │
│ - calories      │
├─────────────────┤
│ + scaleServing()│
│ + checkAllergy()│
└─────────────────┘

         │ 1
         │
         │ *
┌────────┴────────┐
│   MealPlan      │
├─────────────────┤
│ - meal_date     │
│ - meal_type     │
├─────────────────┤
│ + schedule()    │
└─────────────────┘
```

---

### 3.3 Use Case Diagram

**Actors:**
- User (Authenticated)
- Guest (Unauthenticated)

**Use Cases:**

1. **Authentication**
   - Register Account
   - Login
   - Logout

2. **Inventory Management**
   - Add Ingredient
   - Update Ingredient
   - Delete Ingredient
   - View Ingredients
   - Search/Filter Ingredients
   - View Expiring Items

3. **Profile Management**
   - View Profile
   - Update Nutritional Goals
   - Set Allergies
   - Set Dietary Preferences
   - Set Serving Size

4. **Recipe Management**
   - Browse Recipes
   - View Recipe Details
   - Save Recipe
   - Get Personalized Recommendations

5. **Meal Planning**
   - Create Meal Plan
   - View Meal Plan
   - Delete Meal Plan Entry
   - Generate Shopping List from Meal Plan

6. **Shopping List**
   - Add Item to Shopping List
   - Mark Item as Purchased
   - Remove Item from Shopping List
   - Clear Purchased Items

---

### 3.4 Sequence Diagrams

#### 3.4.1 User Registration Sequence

```
User -> Browser: Enter registration details
Browser -> Server: POST /register
Server -> Database: Check if user exists
Database -> Server: User not found
Server -> BCrypt: Hash password
BCrypt -> Server: Hashed password
Server -> Database: INSERT user
Database -> Server: User created
Server -> Database: INSERT default profile
Database -> Server: Profile created
Server -> Browser: Redirect to login
Browser -> User: Show success message
```

#### 3.4.2 Add Ingredient Sequence

```
User -> Browser: Click "Add Ingredient"
Browser -> User: Show modal form
User -> Browser: Fill ingredient details
Browser -> Server: POST /api/ingredients
Server -> Middleware: Check authentication
Middleware -> Server: User authenticated
Server -> Database: INSERT ingredient with user_id
Database -> Server: Ingredient created
Server -> Browser: Return success JSON
Browser -> User: Update UI, show toast
```

#### 3.4.3 Get Personalized Recipes Sequence

```
User -> Browser: Request recipes
Browser -> Server: GET /api/recipes/personalized
Server -> Database: Get user profile
Database -> Server: Profile data
Server -> Database: Get user ingredients
Database -> Server: Ingredients list
Server -> RecipeEngine: Filter by allergies & preferences
RecipeEngine -> Server: Filtered recipes
Server -> Browser: Return recipes JSON
Browser -> User: Display recipe cards
```

---

### 3.5 State Diagrams

#### 3.5.1 Ingredient State Diagram

```
[New] -> [Fresh] -> [Use Soon] -> [Urgent] -> [Expired]
  │         │           │            │           │
  └─────────┴───────────┴────────────┴───────────┘
                      │
                  [Deleted]
```

#### 3.5.2 User Session State Diagram

```
[Guest] --register--> [Registered] --login--> [Authenticated]
   │                                              │
   └──────────────────────────────────────────────┘
                      logout
```

---

## 4. Design Patterns Applied

### 4.1 MVC (Model-View-Controller)
- **Model**: Database schemas and business logic
- **View**: EJS templates
- **Controller**: Express route handlers

### 4.2 Middleware Pattern
- Authentication middleware (`isLoggedIn`, `isGuest`)
- Session management middleware
- Flash message middleware

### 4.3 Repository Pattern
- Database access abstracted through `getDb()` function
- Prepared statements for SQL queries

### 4.4 Factory Pattern
- Session creation and management
- Password hashing with bcrypt

---

## 5. Functional Requirements

### 5.1 User Authentication (FR-AUTH)
- FR-AUTH-01: System shall allow users to register with username, email, and password
- FR-AUTH-02: System shall validate email format and password strength
- FR-AUTH-03: System shall hash passwords before storage
- FR-AUTH-04: System shall authenticate users with email and password
- FR-AUTH-05: System shall maintain user sessions
- FR-AUTH-06: System shall allow users to logout

### 5.2 Ingredient Management (FR-ING)
- FR-ING-01: System shall allow users to add ingredients with name, quantity, unit, category, expiry date
- FR-ING-02: System shall allow users to update ingredient details
- FR-ING-03: System shall allow users to delete ingredients
- FR-ING-04: System shall display ingredients sorted by expiry date
- FR-ING-05: System shall categorize ingredients (Dairy, Vegetables, Meat, etc.)
- FR-ING-06: System shall alert users of items expiring within 3 days
- FR-ING-07: System shall allow search and filter by name and category

### 5.3 User Profile (FR-PROF)
- FR-PROF-01: System shall create default profile on user registration
- FR-PROF-02: System shall allow users to set daily nutritional goals
- FR-PROF-03: System shall allow users to specify allergies
- FR-PROF-04: System shall allow users to set dietary preferences
- FR-PROF-05: System shall allow users to set serving size (number of people)

### 5.4 Recipe Management (FR-REC)
- FR-REC-01: System shall fetch recipes from external API
- FR-REC-02: System shall filter recipes based on user allergies
- FR-REC-03: System shall filter recipes based on dietary preferences
- FR-REC-04: System shall scale recipe servings based on user preference
- FR-REC-05: System shall allow users to save recipes
- FR-REC-06: System shall display nutritional information for recipes

### 5.5 Meal Planning (FR-MEAL)
- FR-MEAL-01: System shall allow users to schedule meals by date and type
- FR-MEAL-02: System shall display meal plans in calendar view
- FR-MEAL-03: System shall allow users to delete meal plan entries
- FR-MEAL-04: System shall generate shopping lists from meal plans

### 5.6 Shopping List (FR-SHOP)
- FR-SHOP-01: System shall allow users to add items to shopping list
- FR-SHOP-02: System shall allow users to mark items as purchased
- FR-SHOP-03: System shall allow users to delete items
- FR-SHOP-04: System shall aggregate duplicate items
- FR-SHOP-05: System shall allow clearing all purchased items

---

## 6. Non-Functional Requirements

### 6.1 Performance (NFR-PERF)
- NFR-PERF-01: Page load time shall not exceed 2 seconds
- NFR-PERF-02: API response time shall not exceed 500ms
- NFR-PERF-03: System shall support 100 concurrent users

### 6.2 Security (NFR-SEC)
- NFR-SEC-01: Passwords shall be hashed using bcrypt
- NFR-SEC-02: Sessions shall expire after 7 days of inactivity
- NFR-SEC-03: SQL injection shall be prevented using prepared statements
- NFR-SEC-04: User data shall be isolated per user account

### 6.3 Usability (NFR-USE)
- NFR-USE-01: Interface shall be responsive on mobile and desktop
- NFR-USE-02: Forms shall provide validation feedback
- NFR-USE-03: Success/error messages shall be displayed via toasts

### 6.4 Reliability (NFR-REL)
- NFR-REL-01: System uptime shall be 99%
- NFR-REL-02: Database transactions shall be atomic

### 6.5 Maintainability (NFR-MAIN)
- NFR-MAIN-01: Code shall follow MVC architecture
- NFR-MAIN-02: Routes shall be modularized
- NFR-MAIN-03: Database schema shall support migrations

---

## 7. System Architecture

### 7.1 Layered Architecture

```
┌─────────────────────────────────────┐
│     Presentation Layer (Views)      │
│         EJS Templates               │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│    Application Layer (Controllers)  │
│      Express Route Handlers         │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│     Business Logic Layer            │
│   Middleware & Validation           │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│      Data Access Layer              │
│      Database Queries               │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│       Database Layer                │
│         SQLite                      │
└─────────────────────────────────────┘
```

---

## 8. Database Schema (ER Diagram)

```
┌─────────────┐       ┌──────────────┐
│    users    │1─────1│user_profiles │
├─────────────┤       ├──────────────┤
│ id (PK)     │       │ id (PK)      │
│ username    │       │ user_id (FK) │
│ email       │       │ daily_cal    │
│ password    │       │ allergies    │
└──────┬──────┘       └──────────────┘
       │1
       │
       │*
┌──────┴──────┐
│ ingredients │
├─────────────┤
│ id (PK)     │
│ user_id(FK) │
│ name        │
│ expiry_date │
└─────────────┘

       │1
       │
       │*
┌──────┴──────┐       ┌──────────────┐
│   recipes   │*─────*│  meal_plans  │
├─────────────┤       ├──────────────┤
│ id (PK)     │       │ id (PK)      │
│ user_id(FK) │       │ user_id (FK) │
│ title       │       │ recipe_id(FK)│
│ ingredients │       │ meal_date    │
└─────────────┘       └──────────────┘

       │1
       │
       │*
┌──────┴──────────┐
│ shopping_lists  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ ingredient_name │
│ checked         │
└─────────────────┘
```

---

## 9. Conclusion

This SRS document provides a comprehensive object-oriented analysis and design for the KitchenMind system. The design emphasizes:
- Clear separation of concerns through MVC architecture
- Strong encapsulation with well-defined domain objects
- Scalable and maintainable code structure
- User-centric features with personalization

The system is designed to be extensible for future enhancements such as AI-powered recipe generation, social sharing, and mobile applications.

---

**Document Version:** 1.0  
**Last Updated:** April 17, 2026
