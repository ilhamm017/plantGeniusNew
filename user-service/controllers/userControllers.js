const { User } = require('../models')


module.exports = {
    // Memasukkan data pengguna
    create : async (req, res) => {
        try {
            const { email, nama } = req.body;
        // cek apakah pengguna sudah terdaftar 
        const existingUser = await User.findOne({ where : { email }})
        if(existingUser) {
            // Jika pengguna sudah terdaftar 
            return res.status(400).json({ message : "Pengguna sudah terdaftar!"})
        }
        User.create({
            email,
            nama
        }).then( user => {
            return res.status(202).json({ message : "Pendaftaran berhasil"})
        }).catch( error => {
            throw new Error("Gagal mendaftarkan pengguna")
        }) 
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat mendaftarkan pengguna", error: error.message })
        }
    },

    read : async (req, res) => {

    },

    update : async (req, res) => {

    },

    delete : async (req, res) => {

    }
}