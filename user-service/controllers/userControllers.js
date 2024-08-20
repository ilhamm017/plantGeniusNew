const service = require('../service/userService')

module.exports = {
    // Memasukkan data pengguna
    create : async (req, res) => {
        try {
            //Mendapatkan data dari body request
            const { nama, email, userId } = req.body
            const dataUser = { userId, nama, email }
            const newUser = await service.createUser(dataUser)
            res.status(201).json({
                status: "sukses",
                userId : newUser.userId,
                message : newUser.message
             })
        } catch (error) {
            // console.log(error)
            const errorArray = Array.isArray(error) ? error : [error]
            const errorResponse = {
                errors: errorArray.map(err => (err))
            }
            return res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message,
                errors: error.error
            })
        }
    },
    // Membaca data pengguna di database
    read : async (req, res) => {
        try {
            const allUsers = await service.getAllUsers()
            return res.status(200).json({
                status: "sukses",
                message: allUsers.message,
                data: allUsers.data
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message : error.message, 
                error: error.errors
            })
        }
    },
    // Membaca data pengguna berdasarkan id di database
    readId : async (req, res) => {
        try {
            const { userId } = req.params
            const tokenUserId = req.user.id
            const userById = await service.getUserById(userId, tokenUserId)
            return res.status(202).json({
                status: "sukses",
                userId,
                message: userById.message,
                data: userById.data
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message : error.message,
                error: error.errors
            })
        }
    },
    // Mengupdate data pengguna di database
    update : async (req, res) => {
        try {
            const { userId } = req.params
            const { email, nama } = req.body
            const token = req.user.token
            const tokenUserId = req.user.id
            const dataUser = { email, nama, userId, tokenUserId, token}
            const updatedUser = await service.updateUser(dataUser)
            return res.status(202).json({
                userId: userId,
                status: "sukses",
                message : updatedUser.message
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: 'error',
                message : error.message,
                error: error.errors
            })
        }
    },

    delete : async (req, res) => {
        //Menghapus data pengguna di database
        try {
            const { userId } = req.params
            const tokenUserId = req.user.id
            const token = req.user.token
            const deletedUser = await service.deleteUser(userId, tokenUserId, token)
            return res.status(202).json({
                userId : userId,
                status : "sukses",
                message : deletedUser.message
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                status: 'error',
                message : error.message,
                error: error.errors
            })
        }
    }
}