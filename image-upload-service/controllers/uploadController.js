const service = require('../service/uploadImageService')

module.exports = {
    uploadImage : async (req, res) => {
        try {
            const { image } = req.body
            const userId = req.user.id
            const token = req.user.authHeader
            console.log(token) //=======================
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
                    message: "kesalahan saat mendeteksi gambar",
                })
            }
            const history = await service.createHistory('/history/', "POST", result.prediction, userId, token)
            
            return res.status(201).json({
                message: "Image uploaded successfully",
                data: result.prediction
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to upload image",
                error: error.message
            })
        }
    }
}