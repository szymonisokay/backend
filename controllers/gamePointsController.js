const asyncHandler = require('express-async-handler')
const GamePoints = require('../models/gamePointsModel')

const addGamePoints = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user
	const { points } = req.body

	const allUserPoints = await GamePoints.find({ user: userId }).sort({ points: -1 })

	if (allUserPoints.length < 3) {
		await GamePoints.create({ user: userId, points })
		return res.status(201).json({ msg: 'created' })
	}

	const lowestPoints = allUserPoints[2]

	if (lowestPoints.points > points) {
		return res.status(200).json({ msg: 'not enough points' })
	}

	await GamePoints.findByIdAndDelete(lowestPoints._id)

	const gamePoints = await GamePoints.create({ user: userId, points })

	res.status(201).json(gamePoints)
})

const fetchUsersGamePoints = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user

	const usersGamePoints = await GamePoints.find({ user: userId })
		.sort({ points: -1 })
		.populate({ path: 'user', select: '-password' })

	res.status(200).json({ gamePoints: usersGamePoints })
})

const fetchAllGamePoints = asyncHandler(async (req, res) => {
	const allGamePoints = await GamePoints.find({}).sort({ points: -1 }).populate({ path: 'user', select: '-password' })

	res.status(200).json({ gamePoints: allGamePoints })
})

module.exports = {
	addGamePoints,
	fetchUsersGamePoints,
	fetchAllGamePoints,
}
