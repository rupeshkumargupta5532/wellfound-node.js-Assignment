const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const Item = require('../models/Item');

/**
 * Create sub-category under a category
 * If taxApplicable/tax omitted, defaults to category's values
 */
exports.createSubCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, image, description } = req.body;
    let { taxApplicable, tax } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ success: false, message: 'Parent category not found' });

    // default behavior
    if (taxApplicable === undefined || taxApplicable === null) {
      taxApplicable = category.taxApplicable;
    }
    if (tax === undefined || tax === null) {
      tax = category.tax;
    }

    const sub = new SubCategory({
      name,
      category: category._id,
      image,
      description,
      taxApplicable,
      tax
    });
    await sub.save();
    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all sub-categories
 */
exports.getAllSubCategories = async (req, res, next) => {
  try {
    const subs = await SubCategory.find().populate('category', 'name').lean();
    res.json({ success: true, data: subs });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all sub-categories under a category
 */
exports.getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const subs = await SubCategory.find({ category: categoryId }).lean();
    res.json({ success: true, data: subs });
  } catch (err) {
    next(err);
  }
};

/**
 * Get sub-category by id or name
 */
exports.getSubCategory = async (req, res, next) => {
  try {
    const idOrName = req.params.id;
    let sub;
    if (idOrName.match(/^[0-9a-fA-F]{24}$/)) sub = await SubCategory.findById(idOrName).lean();
    if (!sub) sub = await SubCategory.findOne({ name: idOrName }).lean();
    if (!sub) return res.status(404).json({ success: false, message: 'Sub-category not found' });

    // include items under this sub-category
    const items = await Item.find({ subCategory: sub._id }).lean();
    sub.items = items;
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * Update sub-category
 */
exports.updateSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updated = await SubCategory.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Sub-category not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
