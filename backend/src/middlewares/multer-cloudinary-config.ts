import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'azfooddelivery/restaurants',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 500, crop: 'fill' }],
  } as any,
});

const upload = multer({ storage }).fields([
  { name: 'img', maxCount: 1 },
  { name: 'coverImg', maxCount: 1 },
]);

export default upload;