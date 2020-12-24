const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    salePrice: { type: Number },
    images: [{ image: { type: String } }],
    quantity: { type: Number, required: true },
    sold: {
      type: Number,
    },
    ratingQuantity: {
      type: Number,
    },
    ratingArg: {
      type: Number,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
