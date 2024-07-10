//Middleware untuk validasi token jwt user 
const helper = require('../helpers/Jwt')
const { User } = require('../models')

module.exports = {
    authenticationMiddleware : async (req, res, next) => {
        try {
            // Mendapatkan token dari header request dengan nama Authorization
            const authHeader = req.get('Authorization')
            if (!authHeader) return res.status(401).json({ message: 'Tidak ada token'})

            const decodedToken = helper.verify(authHeader)
            const now = Math.floor(Date.now() / 1000)
            if (!decodedToken) {
                return res.status(401).json({ message: 'Token tidak valid'})
            }
            if (decodedToken.exp < now ) {
                return res.status(401).json({ message: 'Token sudah kadaluarsa'})
            }
            /* Menyimpan data user yang sudah divalidasi ke dalam request object
             req.user akan berisi objek dengan properti id dan email */
            req.user = { id: decodedToken.id, email: decodedToken.email };
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Terjadi kesalahan saat validasi token'})
        }
    }
}