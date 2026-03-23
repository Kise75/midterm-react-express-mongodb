const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: 'price must be greater than 0',
      },
    },
    image: {
      type: String,
      required: [true, 'image is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'stock is required'],
      min: [0, 'stock must be greater than or equal to 0'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
