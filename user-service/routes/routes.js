const express = require('express')
const router = express.Router()
const User =  require('../controllers/userControllers')

router.post('/signup', User.signUp)
router.post('/login', User.login)
router.put('/:userId', User.update)
router.delete('/:userId', User.delete)

module.exports = router