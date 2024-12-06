import { BadRequestException } from "@nestjs/common";
import { join } from "path";
import { isFileExtensionSafe, removeFile } from "../helpers/image-storage.helper";

export const saveImageLocally = async (
    file: Express.Multer.File
): Promise<string> => {
    //save file locally
    const filename = file?.filename;
    if (!filename)
        throw new BadRequestException('File must be of type png, jpg or jpeg!');
    const imagesFolderPath = join(process.cwd(), 'files');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    //check if file is valid and then return new filename
    if (await isFileExtensionSafe(fullImagePath)) {
        return filename
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File is corrupted!');

    //TODO: remove old file, if exists
}