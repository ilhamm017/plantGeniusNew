//Middleware untuk validasi token jwt user 
const helper = require('../helpers/Jwt')
const { User } = require('../models')

module.exports = {
    authenticationMiddleware : async (req, res, next) => {
        try {
            const authHeader = req.get('Authorization')
            if (!authHeader) return res.status(401).json({ message: 'Tidak ada token'})
            const tokenParts = authHeader.split('.')
            if (tokenParts.length !== 3) {
                return res.status(401).json({ message: 'Token tidak valid'})
            }
            const tokenData = await helper.verify(authHeader)
            req.user = {id : tokenData.id, email : tokenData.email}
            next()
        } catch (error) {
            return res.status(500).json({
                message: 'Terjadi kesalahan saat validasi token',
                error: error.message
            })
        }
    }
}
