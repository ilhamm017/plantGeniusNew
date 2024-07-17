//Middleware untuk validasi token jwt user 
const helper = require('../helpers/Jwt')

module.exports = {
    authenticationMiddleware : async (req, res, next) => {
        try {
            // Mendapatkan token dari header request dengan nama Authorization
            const authHeader = req.get('Authorization')
            if (!authHeader) return res.status(401).json({ message: 'Tidak ada token'})
                const tokenParts = authHeader.split('.')
            if (tokenParts.length !== 3) {
                return res.status(401).json({ message: 'Format token tidak valid'})
            }
            const decodedToken = await helper.verify(authHeader)
            if (decodedToken.exp) {
                const expirationTime = decodedToken.exp * 1000
                const currentTime = Date.now()
                if (currentTime > expirationTime) {
                    return res.status(401).json({ message: 'Token kadaluarsa' })
                }
            }
            /* Menyimpan data user yang sudah divalidasi ke dalam request object
             req.user akan berisi objek dengan properti id dan email */
            req.user = { 
                id: decodedToken.id, 
                email: decodedToken.email, 
                authHeader };
            next()
        } catch (error) {
            console.error(`Error pada authenticationMiddleware: ${error.message}`)
            return res.status(401).json({ message: 'Token tidak valid'})
        }
    }
}