const { UserAuth } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
const { callExternalApi } = require('../service/apiClientService')


module.exports = {
    create : async (userData) => {
        try {
            const existingUser = await UserAuth.findOne({
                where : {
                    email : userData.email
                }
            })
            if (existingUser) {
                throw new Error('User already exists')  
            }
            const newUser = await UserAuth.create(userData)
            const response = await callExternalApi('http://localhost:3000/user/create', 'post', userData)
            return response
        } catch (error) { 
            await UserAuth.destroy({
                where: {
                    email: userData.email
                }
            })
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