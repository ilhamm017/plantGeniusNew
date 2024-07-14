require('dotenv').config();
const service = require('../service/uploadImageService')
const url = process.env.EXTERNAL_API_URL 


module.exports = {
    uploadImage : async (req, res) => {
        try {
            const image = req.body.image
            const result = await service.uploadToExternalAPI(url, "POST", image)
            return res.status(200).json({
                message: "Image uploaded successfully",
                data: result
            })
        } catch (error) {
            return res.status(500).json({ message: "Failed to upload image", error })
        }
    }
}