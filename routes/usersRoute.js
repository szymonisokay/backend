const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
	getUser,
	getUsers,
	getUserWithOffers,
	updateUser,
	deleteUser,
	changePassword,
	uploadAvatar,
} = require('../controllers/usersController')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/avatars')
	},
	filename: function (req, file, cb) {
		cb(null, Math.round(Math.random() * 1e9) + '-' + file.originalname)
	},
})
const upload = multer({ storage })

const router = express.Router()

router.get('/', auth, getUsers)
router.get('/:id', auth, getUser)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)
router.get('/userWithOffers/:id', auth, getUserWithOffers)
router.put('/changePassword/:id', auth, changePassword)
router.post('/upload', auth, upload.single('avatar'), uploadAvatar)

module.exports = router
