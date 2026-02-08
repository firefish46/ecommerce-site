// backend/models/productModel.js

import mongoose from 'mongoose';
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true, default: 'Generic' },
    // --- ADD THIS FIELD ---
    category: { 
      type: String, 
      required: true,
      default: 'Electronics' // Providing a default helps avoid errors for old items
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;