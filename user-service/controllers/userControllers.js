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
                message : newUser.message,
                userId : newUser.userId
             })
        } catch (error) {
            return res.status(500).json({ 
                status: "error",
                message : "Terjadi kesalahan saat memasukkan data pengguna", 
                error: error.message
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
                message : "Terjadi kesalahan saat membaca data pengguna", 
                error: error.message
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
                message: userById.message,
                data: userById.data
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message : "Terjadi kesalahan saat membaca data pengguna",
                error: error.message
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
                status: "sukses",
                message : updatedUser.message
            })
        } catch (error) {
            return res.status(500).json({
                message : "Terjadi kesalahan saat memperbarui data pengguna",
                error: error.message
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
                status : "sukses",
                message : deletedUser.message
            })
        } catch (error) {
            return res.status(500).json({
                message : "Terjadi kesalahan saat menghapus data pengguna",
                error: error.message
            
            })
        }
    }
}