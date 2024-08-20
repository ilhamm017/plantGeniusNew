//Middleware untuk validasi token jwt user 
const helper = require('../helpers/Jwt')
const { User } = require('../models')

module.exports = {
    authenticationMiddleware : async (req, res, next) => {
        try {
            const authHeader = req.get('Authorization')
            if (!authHeader) {
                return res.status(401).json({
                        status: 'gagal',
                        code: 'UNAUTHORIZED',
                        message: 'Tidak ada token, Authorization tidak ditemukan'
                    })
            }
            const tokenParts = await authHeader.split('.')
            if (tokenParts.length !== 3) {
                return res.status(401).json({
                        status: 'gagal',
                        code: 'INVALID_TOKEN_FORMAT',
                        message: 'Token tidak valid'
                    })
            }
            const tokenData = await helper.verify(authHeader)
            const user = await User.findOne({
                where : {
                    userId : tokenData.id
                }
            })
            if (!user) {
                return res.status(401).json({
                    status: 'gagal',
                    code: 'USER_NOT_FOUND',
                    message: 'Token tidak valid!'
                })
            }
            req.user = {
                id : tokenData.id, 
                email : tokenData.email,
                token : authHeader
            }
            next()
        } catch (error) {
            return res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Terjadi kesalahan saat validasi token',
                error: error.message
            })
        }
    }
}
