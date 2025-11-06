const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by id or name. Add ?expand=true to include subcategories & items
router.get('/:id', categoryController.getCategory);

// Update category by id
router.put('/:id', categoryController.updateCategory);

module.exports = router;
