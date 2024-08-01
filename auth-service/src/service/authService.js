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
            //Melakukan pengecekan apakah ada user dengan email yang sama
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

                //Menambahkan pengguna ke database
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
                    console.error(`Gagal menambahkan pengguna ke user service: ${response.data}`)
                    throw new Error('Gagal menambahkan pengguna ke user service!')
                }
                return {
                    message: 'Berhasil menambahkan pengguna'
                }
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
            if (!user) {
                throw new Error('Email tidak terdaftar!')
            }

            //Mencocokan password
            const isPasswordCorrect = await Hash.comparePassword(userData.password, user.password)
            if (!isPasswordCorrect) {
                throw new Error('Password salah!!')
            }

            //Membuat token JWT jika login berhasil
            const token = await Jwt.sign({
                id: user.dataValues.id, 
                email: user.email 
            })
            return token

        } catch (error) {
            console.error('Error saat mencoba login:', error.message)
            throw error
        }
    },

    update : async (userId, paramsId, userData) => {
        try {
            //Mencari pengguna berdasarkan ID
            const user = await UserAuth.findOne({
                where: {
                    id: userId
                }
            })
            //Jika pengguna tidak ditemukan, lemparkan error
            if (!user) {
                throw new Error('Data pengguna tidak ditemukan!')
            }
            //Jika token tidak sesuai, lemparkan error
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
            if (!updatedUser) {
                throw new Error(`Gagal memperbarui data pengguna dengan ID ${userId}`)
            }
            return {
                message: 'Berhasil memperbarui data pengguna'
            }
        } catch (error) {
            console.error('Error saat memperbarui data pengguna:', error.message)
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
                throw new Error('Gagal menghapus pengguna karena pengguna tidak ditemukan')
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
                throw new Error('Gagal menghapus pengguna dari database')
            }
            return {
                message: 'Berhasil menghapus pengguna'
            }
        } catch (error) {
            console.error('Error saat menghapus data pengguna:', error)
            throw error
        }
    }
}