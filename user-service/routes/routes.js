const express = require('express')
const router = express.Router()
const User =  require('../controllers/userControllers')

router.post('/create', User.create)
router.get('/', User.read)
router.get('/:userId', User.readId)
router.put('/:userId', User.update)
router.delete('/:userId', User.delete)

module.exports = router