const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Create item under category or subcategory
// POST /api/items/:categoryId           -> create item directly under category
// POST /api/items/:categoryId/:subCategoryId  -> create item under sub-category
router.post("/:categoryId", itemController.createItem);
router.post("/:categoryId/:subCategoryId", itemController.createItem);

// Get all items
router.get("/", itemController.getAllItems);

// Get all items under a category
router.get("/by-category/:categoryId", itemController.getItemsByCategory);

// Get all items under a sub-category
router.get(
  "/by-subcategory/:subCategoryId",
  itemController.getItemsBySubCategory
);

// Get item by id or name
router.get("/:id", itemController.getItem);

// Update item
router.put("/:id", itemController.updateItem);

// Search items by name: /api/items/search?q=burger
router.get("/search/name", itemController.searchItemsByName);

module.exports = router;
