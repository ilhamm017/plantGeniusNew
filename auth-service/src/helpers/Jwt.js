const jwt = require('jsonwebtoken')

module.exports = {
    sign : async (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d"})
    },

    verify : async (payload) => {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}