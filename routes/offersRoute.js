const express = require('express')
const {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
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
router.get('/', getOffers)
router.get('/:id', getOffer)
router.put('/:id', auth, updateOffer)
router.delete('/', auth, deleteAll)
router.post('/upload', auth, upload.single('image'), uploadImage)

module.exports = router
