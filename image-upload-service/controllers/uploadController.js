const service = require('../service/uploadImageService')

module.exports = {
    uploadImage : async (req, res) => {
        try {
            const { image } = req.body
            const userId = req.user.id
            const token = req.user.authHeader
            if (!image) {
                throw new Error("Gambar tidak boleh kosong")
            }
            //Memanggil endpoint untuk mendeteksi gambar
            const result = await service.uploadToExternalAPI('/predict/', "POST", image)

            //Memanggil endpoint untuk membuat riwayat
            const history = await service.createHistory('/history/', "POST", result.prediction, userId, token)

            return res.status(201).json({
                status: "sukses",
                message: "Deteksi berhasil",
                data: result.prediction
            })
            
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: "Terjadi kesalahan!!",
                error: error.message
            })
        }
    }
}
