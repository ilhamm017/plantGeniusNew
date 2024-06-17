const { UserAuth } = require('../models')
const { sequelize } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
const { callExternalApi } = require('../service/apiClientService')
const Url = 'http://localhost:3000/user/create'

module.exports = {
    create : async (userData) => {
        try {
            const existingUser = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            if (existingUser) {
                throw new Error('User already exist')
            }
            const hashedPassword = await Hash.hashPassword(userData.password)
            const transaction = await sequelize.transaction(async t => {
                const newUser = await UserAuth.create({
                    email : userData.email,
                    password : hashedPassword
                },{
                    transaction: t
                }) 
                const response = await callExternalApi(Url,'post',{
                    email : userData.email,
                    nama : userData.nama,
                    userId : newUser.dataValues.id
                })
                console.log(response.data)
                console.log(newUser)
                if (response.status !== 201) {
                    throw new Error('Failed to create user')
                }
                return response.data
            })
            console.log(transaction)
        } catch (error) { 
            throw error
        }
    },
    login : async (userData) => {
        try {
            const user = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            if (!user) {
                throw new Error('User not found')
            }
            const isPasswordCorrect = await Hash.comparePassword(userData.password, user.password)
            if (!isPasswordCorrect) {
                throw new Error('Password is incorrect')
            }
            const token = await Jwt.sign({ id: user.id, email: user.email})
            return token
        } catch (error) {
            
        }
    }
}