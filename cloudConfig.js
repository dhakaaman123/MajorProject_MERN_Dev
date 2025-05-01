const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,   // e.g., "yourcloudname"
    api_key: process.env.CLOUD_API_KEY,         // e.g., "1234567890"
    api_secret: process.env.CLOUD_API_KEY_SECRET   // e.g., "yoursecretkey"
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_Dev',             // folder name in your Cloudinary dashboard
      allowed_formats: ['jpg', 'jpeg', 'png'], // allowed image types
      transformation: [{ width: 500, height: 500, crop: 'limit' }] // optional image resizing
    },
  });

  module.exports ={
    cloudinary,
    storage,
  }