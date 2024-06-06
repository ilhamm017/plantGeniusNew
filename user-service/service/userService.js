const { User } = require('../models')

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
                throw new Error('User already exists')
            }
            const newUser = await User.create(userData)
            return newUser
        } catch (error) {
            throw error
        }
    },
    getAllUsers : async (userData) => {
        //mendapatkan semua data user 
        try {
            const user = await User.findAll()
            return user
        } catch (error) {
            throw error
        }  
    },
    getUserById : async (userData) => {
        //mendapatkan data user berdasarkan id
        try {
            const user = await User.findOne({
                where : {
                    id : userData.id
                }
            })
            if (!user) {
                throw new Error('User not found')
            }
            return user
        } catch (error) {
            throw error
        }
    },
    updateUser : async (userData) => {
        //mengupdate data user berdasarkan id
        try {
        const updatedUser = await User.update(userData, {
            where : {
                id : userData.id
            }
        })
        } catch (error) {
            throw error
        }
    },
    deleteUser : async (userData) => {
        //menghapus data user berdasarkan id
        try {
            const deletedUser = await User.destroy({
                where : {
                    id : userData.id
                }
            })
            if (!deletedUser) {
                throw new Error('User not found')
            }
            return deletedUser
        } catch (error) {
            throw error
        }
    }
}