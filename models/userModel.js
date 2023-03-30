const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: '',
	},
	user_role_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'role',
	},
})

module.exports = mongoose.model('User', UserSchema)
