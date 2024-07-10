const service = require('../service/authService')

module.exports = {
// Registrasii pengguna
register: async (req, res) => {
    try {
        // Mendapatkan email, password, nama dari body 
        let userData = req.body
        const addUser = await service.create(userData)
        return res.status(201).json({ 
            userId: addUser,
            message: "Pengguna berhasil ditambahkan" 
        })
    } catch (error) {
        // Mengembalikan respon error ketika terjadi error
        console.error(`Error saat mendaftarkan pengguna: ${error}`);
        return res.status(500).json({ message: "Terjadi kesalahan saat mendaftarkan pengguna", error: error.message });
    }
},

login: async (req, res) => {
    try {
        // Mendapatkan email dan passowrd dari body request
        const userData = req.body;
        const verifedUser = await service.login(userData)
        return res.ststus(200).json({ token: verifedUser })
    } catch (error) {
        // Jika terjadi error
        console.error(`Error saat login: ${error}`)
        return res.status(500).json({ message: "terjadi kesalahan saat login"})
    }
}
}
