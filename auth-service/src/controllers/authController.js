const { UserAuth } = require('../models')
const service = require('../service/authService')


module.exports = {
// Registrasii pengguna
register: async (req, res) => {
    try {
        let userData = req.body
        const addUser = await service.create(userData)
        return res.status(201).json({ message: "Pengguna berhasil ditambahkan"})
    } catch (error) {
        // Mengembalikan respon error ketika terjadi error
        console.error(`Error saat mendaftarkan pengguna: ${error}`);
        return res.status(500).json({ message: "Terjadi kesalahan saat mendaftarkan pengguna", error: error.message });
    }
},

login: async (req, res) => {
    try {
        // Mendapatkan email dan passowrd dari body request
        const { email, password } = req.body;
        // Mencari user berdasarkan email
        const user = await UserAuth.findOne({ where: { email }});
        // Cek apakah user ada
        if (user) {
            // Cek apakah password yang dimasukkan sama dengan password di database
            const isPasswordCorrect = await Hash.comparePassword(password, user.password)
            if (isPasswordCorrect) {
                // Jika password benar, maka buat token 
                const token = await Jwt.sign({ id: user.id, email: user.email})
                // Kirimkan respon ke pengguna
                return res.status(200).json({ message: "Login berhasi", token: token})
            } else {
                // Jika pasword salah 
                return res.status(400).json({ message: "password salah"})
            }
        } else {
            // Jika user tidak ada
            return res.staus(404).json({ message: "user tidak ada"})
        }

    } catch (error) {
        // Jika terjadi error
        console.error(`Error saat login: ${error}`)
        return res.status(500).json({ message: "terjadi kesalahan saat login"})
    }
}


}
