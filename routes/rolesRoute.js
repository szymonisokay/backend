const express = require('express')
const { createRole } = require('../controllers/rolesController')

const router = express.Router()

router.post('/', createRole)

module.exports = router
