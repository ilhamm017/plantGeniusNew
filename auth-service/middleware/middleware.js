//Middleware untuk validasi token jwt user 
const { httpError } = require('../helpers/httpError')
const helper = require('../helpers/Jwt')
const { UserAuth } = require('../models')

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
            const user = await UserAuth.findOne({
                where : {
                    id : tokenData.id
                }
            })
        
            req.user = {
                id : tokenData.id, 
                email : tokenData.email
            }
            next()
        } catch (error) {
            if (error.message == 'invalid token') {
                return res.status(401).json({
                    status: 'gagal',
                    message: 'Validation Error',
                    error: error.message
                })
            }
            return res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Terjadi kesalahan saat validasi token',
                error: error.message
            })
        }
    }
}
