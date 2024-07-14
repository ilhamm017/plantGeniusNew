//Middleware untuk validasi token jwt user 
const helper = require('../helpers/Jwt')

module.exports = {
    authenticationMiddleware : async (req, res, next) => {
        try {
            const authHeader = req.get('Authorization')
            if (!authHeader) return res.status(401).json({ message: 'Tidak ada token'})
            const tokenParts = authHeader.split('.')
            if (tokenParts.length !== 3) {
                return res.status(401).json({ message: 'Token tidak valid'})
            }
            const [bearer, token] = tokenParts
            const { id, email } = helper.verify(authHeader)
            req.user = {id, email}
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Terjadi kesalahan saat validasi token'})
        }
    }
}
