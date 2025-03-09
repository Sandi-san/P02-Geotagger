import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BadRequestException, Logger } from "@nestjs/common";
import { extname } from "path";
import { randomUUID } from "crypto";

type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadImageToS3 = async (
    file: Express.Multer.File,
    oldFileKey?: string
): Promise<string> => {
    if (!file) throw new BadRequestException("No file provided!");

    // Validate file type using mimetype
    if (!validMimeTypes.includes(file.mimetype as validMimeType)) {
        throw new BadRequestException("Invalid file type!");
    }

    //generate unique filename
    const fileExtension = extname(file.originalname);
    const filename = `${randomUUID()}${fileExtension}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    try {
        //store file directly to S3 inside /files directory
        await s3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: `files/${filename}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read", // Allow public (frontend) access
            })
        );
        Logger.log(`File uploaded successfully: ${filename}`);

        // Delete old file if key exists
        if (oldFileKey) {
            try {
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: oldFileKey,
                    })
                );
                Logger.log(`Old file '${oldFileKey}' deleted successfully.`);
            } catch (deleteError) {
                Logger.error(`Failed to delete old file: ${deleteError.message}`);
            }
        }

        //return full generated filename to save inside database
        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/files/${filename}`;
    } catch (error) {
        Logger.error(`S3 upload error: ${error.message}`);
        throw new BadRequestException("Failed to upload file!");
    }
};
