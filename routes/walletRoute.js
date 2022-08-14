const express = require('express')
const { auth } = require('../middlewares/authMiddleware')

const { getWalletInfo, addPoints } = require('../controllers/walletController')

const router = express.Router()

router.get('/', auth, getWalletInfo)
router.put('/', auth, addPoints)

module.exports = router
