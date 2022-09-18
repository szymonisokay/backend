const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const { createTransaction } = require('../controllers/transactionsController')

const router = express.Router()

router.post('/', auth, createTransaction)

module.exports = router
