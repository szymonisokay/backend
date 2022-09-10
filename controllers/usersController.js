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

  const user = await User.findById(userId).select('-password')

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
  console.log(req.body)
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  }).select('-password')

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  res.status(200).json({ msg: 'User updated', user })
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

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { password, changedPassword } = req.body

  if (!password || !changedPassword) {
    res.status(400)
    throw new Error('Please provide all data')
  }

  if (password === changedPassword) {
    res.status(400)
    throw new Error('New password cannot be the same')
  }

  const user = await User.findById(id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    res.status(400)
    throw new Error('Wrong password')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(changedPassword, salt)

  const changedUser = await User.findByIdAndUpdate(
    id,
    { password: hash },
    { new: true }
  )

  res.status(201).json({ msg: 'Password changed', user: changedUser })
})

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
}
