const mongoose = require('mongoose')

const GamePointsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		points: {
			type: Number,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('GamePoints', GamePointsSchema)
