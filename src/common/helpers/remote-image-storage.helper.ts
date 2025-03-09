import { memoryStorage, Options } from 'multer';

type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToRemote: Options = {
  storage: memoryStorage(), // Store file in memory (not on disk)
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    validMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(new Error('Invalid file type'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit (optional)
};
