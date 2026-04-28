const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @route POST /api/upload
// @desc Upload an image to Cloudinary
// @access Private (you can add authentication middleware here)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Function to upload file buffer to Cloudinary using a stream
        const steamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                // Use streamifier to convert buffer to stream and pipe it to Cloudinary
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        // Call the upload function with the file buffer
        const result = await steamUpload(req.file.buffer);

        // Respond with the URL of the uploaded image
        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
        
});

module.exports = router;