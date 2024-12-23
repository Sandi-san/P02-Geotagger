import { BadRequestException, Logger } from "@nestjs/common";
import { join } from "path";
import { isFileExtensionSafe, removeFile } from "../helpers/image-storage.helper";
import { promises as fs } from 'fs';

export const saveImageLocally = async (
    file: Express.Multer.File,
    oldFileLocation?: string
): Promise<string> => {
    //save file locally
    const filename = file?.filename;
    if (!filename)
        throw new BadRequestException('File must be of type png, jpg or jpeg!');
    const imagesFolderPath = join(process.cwd(), 'files');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    //if oldFileLocation variable was passed
    if (oldFileLocation) {
        try {
            const oldFilePath = join(imagesFolderPath, oldFileLocation);
            await fs.access(oldFilePath); //check if file exists
            removeFile(oldFilePath); //delete old file
            Logger.log(`Old file '${oldFileLocation}' deleted successfully.`);
        } catch (error) {
            //file does not exist or cannot be accessed
            if (error.code !== 'ENOENT') {
                Logger.error(`Failed to delete old file: ${error.message}`);
            }
        }
    }

    //console.log(`Path: ${fullImagePath}`)

    //check if file is valid and then return new filename
    if (await isFileExtensionSafe(fullImagePath)) {
        return filename
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File is corrupted!');
}