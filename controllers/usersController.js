const User = require('../models/userModel')
const Offer = require('../models/offerModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { environment } = require('../environment/environment')

const getUsers = asyncHandler(async (req, res) => {
	if (req.user.user_role_id.role_name !== 'Admin') {
		res.status(401)
		throw new Error('Access denied')
	}

	const users = await User.find({}).select('-password').populate('user_role_id')

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

const getUserWithOffers = asyncHandler(async (req, res) => {
	const { id: userId } = req.params

	const user = await User.findById(userId).select('-password')

	if (!user) {
		res.status(400)
		throw new Error('User not found')
	}

	const offers = await Offer.find({ user: userId })

	const userWithOffers = {
		...user._doc,
		offers,
	}

	res.status(200).json(userWithOffers)
})

const updateUser = asyncHandler(async (req, res) => {
	const { id: userId } = req.params

	if (req.user.user_role_id.role_name !== 'Admin' && userId !== req.user._id.toString()) {
		res.status(401)
		throw new Error('Access denied')
	}

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

	if (req.user.user_role_id.role_name !== 'Admin' && userId !== req.user._id.toString()) {
		res.status(401)
		throw new Error('Access denied')
	}

	const user = await User.findByIdAndDelete(userId).select('-password')

	if (!user) {
		res.status(400)
		throw new Error('User not found')
	}

	await Offer.deleteMany({ user: user._id })

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

	const changedUser = await User.findByIdAndUpdate(id, { password: hash }, { new: true })

	res.status(201).json({ msg: 'Password changed', user: changedUser })
})

const uploadAvatar = asyncHandler(async (req, res) => {
	const parsedPath = environment.baseUrl + '/' + req.file.path.split('\\').join('/')

	const file = {
		...req.file,
		path: parsedPath,
	}

	const user = await User.findByIdAndUpdate(req.user._id, { image: file.path }, { new: true }).select('-password')

	res.status(201).json(user)
})

module.exports = {
	getUsers,
	getUser,
	getUserWithOffers,
	updateUser,
	deleteUser,
	changePassword,
	uploadAvatar,
}
