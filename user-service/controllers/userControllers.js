const { User } = require('../models')


module.exports = {
    // Memasukkan data pengguna
    create : async (req, res) => {
        try {
            const { email, nama } = req.body;
        // cek apakah pengguna sudah terdaftar 
        const existingUser = await User.findOne({ where : { email }})
        if(existingUser) {
            // Jika pengguna sudah ada di dalam database 
            return res.status(400).json({ message : "Pengguna sudah terdaftar!"})
        }
        // Membuat pengguna baru di database
        User.create({
            email,
            nama
        }).then( user => { 
            // Jika memasukkan pengguna berhasil maka akan mengembalikan response code 202
            return res.status(202).json({ message : "Pendaftaran berhasil"})
        }).catch( error => {
            // Jika terjadi kesalahan saat memasukkan data pengguna akan mengembalikan error
            throw new Error("Gagal mendaftarkan pengguna")
        }) 
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat memasukkan data pengguna", error: error.message })
        }
    },
    // Membaca data pengguna di database
    read : async (req, res) => {
        try {
            const user = await User.findAll()
            return res.status(202).json({ user })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat membaca data pengguna", error: error.message})
        }
    },

    readId : async (req, res) => {
        try {
            const { userId } = req.params
            const user = await User.findOne({
                where : {
                    id : userId
                }
            })
            return res.status(202).json({ user })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat membaca data pengguna", error: error.message})
        }
    },

    update : async (req, res) => {
        try {
            const { userId } = req.params
            const { email, nama } = req.body
            await User.update({
                email,
                nama
            }, {
                where : {
                    id : userId
                }
            })
            return res.status(202).json({ message : "Pengguna berhasil diupdate"})
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat mengupdate data pengguna", error: error.message })
        }
    },

    delete : async (req, res) => {
        //Menghapus data pengguna di database
        try {
            const { userId } = req.params
            await User.destroy({
                where : {
                    id : userId
                }
            })
            return res.status(202).json({ message : "Pengguna berhasil dihapus"})
        } catch (error) {
            
        }
    }
}