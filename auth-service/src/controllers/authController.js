const { UserAuth } = require('../models')
const Hash = require('../helpers/Hash')
const Jwt = require('../helpers/Jwt')
module.exports = {
// Registrasii pengguna
register: async (req, res) => {
    try {
        let { email, password } = req.body;
        // Cek apakah email sudah terdaftar
        const existingUser = await UserAuth.findOne({ where: { email } });
        if (existingUser) {
            // Jika pengguna sudah ada, mengembalikan status "Email sudah terdaftar"
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        // Membuat pengguna baru
        /*password = await Hash.hashPassword(password)
        const newUser = await UserAuth.create({
            email,
            // Enkripsi password sebelum menyimpan ke database
            password,
        });*/
        // Enkripsi password sebelum disimpan ke database
        Hash.hashPassword(password).then( password => {
            // Membuat pengguna baru di database
            UserAuth.create({
                email,
                password
            })
            // Jika terjadi error, mengembalikan error
        }).catch( error => {
            throw new Error('Gagal mendaftarkan pengguna')
        })
        // Mendaftarkan pengguna ke User-service
        // TODO*
        //Mengembalikan respon berhasil ketika sudah memasukkan data pengguna ke database
        return res.status(201).json({ message: "Pengguna berhasil didaftarkan" });
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
