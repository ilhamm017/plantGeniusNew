const express = require('express')
const router = express.Router()
const User =  require('../controllers/userControllers')
const middleware = require('../middleware/middleware')

router.post('/create', User.create)
router.get('/', User.read)
router.get('/:userId', User.readId)
router.put('/:userId', middleware.authenticationMiddleware , User.update)
router.delete('/:userId', middleware.authenticationMiddleware ,User.delete)

module.exports = router