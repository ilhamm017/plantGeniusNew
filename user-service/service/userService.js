require('dotenv').config()
const { User, sequelize } = require('../models')
const { callExternalApi } = require('../service/apiClientService')
const { httpError } = require('../helpers/httpError')
// const { use } = require('chai')

module.exports = {
    createUser : async (userData) => {
        //membuat servis user create
        let errors = []
        try {
            //---- Validasi Email ---- 
            const existingUser = await User.findOne({
                where : {
                    email : userData.email
                }
            })
            if (existingUser) {
                throw new httpError(409, 'Pengguna dengan email tersebut sudah terdaftar!', 'Validation Error')
            }
            // ---- Validasi input ----
            try {
                await User.build(userData).validate();
            } catch (error) {
                error.errors.forEach(err => {
                    errors.push(err.message)
                })
                // ---- Langsung kembalikan jika terdapat error pada validasi ----
                throw new httpError(400, 'Validation Error', 'Validation Error', errors)
            } 
         
            // ---- Masukkan data pengguna ----
            const newUser = await User.create({
                email : userData.email,
                nama : userData.nama,
                userId : userData.userId
            })
            return {
                message : 'Berhasil menambahkan data pengguna',
                userId: newUser.userId
            }
        } catch (error) {
            if (error.message) {
                errors.push(error.message)
            }
            throw error
        }
    },

    getAllUsers : async () => {
        //mendapatkan semua data user 
        try {
            const user = await User.findAll()
            if (user.length === 0) {
                throw new httpError(404, 'Pengguna tidak ditemukan!')
            }
            if (!user) {
                throw new httpError(404, 'Gagal mendapatkan data pengguna')
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
        try {
            //mendapatkan data user berdasarkan id
            const user = await User.findOne({
                where : {
                    userId
                }
            })
            // ---- Lempar error jika tidak ketemu ----
            if (!user) {
                throw new httpError(404, 'Pengguna tidak ditemukan!')
            }
            if (userId != tokenUserId) {
                throw new httpError(401, 'Token tidak sesuai!')
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
        let errors = []
        //mengupdate data user berdasarkan id  
        try {
            console.log(userData)
            if(!userData.email && !userData.nama) {
                return {
                    message: 'Tidak ada yang diperbarui!'
                }
            }
            const user = await User.findOne({
                where: {
                    userId: userData.userId
                }
            })
            if (!user) {
                throw new httpError(404, 'Pengguna tidak ditemukan!')
            }
            if (userData.userId != userData.tokenUserId) {
                throw new httpError(401, 'Token tidak sesuai!')
            }
            try {
                const checkData = await User.build({
                    ...(userData.email ? { email: userData.email} : { email: user.email }),
                    ...(userData.nama ? { nama: userData.nama} : { nama: user.nama }),
                    userId: user.userId
                })
                const checkedData = await checkData.validate()
                console.log(checkedData)
            } catch (error) {
                error.errors.forEach(err => {
                    errors.push(err.message)
                })
                throw new httpError(400, 'Validation Error!', 'VAlidation Error!', errors)
            }
            const updateUser = await User.findOne({
                where: {
                    userId: user.userId,
                    ...(userData.email ? { email: userData.email} : { email: user.email }),
                    ...(userData.nama ? { nama: userData.nama} : { nama: user.nama })
                }
            })
            // if (!updateUser) {
            //     errors.push('Gagal memperbarui pengguna!')
            //     console.log(updateUser)
            //     throw new httpError(500, 'Gagal memperbarui pengguna!')
            // }
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
           
            if (userData.email) {
                //Memperbarui data pengguna di Auth service
                const updatedUserService = await callExternalApi(process.env.USER_SERVICE_URL,`/auth/${userData.tokenUserId}`, 'PUT', {
                    email : userData.email
                }, userData.token )
                if (!updatedUserService) {
                    throw new Error
                }
            }
        })
            return {
                message: `Berhasil memperbarui data pengguna`
        }

        } catch (error) {
            console.error(`Error saat memperbarui data pengguna: ${error.message}`)
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
                throw new httpError(404, 'Pengguna tidak ditemukan!')
            }
            if (userId != tokenUserId) {
                throw new httpError(401, 'Token tidak sesuai!')
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
                    throw new httpError(500, 'Gagal menghapus pengguna')
                }
                //Menghapus data pengguna autentikasi
                const deletedUserAuth = await callExternalApi(process.env.USER_SERVICE_URL, `/auth/${tokenUserId}`, 'DELETE', {}, token)
                if (!deletedUserAuth) {
                    throw new httpError(deletedUserAuth.status, 'Gagal menghapus data pengguna di Auth-Service!')
                }
                //Menghapus riwayat deteksi 
                const deletedHistory = await callExternalApi(process.env.HISTORY_SERVICE_URL, '/history/', 'DELETE', {}, token)
                if (!deletedHistory) {
                    throw new httpError(deletedUserAuth.status, 'Gagal menghapus data riwayat pengguna!')
                }
            })
            return {
                message: `Pengguna berhasil dihapus`
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