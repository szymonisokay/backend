const mongoose = require('mongoose')

const FacilitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
})

const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body_html: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    usable_area: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    price_m2: {
      type: Number,
      required: true,
    },
    is_for_purchase: {
      type: Boolean,
      default: true,
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
    },
    construction_year: {
      type: String,
      default: '',
    },
    rooms_num: {
      type: Number,
      required: true,
    },
    land_area: {
      type: String,
      default: '',
    },
    facilities: {
      type: [FacilitySchema],
      default: [],
    },
    parking: {
      is_parking: {
        type: Boolean,
        default: false,
      },
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
        required: true,
      },
      other: {
        type: [String],
        default: [],
      },
    },
    available: {
      type: String,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      zip_code: {
        type: String,
        required: true,
      },
      coords: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
    },
    surroundings: {
      type: String,
      required: true,
    },
    nearby: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Offer', OfferSchema)
