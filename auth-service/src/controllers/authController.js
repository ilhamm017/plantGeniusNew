const service = require('../service/authService')

module.exports = {
    // Registrasii pengguna
    register: async (req, res) => {
        try {
            // Mendapatkan email, password, nama dari body 
            let userData = req.body
            const addUser = await service.create(userData)
            return res.status(201).json({ 
                status: 'sukses',
                message: "Pengguna berhasil ditambahkan"
            })
        } catch (error) {
            // Mengembalikan respon error ketika terjadi error
            console.error(`Error saat mendaftarkan pengguna: ${error.message}`);
            return res.status(500).json({
                status: 'gagal',
                message: "Terjadi kesalahan saat mendaftarkan pengguna", 
                error: error.message 
            });
        }
    },

    login: async (req, res) => {
        try {
            // Mendapatkan email dan passowrd dari body request
            const userData = req.body;
            const verifedUser = await service.login(userData)
            if (!verifedUser) {
                return res.status(404).json({
                    message: 'Pengguna tidak teraftar'
                })
            }
            return res.status(200).json({
                status: 'sukses',
                message: 'Login berhasil',
                token: verifedUser
            })
        } catch (error) {
            // Jika terjadi error
            console.error(`Error saat login: ${error}`)
            return res.status(500).json({ 
                status: 'error',
                message: "terjadi kesalahan saat login",
                error: error.message
            })
        }
    },

    update: async (req, res) => {
        try {
            const userId = req.user.id
            const paramsId = req.params.id
            const userData = req.body
            const updatedUser = await service.update(userId, paramsId, userData)
            return res.status(200).json({
                message: "Data pengguna berhasil diperbarui"
            })
        } catch (error) {
            return res.status(500).json({
                error : error.message,
                message: "Terjadi kesalahan saat melakukan update data pengguna"
            })
        }
    },

    delete: async (req, res) => {
        try {
            const userId = req.user.id
            const paramsId = req.params.id
            const deletedUser = await service.delete(userId, paramsId)
            return res.status(200).json({
                message: "Data pengguna berhasil dihapus"
            })
        } catch (error) {
            return res.status(500).json({
                error : error.message,
                message: "Terjadi kesalahan saat menghapus data pengguna"
            })
        }
    }
}
