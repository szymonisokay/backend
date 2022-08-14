const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'In progress', 'Paid', 'Canceled'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Transaction', TransactionSchema)
