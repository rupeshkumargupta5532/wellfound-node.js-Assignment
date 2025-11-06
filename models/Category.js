const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image: { type: String, default: '' }, // URL
  description: { type: String, default: '' },
  taxApplicable: { type: Boolean, default: false },
  tax: { type: Number, default: 0 }, // percent or value as you choose
  taxType: { type: String, enum: ['percentage', 'flat', 'unknown'], default: 'unknown' }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
