import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const storageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      format: 'png', // o 'jpeg', 'jpg', etc.
      public_id: file.originalname.split('.')[0],
    };
  },
});
