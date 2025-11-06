const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    taxApplicable: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    baseAmount: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }, // computed as baseAmount - discount (controller or pre-save)
  },
  { timestamps: true }
);

// compute totalAmount before saving
ItemSchema.pre("save", function (next) {
  this.totalAmount = Number(this.baseAmount - this.discount || 0);
  next();
});

// Also compute on update via findOneAndUpdate middleware
ItemSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (!update) return next();
  // if baseAmount or discount present, compute totalAmount
  const base = update.baseAmount !== undefined ? update.baseAmount : undefined;
  const disc = update.discount !== undefined ? update.discount : undefined;
  if (base !== undefined || disc !== undefined) {
    // fetch current doc values for missing fields? Simpler: set totalAmount if both present or calculate with available fields
    // We'll compute conservatively: if both provided compute, else let controller handle
    if (base !== undefined && disc !== undefined) {
      update.totalAmount = base - disc;
    }
  }
  next();
});

ItemSchema.index({ name: 1, category: 1, subCategory: 1 });

module.exports = mongoose.model("Item", ItemSchema);
