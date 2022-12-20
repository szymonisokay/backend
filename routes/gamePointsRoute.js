const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const { addGamePoints, fetchUsersGamePoints, fetchAllGamePoints } = require('../controllers/gamePointsController')

const router = express.Router()

router.post('/', auth, addGamePoints)
router.get('/user', auth, fetchUsersGamePoints)
router.get('/', auth, fetchAllGamePoints)

module.exports = router
