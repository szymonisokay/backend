const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const Role = require('../models/rolesModel')
const Wallet = require('../models/walletModel')

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
	const userRole = await Role.findOne({ role_name: 'User' })

	const userData = {
		...req.body,
		user_role_id: userRole._id,
		password: await bcrypt.hash(password, salt),
	}

	const user = await User.create(userData)

	await Wallet.create({ user: user._id })

	const token = jwt.sign({ id: user._id }, process.env.SECRET, {
		expiresIn: '1d',
	})

	const { password: localPassword, ...data } = user._doc

	const newUser = {
		...data,
		token,
	}

	await User.populate(newUser, { path: 'user_role_id' })

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

	await User.populate(newUser, { path: 'user_role_id' })

	res.status(201).json(newUser)
})

module.exports = {
	register,
	login,
}
