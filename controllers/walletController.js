const asyncHandler = require('express-async-handler')
const { getCreditsValue, isCouponValid } = require('../config/credits')

const Wallet = require('../models/walletModel')

const getWalletInfo = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user

  const currentWallet = await Wallet.findOne({ user: userId })

  if (!currentWallet) {
    res.status(401)
    throw new Error('Access denied')
  }

  res.status(200).json(currentWallet)
})

const addCredits = asyncHandler(async (req, res) => {
  const { coupon } = req.body
  const { _id: userId } = req.user

  const currentWallet = await Wallet.findOne({ user: userId })

  if (!currentWallet) {
    res.status(401)
    throw new Error('Access denied')
  }

  if (!isCouponValid(coupon)) {
    res.status(400)
    throw new Error('Invalid coupon')
  }

  const credits = getCreditsValue(coupon)

  const updatedWallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { $inc: { wallet_points: credits } },
    { new: true }
  )

  res.status(200).json({
    msg: 'Credits have been added to your account',
    wallet: updatedWallet,
  })
})

module.exports = {
  getWalletInfo,
  addCredits,
}
