require('dotenv').config();
const { UserAuth } = require('../models')
const { sequelize } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
const { callExternalApi } = require('../service/apiClientService')

module.exports = {
    //Menambahkan pengguna
    create : async (userData) => {
        let transaction = null
        try {

            //Mengecek user dengan email yang sama
            const existingUser = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            if (existingUser) {
                throw new Error('Email sudah terdaftar!')
            }

            //Melakukan hashing password
            const hashedPassword = await Hash.hashPassword(userData.password)

            //Memulai transaksi menambahkan data pengguna
            transaction = await sequelize.transaction(async t => {

                //MEnambahkan pengguna ke database
                const newUser = await UserAuth.create({
                    email : userData.email,
                    password : hashedPassword
                },{
                    transaction: t
                })

                //Menambahkan pengguna ke user service
                const response = await callExternalApi('/users/create','post',{
                    email : userData.email,
                    nama : userData.nama,
                    userId : newUser.dataValues.id
                })
                if (response.status !== 201) {
                    throw new Error('Gagal menambahkan pengguna!')
                }
                return response
            })

        } catch (error) { 
            //Jika terjadi error, batalkan transaksi
            console.error(`Error saat menambahkan pengguna: ${error.message}`)
            if (transaction) {
                await transaction.rollback()
            }
            throw error
        }
    },

    login : async (userData) => {

        //Mencocokan email dengan database
        try {
            const user = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            console.log(user)
            if (!user) {
                throw new Error('Email tidak terdaftar!')
            }

            //Mencocokan password
            const isPasswordCorrect = await Hash.comparePassword(userData.password, user.password)
            if (!isPasswordCorrect) {
                throw new Error('Password salah!!')
            }

            //Membuat token JWT
            const token = await Jwt.sign({
                id: user.dataValues.id, 
                email: user.email 
            })
            return token
        } catch (error) {
            console.error('Error saat login:', error)
            throw error
        }
    },

    update : async (userId, paramsId, userData) => {
        try {
            const user = await UserAuth.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw new Error('Pengguna tidak ditemukan!')
            }
            if (userId != paramsId) {
                throw new Error('Token tidak sesuai')
            }
            const updatedUser = await UserAuth.update({
                ...(userData.email ? { email: userData.email } : {}),
                ...(userData.password ? { password: await Hash.hashPassword(userData.password) } : {}) //===
            }, {
                where : {
                    id : userId
                }
            })
            if (updatedUser[0] === 0) {
                throw new Error('Update gagal!')
            }
            return updatedUser
        } catch (error) {
            console.error('Error saat memperbarui data pengguna:', error)
            throw error
        }
    },

    delete : async (userId, paramsId) => {
        try {
            const user = await UserAuth.findOne({
                where: {
                    id : userId
                }
            })
            if (!user) {
                throw new Error('Pengguna tidak ditemukan!')
            }
            if (userId != paramsId) {
                throw new Error('Token tidak sesuai')
            }
            const deletedUser = await UserAuth.destroy({
                where: {
                    id : userId
                }
            })
            if (!deletedUser) {
                throw new Error('Gagal menghapus pengguna')
            }
        } catch (error) {
            console.error('Error saat menghapus data pengguna:', error)
            throw error
        }
    }
}