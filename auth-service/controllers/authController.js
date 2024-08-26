const service = require('../service/authService')

module.exports = {
    // Registrasii pengguna
    register: async (req, res) => {
        try {
            // Mendapatkan email, password, nama dari body 
            let userData = req.body
            const addUser = await service.create(userData)
            // console.log(addUser)
            return res.status(201).json({ 
                status: 'sukses',
                userId: addUser.userId,
                message: addUser.message
            })

        } catch (error) {
            // Mengembalikan respon error ketika terjadi error
            console.log(error)
            return res.status(error.statusCode || 500).json({
                status: 'error',
                message: error.message,
                error: error.error
            })
        }
    },

    login: async (req, res) => {
        try {
            // Mendapatkan email dan passowrd dari body request
            const userData = req.body;
            const verifedUser = await service.login(userData)
            return res.status(200).json({
                status: 'sukses',
                userId: verifedUser.userId,
                message: 'Login berhasil',
                token: verifedUser.token
            })
        } catch (error) {
            // Jika terjadi error
            console.error(`Error saat login: ${error}`)
            return res.status(error.statusCode || 500).json({ 
                status: 'error',
                message: error.message, 
                error: error.errors
            })
        }
    },

    update: async (req, res) => {
        try {
            const userId = req.user.id
            const paramsId = req.params.id
            const {email, password} = req.body
            const userData = {email, password}
            const updatedUser = await service.update(userId, paramsId, userData)
            return res.status(200).json({
                status: 'sukses',
                userId: updatedUser.userId,
                message: updatedUser.message
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: 'error',
                message: error.message,
                error : error.error
            })
        }
    },

    delete: async (req, res) => {
        try {
            const userId = req.user.id
            const paramsId = req.params.id
            const deletedUser = await service.delete(userId, paramsId)
            return res.status(200).json({
                status: 'sukses',
                userId,
                message: deletedUser.message
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error : error.message,
                message : error.message,
                error : error.errors
        })
    }
    }
}
