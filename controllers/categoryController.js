const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');

/**
 * Create a category
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, description, taxApplicable, tax, taxType } = req.body;
    const category = new Category({
      name, image, description,
      taxApplicable: !!taxApplicable,
      tax: tax || 0,
      taxType: taxType || 'unknown'
    });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a category by ID or name along with its subcategories and items (nested)
 * Query param: ?expand=true will include subcategories and items
 */
exports.getCategory = async (req, res, next) => {
  try {
    const idOrName = req.params.id; // could be id or name
    let category;
    if (idOrName.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrName).lean();
    } 
    if (!category) {
      category = await Category.findOne({ name: idOrName }).lean();
    }
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (req.query.expand === 'true') {
      // fetch subcategories and items
      const subcategories = await SubCategory.find({ category: category._id }).lean();
      const itemsUnderCategory = await Item.find({ category: category._id, subCategory: null }).lean();
      const itemsBySub = {};
      for (const sc of subcategories) {
        itemsBySub[sc._id] = await Item.find({ subCategory: sc._id }).lean();
      }
      category.subcategories = subcategories;
      category.itemsUnderCategory = itemsUnderCategory;
      category.itemsBySubCategory = itemsBySub;
    }

    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * Update category
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updated = await Category.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
