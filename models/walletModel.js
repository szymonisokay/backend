const mongoose = require('mongoose')

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wallet_points: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Transaction',
    default: [],
  },
})

module.exports = mongoose.model('Wallet', WalletSchema)
