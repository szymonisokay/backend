const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const getUsers = asyncHandler(async (req, res) => {
  if (!req.user.is_admin) {
    res.status(401)
    throw new Error('Access denied')
  }

  const users = await User.find({})

  res.status(200).json(users)
})

const getUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  res.status(200).json(user)
})

const updateUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params

  if (!req.user.is_admin && userId !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Access denied')
  }

  if (req.body.email) {
    res.status(400)
    throw new Error("Email can't be changed")
  }

  let userData

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10)

    userData = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, salt),
    }
  } else {
    userData = { ...req.body }
  }

  const user = await User.findByIdAndUpdate(userId, userData, { new: true })

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  res.status(200).json(user)
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params

  if (!req.user.is_admin && userId !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Access denied')
  }

  const user = await User.findByIdAndDelete(userId)

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  res.status(200).json(user)
})

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
}
