const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('Please provide all data')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const userData = {
    ...req.body,
    password: await bcrypt.hash(password, salt),
  }

  const user = await User.create(userData)

  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: '1d',
  })

  const { password: localPassword, ...data } = user._doc

  const newUser = {
    ...data,
    token,
  }

  res.status(201).json(newUser)
})

const login = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide all data')
  }

  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    res.status(400)
    throw new Error('Password do not match')
  }

  const tokenOptions = !!remember ? {} : { expiresIn: '1d' }

  const token = jwt.sign({ id: user._id }, process.env.SECRET, tokenOptions)

  const { password: localPassword, ...data } = user._doc

  const newUser = {
    ...data,
    token,
  }

  res.status(201).json(newUser)
})

module.exports = {
  register,
  login,
}
