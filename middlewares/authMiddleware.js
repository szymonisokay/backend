const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const auth = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.SECRET)

			req.user = await User.findById(decoded.id).select('-password').populate({ path: 'user_role_id' })

			next()
		} catch (error) {
			console.log(error)

			if (error.name === 'TokenExpiredError') {
				res.status(401)
				throw new Error('Token expired')
			}

			res.status(401)
			throw new Error('Not authorized')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error('Token not passed')
	}
})

module.exports = {
	auth,
}
