const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body_html: {
      type: String,
      required: true,
    },
    images: {
      featured: {
        type: String,
        default: '',
      },
      other: {
        type: [String],
        default: [],
      },
    },
    product_type: {
      type: String,
      enum: ['Physical', 'Virtual', 'Downloadable'],
    },
    product_category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Sold', 'On Backorder'],
      default: 'Inactive',
    },
    available_qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    price_unit: {
      type: String,
      enum: ['USD', 'EUR', 'PLN'],
      default: 'USD',
    },
    price_symbol: {
      type: String,
      enum: ['$', '€', 'zł'],
      default: '$',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', ProductSchema)
