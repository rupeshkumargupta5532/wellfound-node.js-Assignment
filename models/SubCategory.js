const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  taxApplicable: { type: Boolean }, // default handled in controller when creating
  tax: { type: Number } // default handled in controller
}, { timestamps: true });

SubCategorySchema.index({ name: 1, category: 1 }, { unique: true }); // prevent duplicate sub-category names in same category

module.exports = mongoose.model('SubCategory', SubCategorySchema);
