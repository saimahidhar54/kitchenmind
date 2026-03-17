# USE CASE SPECIFICATION for KitchenMind

---

| Field | Details |
|-------|---------|
| **Use Case ID** | KM-UC-01 |
| **Use Case Name** | Manage Ingredients |
| **Created By** | Sai Mahidhar (25MCMT29) |
| **Last Updated By** | Shaik Jani Begum (25MCMT09) |
| **Date Created** | 16-03-2026 |
| **Date Last Updated** | 16-03-2026 |

---

## Actors
- **Primary Actor:** User (Household member / Cook)

## Description
This use case allows a registered user to manage their kitchen ingredient inventory. The user can **add**, **view**, **edit**, and **delete** ingredients. Each ingredient has a name, quantity, unit, category, and expiry date. The system provides color-coded visual alerts based on expiry urgency to help users identify items that need to be consumed soon.

## Trigger
The user navigates to the KitchenMind Inventory Dashboard after logging in.

## Preconditions
1. The user must be registered and logged into the system.
2. The database is operational and accessible.
3. The Inventory Dashboard page is loaded successfully.

## Post-conditions
1. The ingredient inventory is updated in the database to reflect the user's action (add/edit/delete).
2. The dashboard displays the updated list of ingredients with correct expiry-based color codes.

---

## Normal Flow (Add Ingredient)

| Step | Actor | System |
|------|-------|--------|
| 1 | User clicks the "Add Ingredient" button on the dashboard. | |
| 2 | | System displays the "Add Ingredient" modal form with fields: Name, Quantity, Unit, Category (dropdown), Expiry Date (date picker). |
| 3 | User fills in all required fields and clicks "Save". | |
| 4 | | System validates input (all fields required, expiry date must be today or future). |
| 5 | | System sends a POST request to `/api/ingredients` with the ingredient data. |
| 6 | | System stores the ingredient in the SQL database. |
| 7 | | System closes the modal, refreshes the ingredient list, and displays the new ingredient card with the appropriate color code. |
| 8 | | System shows a success toast notification: "Ingredient added successfully!" |

---

## Alternative Flows

### AF1: Edit Ingredient

| Step | Actor | System |
|------|-------|--------|
| 1 | User clicks the "Edit" icon on an existing ingredient card. | |
| 2 | | System displays the "Edit Ingredient" modal pre-filled with the current data. |
| 3 | User modifies the desired fields and clicks "Update". | |
| 4 | | System validates input. |
| 5 | | System sends a PUT request to `/api/ingredients/:id`. |
| 6 | | System updates the record in the database. |
| 7 | | System closes the modal, refreshes the ingredient list with updated data. |
| 8 | | System shows a success toast: "Ingredient updated successfully!" |

### AF2: Delete Ingredient

| Step | Actor | System |
|------|-------|--------|
| 1 | User clicks the "Delete" icon on an ingredient card. | |
| 2 | | System displays a confirmation dialog: "Are you sure you want to delete this ingredient?" |
| 3 | User clicks "Confirm". | |
| 4 | | System sends a DELETE request to `/api/ingredients/:id`. |
| 5 | | System removes the record from the database. |
| 6 | | System refreshes the ingredient list and shows a success toast: "Ingredient deleted." |

### AF3: User Cancels Action

| Step | Actor | System |
|------|-------|--------|
| 1 | User clicks "Cancel" or closes the modal at any point. | |
| 2 | | System closes the modal. No changes are made to the database. |

---

## Exceptions

| Exception ID | Condition | System Response |
|-------------|-----------|-----------------|
| E1 | Validation fails (missing fields or invalid expiry date) | System highlights the invalid fields in red and displays an error message. Modal remains open. |
| E2 | Database connection failure | System shows an error toast: "Unable to save. Please try again later." |
| E3 | Network/API request fails | System shows an error toast: "Network error. Please check your connection." |
| E4 | Duplicate ingredient name detected | System warns user: "An ingredient with this name already exists. Do you want to update it?" |

---

## Additional Details

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Frequency of Use** | Very High (daily usage expected) |
| **Business Rules** | 1. Ingredient names must be unique per user. 2. Expiry dates cannot be in the past when adding new items. 3. Quantity must be a positive number. |
| **Assumptions** | 1. Users manually enter expiry dates (Version 1.0 — no barcode/receipt scanning). 2. All ingredient data is stored locally in the SQL database. 3. The system operates as a single-user application in Version 1.0. |
| **Open Issues** | 1. Should we support bulk ingredient addition (e.g., from a grocery receipt)? 2. Should category list be predefined or user-customizable? |

---

## Analysis Classes (Iteration 1)

| Type | Classes |
|------|---------|
| **Entity** | User, Ingredient, Category |
| **Boundary** | InventoryDashboard, AddIngredientModal, EditIngredientModal, DeleteConfirmationDialog |
| **Control** | IngredientController, ValidationService |
