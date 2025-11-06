
## Setup (local)
1. Clone repository
2. `cd menu-backend`
3. `cp .env.example .env` and update `MONGO_URI` (use MongoDB Atlas or local)
4. `npm install`
5. `npm run dev` (requires nodemon) or `npm start`

Default server: `http://localhost:3000`

## Important routes

### Categories
- `POST /api/categories`
  - body: `{ "name":"Beverages", "image":"http://...", "description":"", "taxApplicable": true, "tax": 5, "taxType":"percentage" }`
- `GET /api/categories`
- `GET /api/categories/:idOrName?expand=true` // set expand=true to include subcategories and items
- `PUT /api/categories/:id` // update

### Sub-categories
- `POST /api/subcategories/:categoryId`
  - body: `{ "name":"Hot Drinks", "image":"", "description":"", "taxApplicable": true, "tax": 5 }`
  - Omitting tax fields inherits from category.
- `GET /api/subcategories`
- `GET /api/subcategories/by-category/:categoryId`
- `GET /api/subcategories/:idOrName`
- `PUT /api/subcategories/:id`

### Items
- `POST /api/items/:categoryId` (create under category)
- `POST /api/items/:categoryId/:subCategoryId` (create under subcategory)
  - body example:
    ```
    {
      "name": "Cappuccino",
      "image": "https://...",
      "description": "Hot coffee",
      "baseAmount": 150,
      "discount": 10
    }
    ```
  - tax fields optional; inheritance applied.
- `GET /api/items`
- `GET /api/items/by-category/:categoryId`
- `GET /api/items/by-subcategory/:subCategoryId`
- `GET /api/items/:idOrName`
- `PUT /api/items/:id`
- `GET /api/items/search/name?q=capp` // search



## 📘 Short Answers

### 1️⃣ Which database you have chosen and why?
I choose **MongoDB** because it offers flexibility with a schema-less structure, making it ideal for hierarchical data like categories, subcategories, and items. It also integrates seamlessly with Node.js using **Mongoose**, which simplifies data modeling and CRUD operations.

### 2️⃣ Three things that you learned from this assignment
1. How to design and structure **RESTful APIs** with proper relationships between entities.  
2. How to handle **CRUD operations and nested relationships** efficiently using MongoDB and Mongoose.  
3. The importance of **clear documentation** and testing APIs using Postman.

### 3️⃣ What was the most difficult part of the assignment?
The most challenging part was managing **nested relationships** between Category, Subcategory, and Items — especially while retrieving and updating them together in a structured format.

### 4️⃣ What you would have done differently given more time?
With more time, I would have:  
- Implemented **authentication and role-based access control** for admin and users.  
- Added **unit tests** for each endpoint.  
- Deployed the project on a live server with a simple **frontend dashboard** for visualization.
