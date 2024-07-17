const service = require('../service/authService')

module.exports = {
// Registrasii pengguna
register: async (req, res) => {
    try {
        // Mendapatkan email, password, nama dari body 
        let userData = req.body
        const addUser = await service.create(userData)
        console.log(addUser)
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
        if (verifedUser && verifedUser.token) {
            return res.status(200).json({
                status: 'sukses',
                message: 'Login berhasil',
                data: {
                    token: verifedUser.token
                }
            })
        }
    } catch (error) {
        // Jika terjadi error
        console.error(`Error saat login: ${error}`)
        return res.status(500).json({ 
            status: 'error',
            message: "terjadi kesalahan saat login",
            error: error.message
        })
    }
}
}
