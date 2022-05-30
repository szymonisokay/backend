const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/usersController')

const router = express.Router()

router.get('/', auth, getUsers)
router.get('/:id', auth, getUser)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)

module.exports = router
