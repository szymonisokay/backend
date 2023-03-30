const asyncHandler = require('express-async-handler')
const Role = require('../models/rolesModel')

const createRole = asyncHandler(async (req, res) => {
	const { role_name } = req.body

	const roleExists = await Role.find({ role_name })

	if (roleExists) {
		res.status(400)
		throw new Error('Role already exists.')
	}

	const role = await Role.create({ role_name })

	res.status(200).json(role)
})

module.exports = {
	createRole,
}
