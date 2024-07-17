const service = require('../service/uploadImageService')

module.exports = {
    uploadImage : async (req, res) => {
        try {
            const { image } = req.body
            const userId = req.user.id
            const token = req.user.authHeader
            if (!image) {
                return res.status(400).json({
                    message: "Gambar tidak boleh kosong"
                })
            }
            //Memanggil endpoint untuk mendeteksi gambar
            const result = await service.uploadToExternalAPI('/predict/', "POST", image)

            //Memanggil endpoint untuk membuat riwayat
            const history = await service.createHistory('/history/', "POST", result.prediction, userId, token)

            return res.status(201).json({
                message: "Gambar berhasil diunggah dan riwayat disimpan",
                data: result.prediction
            })
            
        } catch (error) {
            return res.status(500).json({
                message: "Terjadi kesalahan!!",
                error: error.message
            })
        }
    }
}
