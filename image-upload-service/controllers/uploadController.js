const service = require('../service/uploadImageService')
const url = ""

module.exports = {
    uploadImage : async (req, res) => {
        try {
            const image = req.body.image
            const result = await service.uploadToExternalAPI(url, "POST", image)
            return res.status(200).json({ message: "Image uploaded successfully", result })
        } catch (error) {
            return res.status(500).json({ message: "Failed to upload image", error })
        }
    }
}