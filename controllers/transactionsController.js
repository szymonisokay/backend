const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const Wallet = require('../models/walletModel')
const Offer = require('../models/offerModel')

const createTransaction = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user
  const { offer: offerId } = req.body

  const wallet = await Wallet.findOne({ user: userId })

  if (!wallet) {
    res.status(401)
    throw new Error('Access denied')
  }

  const offer = await Offer.findById(offerId)

  if (!offer) {
    res.status(404)
    throw new Error('Offer not found')
  }

  if (offer.price > wallet.wallet_points) {
    res.status(400)
    throw new Error('Insufficient credits in your account')
  }

  const transaction = await Transaction.create({
    user: userId,
    offer: offerId,
    status: 'Paid',
  })

  const updatedWallet = await Wallet.findOneAndUpdate(
    { user: userId },
    {
      $push: { transactions: transaction._id },
      $inc: { wallet_points: -offer.price },
    },
    { new: true }
  )

  res
    .status(200)
    .json({ msg: 'Offer purchased successfully', wallet: updatedWallet })
})

module.exports = {
  createTransaction,
}
