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

            const result = await service.uploadToExternalAPI('/predict/', "POST", image)
            console.log('ini result', result)
            console.log('ini userId', userId)
            if (!result) {
                return res.status(500).json({
                    message: "Terjadi kesalahan saat mendeteksi gambar",
                })
            }

            const history = await service.createHistory('/history/', "POST", result.prediction, userId, token)
            if (!history) {
                return res.status(500).json({
                    message: "Gambar berhasil dideteksi, tetapi gagal disimpan ke riwayat."
                });
            }

            return res.status(201).json({
                message: "Gambar berhasil diunggah dan disimpan",
                data: result.prediction
            })
            
        } catch (error) {
            return res.status(500).json({
                message: "Gagal mengunggah gambar",
                error: error.message
            })
        }
    }
}
