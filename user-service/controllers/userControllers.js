const { User } = require('../models')
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
                message : "Pengguna berhasil ditambahkan",
                userId : newUser.userId
             })
        } catch (error) {
            return res.status(500).json({ 
                message : "Terjadi kesalahan saat memasukkan data pengguna", 
                error: error.message
            })
        }
    },
    // Membaca data pengguna di database
    read : async (req, res) => {
        try {
            const allUsers = await service.getAllUsers()
            if (allUsers.length === 0) {
                return res.status(404).json({ message : "Tidak ada data pengguna"})
            }
            return res.status(200).json({ allUsers })
        } catch (error) {
            return res.status(500).json({
                message : "Terjadi kesalahan saat membaca data pengguna", 
                error: error.message
            })
        }
    },
    // Membaca data pengguna berdasarkan id di database
    readId : async (req, res) => {
        try {
            const { userId } = req.params
            const userById = await service.getUserById(userId)
            if (!userById) {
                return res.status(404).json({ message : "Pengguna tidak ditemukan"})
            }
            return res.status(202).json({ userById })
        } catch (error) {
            return res.status(500).json({
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
            const dataUser = { email, nama, userId }
            const updatedUser = await service.updateUser(dataUser)
            if (!updatedUser) {
                return res.status(404).json({ message : "Pengguna tidak ditemukan"})
            }
            return res.status(202).json({
                message : "Pengguna berhasil diperbarui", 
                dataUser : updatedUser 
            })
        } catch (error) {
            return res.status(500).json({
                message : "Terjadi kesalahan saat mengupdate data pengguna",
                error: error.message
            })
        }
    },

    delete : async (req, res) => {
        //Menghapus data pengguna di database
        try {
            const { userId } = req.params
            const deletedUser = await service.deleteUser(userId)
            if (!deletedUser) {
                return res.status(404).json({ message : "Pengguna tidak ditemukan"})
            }
            return res.status(202).json({ message : "Pengguna berhasil dihapus"})
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat menghapus data pengguna"})
        }
    }
}