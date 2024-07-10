const Router = require('express').Router()
const upload = require('../controllers/uploadController')
const middleware = require('../middleware/middleware')

Router.post('/predict', middleware.authenticationMiddleware, upload.uploadImage)


module.exports = Router