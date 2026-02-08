import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME).trim(),
  api_key: String(process.env.CLOUDINARY_API_KEY).trim(),
  api_secret: String(process.env.CLOUDINARY_API_SECRET).trim(),
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tech_mart_products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export { cloudinary, storage };