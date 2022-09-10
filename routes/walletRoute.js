const express = require('express')
const { auth } = require('../middlewares/authMiddleware')

const { getWalletInfo, addCredits } = require('../controllers/walletController')

const router = express.Router()

router.get('/', auth, getWalletInfo)
router.put('/', auth, addCredits)

module.exports = router
