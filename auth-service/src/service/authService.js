require('dotenv').config();
const { UserAuth } = require('../models')
const { sequelize } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
const { callExternalApi } = require('../service/apiClientService')
const Url = process.env.USER_SERVICE_URL

module.exports = {
    //Menambahkan pengguna
    create : async (userData) => {
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
            const transaction = await sequelize.transaction(async t => {
                //MEnambahkan pengguna ke database
                const newUser = await UserAuth.create({
                    email : userData.email,
                    password : hashedPassword
                },{
                    transaction: t
                }) 
                //Menambahkan pengguna ke user service
                const response = await callExternalApi(Url,'post',{
                    email : userData.email,
                    nama : userData.nama,
                    userId : newUser.dataValues.id
                })
                console.log(response.data)
                console.log(newUser)
                if (response.status !== 201) {
                    throw new Error('Gagal menambahkan pengguna!')
                }
                return response.data
            })
            console.log(transaction)
        } catch (error) { 
            //Jika terjadi error, batalkan transaksi
            console.error(`Error saat menambahkan pengguna: ${error}`)
            await t.rollback();
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
            //Membuat token JWT
            const token = await Jwt.sign({ id: user.id, email: user.email })
            return token
        } catch (error) {
            console.error('Error saat login:, error')
            throw error
        }
    }
}