const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/usersController')

const router = express.Router()

router.get('/', auth, getUsers)
router.get('/:id', auth, getUser)
router.put('/:id', auth, updateUser)
router.put('/changePassword/:id', auth, changePassword)
router.delete('/:id', auth, deleteUser)

module.exports = router
