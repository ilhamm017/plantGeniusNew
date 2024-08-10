const Router = require('express').Router()
const Auth = require('../controllers/authController')
const middleware = require('../middleware/middleware')

Router.post('/register', Auth.register)
Router.post('/login', Auth.login)
Router.put('/:id', middleware.authenticationMiddleware, Auth.update)
Router.delete('/:id', middleware.authenticationMiddleware, Auth.delete)

module.exports = Router
