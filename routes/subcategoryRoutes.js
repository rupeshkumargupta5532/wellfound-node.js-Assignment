const express = require('express');
const router = express.Router();
const subController = require('../controllers/subcategoryController');

// Create a subcategory under a category
router.post('/:categoryId', subController.createSubCategory);

// Get all sub-categories
router.get('/', subController.getAllSubCategories);

// Get sub-categories under a category
router.get('/by-category/:categoryId', subController.getSubCategoriesByCategory);

// Get a sub-category by id or name
router.get('/:id', subController.getSubCategory);

// Update sub-category
router.put('/:id', subController.updateSubCategory);

module.exports = router;
