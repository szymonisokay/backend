const express = require('express')
const {
  createOffer,
  getOffers,
  getOffer,
  deleteAll,
} = require('../controllers/offersController')
const { auth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', auth, createOffer)
router.get('/', getOffers)
router.get('/:id', getOffer)
router.delete('/', auth, deleteAll)

module.exports = router
