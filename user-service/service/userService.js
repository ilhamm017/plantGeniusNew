require('dotenv').config()
const { User, sequelize } = require('../models')
const { callExternalApi } = require('../service/apiClientService')

module.exports = {
    createUser : async (userData) => {
        //membuat servis user create
        try {
            const existingUser = await User.findOne({
                where : {
                    email : userData.email
                }
            })
            if (existingUser) {
                throw new Error('Pengguna dengan email tersebut sudah terdaftar!')
            }
            const newUser = await User.create({
                email : userData.email,
                nama : userData.nama,
                userId : userData.userId
            })
            return {
                message : 'Berhasil menambahkan data pengguna',
                userId : newUser.userId
            }
        } catch (error) {
            throw error
        }
    },
    getAllUsers : async () => {
        //mendapatkan semua data user 
        try {
            const user = await User.findAll()
            if (user.length === 0) {
                throw new Error('Pengguna tidak ditemukan!')
            }
            if (!user) {
                throw new Error('Gagal mendapatkan data pengguna')
            }
            return {
                message : 'Berhasil mendapatkan data pengguna',
                data : user
            }
        } catch (error) {
            throw error
        }  
    },
    getUserById : async (userId, tokenUserId) => {
        //mendapatkan data user berdasarkan id
        try {
            const user = await User.findOne({
                where : {
                    userId
                }
            })
            if (!user) {
                throw new Error('Pengguna tidak ditemukan!')
            }
            if (userId != tokenUserId) {
                throw new Error('Token tidak sesuai')
            }
            return {
                message : 'Berhasil mendapatkan data pengguna',
                data : user
            }
        } catch (error) {
            throw error
        }
    },
    updateUser : async (userData) => {
        let transaction = null
        //mengupdate data user berdasarkan id
        try {
            const user = await User.findOne({
                where: {
                    userId: userData.userId
                }
            })
            console.log(user);
            if (!user) {
                throw new Error('Pengguna tidak ditemukan!')
            }
            if (userData.userId != userData.tokenUserId) {
                throw new Error('Token tidak sesuai')
            }
        //Memulai transaksi update data pengguna
        transaction = await sequelize.transaction(async t => {
            //Memperbarui data pengguna di User service
            const updatedUser = await User.update({
                ...(userData.nama ? { nama: userData.nama } : {}),
                ...(userData.email ? { email: userData.email } : {})
            },{
                where : {
                    userId : userData.userId
                },
                transaction: t
            })
           
            if (updatedUser[0] === 0) {
                throw new Error('Terjadi kesalahan saat memperbarui data pengguna')
            }
            if (userData.email) {
                //Memperbarui data pengguna di Auth service
                const updatedUserService = await callExternalApi(process.env.USER_SERVICE_URL,`/auth/${userData.tokenUserId}`, 'PUT', {
                    email : userData.email
                }, userData.token)
                if (!updatedUserService) {
                    console.error(`Terjadi kesalahan saat memperbarui data di Auth service`)
                    throw new Error('Gagal memperbarui data di Auth service')
                }
            }
        })
        return {
            message: `Berhasil memperbarui data pengguna dengan id ${userData.userId}`
        }
        } catch (error) {
            console.error(`Error saat menambahkan pengguna: ${error.message}`)
            if (transaction) {
                await transaction.rollback()
            }
            throw error
        }
    },
    deleteUser : async (userId, tokenUserId, token) => {
        //menghapus data user berdasarkan id
        let transaction = null
        try {
            const user = await User.findOne({
                where : {
                    userId
                }
            })
            if (!user) {
                throw new Error('pengguna tidak ditemukan')
            }
            if (userId != tokenUserId) {
                throw new Error('Token tidak sesuai!')
            }
            //Memulai transaksi menghapus data pengguna
            transaction = await sequelize.transaction( async t => {
                //Menghapus data pengguna
                const deletedUser = await User.destroy({
                    where : {
                        userId
                    },
                    transaction : t
                })
                if (!deletedUser) {
                    throw new Error('Gagal menghapus data pengguna!')
                }
                //Menghapus data pengguna autentikasi
                const deletedUserAuth = await callExternalApi(process.env.USER_SERVICE_URL, `/auth/${tokenUserId}`, 'DELETE', {}, token)
                if (!deletedUserAuth) {
                    throw new Error('Gagal menghapus data pengguna autentikasi!')
                }
                //Menghapus riwayat deteksi 
                const deletedHistory = await callExternalApi(process.env.HISTORY_SERVICE_URL, '/history/', 'DELETE', {}, token)
                console.log(deletedHistory)
                if (!deletedHistory) {
                    throw new Error('Gagal menghapus riwayat deteksi!')
                }
            })
            return {
                message: `Pengguna dengan id ${userId} berhasil dihapus`
            }
        } catch (error) {
            console.error(`Error saat menghapus pengguna: ${error.message}`)
            if (transaction) {
                await transaction.rollback()
            }
            throw error
        }
    }
}