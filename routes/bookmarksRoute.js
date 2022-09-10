const express = require('express')
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getPopulatedBookmarks,
} = require('../controllers/bookmarksController')
const { auth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', auth, addBookmark)
router.delete('/:id', auth, removeBookmark)
router.get('/', auth, getBookmarks)
router.get('/populated', auth, getPopulatedBookmarks)

module.exports = router
