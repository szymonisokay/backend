const asyncHandler = require('express-async-handler')

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

const addPoints = asyncHandler(async (req, res) => {
  const { points, overwrite } = req.body
  const { _id: userId } = req.user

  const currentWallet = await Wallet.findOne({ user: userId })

  if (!currentWallet) {
    res.status(401)
    throw new Error('Access denied')
  }

  if (overwrite) {
    currentWallet.wallet_points = points
  } else {
    currentWallet.wallet_points += points
  }

  currentWallet.save()

  res.status(200).json(currentWallet)
})

module.exports = {
  getWalletInfo,
  addPoints,
}
