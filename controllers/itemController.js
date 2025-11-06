const Item = require("../models/Item");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

/**
 * Create item under category or sub-category.
 * If subCategoryId is provided it will be used; otherwise item is placed directly under category.
 * Also sets tax defaults if required.
 */
exports.createItem = async (req, res, next) => {
  try {
    const {
      name,
      image,
      description,
      taxApplicable,
      tax,
      baseAmount,
      discount,
    } = req.body;
    const { categoryId, subCategoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    let subCategory = null;
    if (subCategoryId) {
      subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory)
        return res
          .status(404)
          .json({ success: false, message: "SubCategory not found" });
    }

    // defaults: if taxApplicable or tax not provided, inherit from subcategory if exists, else category
    let finalTaxApplicable = taxApplicable;
    let finalTax = tax;
    if (finalTaxApplicable === undefined || finalTaxApplicable === null) {
      if (subCategory && subCategory.taxApplicable !== undefined)
        finalTaxApplicable = subCategory.taxApplicable;
      else finalTaxApplicable = category.taxApplicable;
    }
    if (finalTax === undefined || finalTax === null) {
      if (subCategory && subCategory.tax !== undefined)
        finalTax = subCategory.tax;
      else finalTax = category.tax;
    }

    const item = new Item({
      name,
      category: category._id,
      subCategory: subCategory ? subCategory._id : null,
      image,
      description,
      taxApplicable: finalTaxApplicable,
      tax: finalTax,
      baseAmount: Number(baseAmount) || 0,
      discount: Number(discount) || 0,
      // totalAmount will be computed in pre-save hook
    });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all items
 */
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all items under a category (including those in subcategories)
 */
exports.getItemsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const items = await Item.find({ category: categoryId })
      .populate("subCategory", "name")
      .lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all items under a sub-category
 */
exports.getItemsBySubCategory = async (req, res, next) => {
  try {
    const subCategoryId = req.params.subCategoryId;
    const items = await Item.find({ subCategory: subCategoryId }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * Get item by id or name (with attributes)
 */
exports.getItem = async (req, res, next) => {
  try {
    const idOrName = req.params.id;
    let item;
    if (idOrName.match(/^[0-9a-fA-F]{24}$/))
      item = await Item.findById(idOrName)
        .populate("category", "name")
        .populate("subCategory", "name")
        .lean();
    if (!item)
      item = await Item.findOne({ name: idOrName })
        .populate("category", "name")
        .populate("subCategory", "name")
        .lean();
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * Update item attributes
 */
exports.updateItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;

    // If baseAmount or discount present, compute totalAmount before update
    if (update.baseAmount !== undefined || update.discount !== undefined) {
      const existing = await Item.findById(id).lean();
      if (!existing)
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      const base =
        update.baseAmount !== undefined
          ? update.baseAmount
          : existing.baseAmount;
      const disc =
        update.discount !== undefined ? update.discount : existing.discount;
      update.totalAmount = Number(base) - Number(disc);
    }

    const updated = await Item.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Search item by name (case-insensitive, partial)
 */
exports.searchItemsByName = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    // Use regex for partial, case-insensitive match
    const regex = new RegExp(q, "i");
    const items = await Item.find({ name: regex })
      .populate("category", "name")
      .populate("subCategory", "name")
      .lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};
