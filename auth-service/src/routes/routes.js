const Router = require('express').Router()
const Auth = require('../controllers/authController')

Router.post('/register', Auth.register)
Router.post('/login', Auth.login)

module.exports = Router
