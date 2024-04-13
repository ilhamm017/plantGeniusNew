const { AuthUser } = require('../models')

module.exports = {
// Tulis kode untuk otentikasi pengguna di sini
register: async (req, res) => {
    try {
        const { email, password } = req.body;
        // Cek apakah email sudah terdaftar
        const existingUser = await AuthUser.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        // Enkripsi password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);
        // Membuat pengguna baru
        const newUser = await AuthUser.create({
            email,
            password: hashedPassword,
        });
        return res.status(201).json({ message: "Pengguna berhasil didaftarkan", user: newUser });
    } catch (error) {
        console.error("Error saat mendaftarkan pengguna:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mendaftarkan pengguna" });
    }
} 


}
