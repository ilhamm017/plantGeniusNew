const bcrypt = require('bcrypt')

module.exports = {
    hashPassword : async (password) => {
        try {
            return await bcrypt.hash(password, 10)
        } catch (error) {
            throw new Error('Gagal mengenkripsi password')
        }
    },

    comparePassword : async (password, hashedPassword) => {
        try {
            return await bcrypt.compare(password, hashedPassword)
        } catch (error) {
            throw new Error('Gagal pengecekan password')
        }
    }
}
