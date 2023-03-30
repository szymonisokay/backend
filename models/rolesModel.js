const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
	role_name: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('role', RoleSchema)
