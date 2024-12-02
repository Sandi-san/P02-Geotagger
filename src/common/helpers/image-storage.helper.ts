//DYNAMIC IMPORT (WARNING: configure tsconfig.json to "module": "NodeNext",
//else Error: require() of ES Module is not supported "file-type")
const FileType = import('file-type');

import fs from 'fs';
import { diskStorage, Options } from 'multer';
import { extname } from 'path';

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage: Options = {
  storage: diskStorage({
    //:root/files
    destination: './files',
    filename(req, file, callback) {
      //create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      //get file extension
      const ext = extname(file.originalname);
      //write filename
      const filename = `${uniqueSuffix}${ext}`;
      //return
      callback(null, filename);
    },
  }),
  fileFilter(req, file, callback) {
    //check if mime is correct (actual file type)
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    validMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  return (await FileType)
    .fileTypeFromFile(fullFilePath)
    .then((fileExtensionsAndMimeType) => {
      if (!fileExtensionsAndMimeType?.ext) return false;
      const isFileTypeLegit = validFileExtensions.includes(
        fileExtensionsAndMimeType.ext as validFileExtensionsType,
      );
      const isMimeTypeLegit = validMimeTypes.includes(
        fileExtensionsAndMimeType.mime as validMimeType,
      );
      //image type (extension) & mime type have to be valid
      const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
      return isFileLegit;
    });
};

//remove file from files
//TODO: delete old file
export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    console.log(error);
  }
};