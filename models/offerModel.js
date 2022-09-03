const mongoose = require('mongoose')

const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
      // required: true,
    },
    description: {
      type: String,
      default: '',
      // required: true,
    },
    area: {
      type: Number,
      default: 0,
      // required: true,
    },
    land_area: {
      type: Number,
      default: 0,
      // required: true,
    },
    price: {
      type: Number,
      default: 0,
      // required: true,
    },
    is_for_rent: {
      type: Boolean,
      default: false,
    },
    price_month: {
      type: Number,
      default: 0,
    },
    property_type: {
      type: String,
      default: '',
      // required: true,
    },
    construction_year: {
      type: String,
      default: '',
      // required: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    is_parking: {
      type: Boolean,
      default: false,
      // required: true,
    },
    parking: {
      parking_type: {
        type: String,
        default: '',
      },
      parking_num: {
        type: Number,
        default: 0,
      },
    },
    images: {
      featured: {
        type: String,
        default: '',
        // required: true,
      },
      other: {
        type: [String],
        default: [],
      },
    },
    available: {
      type: String,
      default: '',
      // required: true,
    },
    location: {
      country: {
        type: String,
        default: '',
        // required: true,
      },
      city: {
        type: String,
        default: '',
        // required: true,
      },
      street: {
        type: String,
        default: '',
        // required: true,
      },
      zip_code: {
        type: String,
        default: '',
        // required: true,
      },
      coords: {
        lat: {
          type: Number,
          default: 0,
          // required: true,
        },
        lng: {
          type: Number,
          default: 0,
          // required: true,
        },
      },
    },
    surroundings: {
      type: String,
      default: '',
      // required: true,
    },
    nearby: {
      type: String,
      default: '',
      // required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Offer', OfferSchema)
