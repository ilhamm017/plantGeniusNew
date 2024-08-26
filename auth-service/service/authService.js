require('dotenv').config();
const { UserAuth } = require('../models')
const { sequelize } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
const { callExternalApi } = require('./apiClientService')
const { httpError } = require('../helpers/httpError')

module.exports = {
    //Menambahkan pengguna
    create : async (userData) => {
        let transaction = null
        let errors = []
        try {
            transaction = await sequelize.transaction(async (t) => {
                // ---- Validasi Email ----
                const existingUser = await UserAuth.findOne({
                    where: {
                        email: userData.email
                    }
                })
                // ---- Tangani jika email sudah terdaftar ----
                if (existingUser) {
                    errors.push('Email sudah terdaftar!')
                    throw new httpError(409, 'Validation Error!', 'Validation Error!', errors)
                }
                // ---- Validasi nama ----
                if (!userData.nama) {
                    errors.push('Nama tidak boleh kosong!')
                }
                // ---- Cek Validasi sequelize ----
                try {
                    await UserAuth.build(userData).validate()
                } catch (error) {
                    error.errors.forEach(err => {
                        errors.push(err.message)
                    });
                    throw new httpError(400, 'Validate Error!', 'Validate Error', errors)
                }
                // ---- Hashed Password ----
                const hashedPassword = await Hash.hashPassword(userData.password)
                // ---- Create User ----
                const newUser = await UserAuth.create({
                    email: userData.email,
                    password: hashedPassword
                },{
                    transaction: t
                })
                // ---- Panggil External API ----
                const response = await callExternalApi('/users/create', 'post', {
                    email: userData.email,
                    nama: userData.nama,
                    userId: newUser.dataValues.id
                })
                if (errors > 0) {
                    throw new Error
                }
                return newUser
            })

            return {
                userId: transaction.dataValues.id,
                message: 'Berhasil menambahkan pengguna!'
            }

        } catch (error) {
            // ---- Rollback transaksi ----
            if (transaction) {
                await transaction.rollback()
            }            
            throw error
        }
            
    },

    login : async (userData) => {
        //Mencocokan email dengan database
        try {
            if (!userData.email && !userData.password) {
                throw new httpError(404, 'Email dan Password diperlukan!')
            } else if (!userData.email) {
                throw new httpError(404, 'Tidak ada Email!')
            }
            const user = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            if (!user) {
                throw new httpError(404, 'Email tidak terdaftar!')
            }

            //Mencocokan password
            const isPasswordCorrect = await Hash.comparePassword(userData.password, user.password)
            if (!isPasswordCorrect) {
                throw new httpError(401, 'Password Salah!')
            }

            //Membuat token JWT jika login berhasil
            const token = await Jwt.sign({
                id: user.dataValues.id, 
                email: user.email 
            })

            return {
                userId: user.dataValues.id,
                token: token
            }

        } catch (error) {
            console.error('Error saat mencoba login:', error.message)
            throw error
        }
    },

    update : async (userId, paramsId, userData) => {
        let transaction = null
        try {
            transaction = await sequelize.transaction(async (t) => {
                //Mencari pengguna berdasarkan ID
            const user = await UserAuth.findOne({
                where: {
                    id: userId
                }
            })
            //Jika pengguna tidak ditemukan, lemparkan error
            if (!user) {
                throw new httpError(404, 'Data pengguna tidak ditemukan!', 'NotFound')
            }
            //Jika token tidak sesuai, lemparkan error
            if (userId != paramsId) {
                throw new httpError(401, 'Validator Error!', 'Validation Error!', 'Token tidak sesuai!')
            }

            const updatedUser = await UserAuth.update({
                ...(userData.email ? { email: userData.email } : {}),
                ...(userData.password ? { password: await Hash.hashPassword(userData.password) } : {}) 
            }, {
                where : {
                    id : userId
                }
            },{
                transaction: t
            })
            if (!updatedUser) {
                throw new httpError(500, 'Gagal memperbarui data pengguna!')
            }
            return {
                userId: userId,
                message: 'Berhasil memperbarui data pengguna',

            }
            })
            return transaction
        } catch (error) {
            console.error('Error saat memperbarui data pengguna:', error.message)
            if (transaction) {
                await transaction.rollback()
            }
            throw error
        }
    },

    delete : async (userId, paramsId) => {
        try {
            // ---- Cek id pengguna di database ----
            const user = await UserAuth.findOne({
                where: {
                    id : userId
                }
            })
            // ---- Jika tidak ada, lempar error ----
            if (!user) {
                throw new httpError(404, 'Pengguna tidak ditemukan!')
            }
            if (userId != paramsId) {
                throw new httpError(401, 'Token tidak sesuai!')
            }
            const deletedUser = await UserAuth.destroy({
                where: {
                    id : userId
                }
            })
            if (!deletedUser) {
                throw new httpError(500, 'Gagal menghapus pengguna dari database!')
            }
            return {
                userId: userId,
                message: 'Berhasil menghapus pengguna'
            }
        } catch (error) {
            console.error('Error saat menghapus data pengguna:', error)
            if (error.statusCode == 404) {
                return {
                    userId: userId,
                    message: error.message
                }
            }
            throw error
        }
    }
}