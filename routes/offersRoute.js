const express = require('express')
const {
  createOffer,
  getOffer,
  getOffers,
  getUserOffers,
  updateOffer,
  deleteOffer,
  deleteAll,
  uploadImage,
} = require('../controllers/offersController')
const { auth } = require('../middlewares/authMiddleware')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Math.round(Math.random() * 1e9) + '-' + file.originalname)
  },
})
const upload = multer({ storage })

const router = express.Router()

router.post('/', auth, createOffer)
router.get('/', auth, getOffers)
router.get('/:id', auth, getOffer)
router.get('/user/:id', auth, getUserOffers)
router.put('/:id', auth, updateOffer)
router.delete('/:id', auth, deleteOffer)
router.delete('/', auth, deleteAll)
router.post('/upload', auth, upload.single('image'), uploadImage)

module.exports = router
