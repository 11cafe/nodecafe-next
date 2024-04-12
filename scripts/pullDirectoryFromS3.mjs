import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createWriteStream, promises as fsPromises } from "fs";
import { dirname } from "path";

const { mkdir } = fsPromises;

// Initialize the S3 client
const s3Client = new S3Client({ region: "us-west-1" });

async function pullDirectoryFromS3(
  s3Key = "extensions/",
  bucketName,
  localPath = "./comfyui-fork/web/extensions",
) {
  try {
    const listParams = {
      Bucket: bucketName,
      Prefix: s3Key,
    };

    // List all objects in the bucket with the specified prefix
    const data = await s3Client.send(new ListObjectsV2Command(listParams));

    if (data.Contents?.length) {
      for (const object of data.Contents) {
        const fileKey = object.Key;
        const filePath = fileKey?.replace(s3Key, "");
        const localFilePath = `${localPath}/${filePath}`;

        // Ensure the directory exists
        await mkdir(dirname(localFilePath), { recursive: true });

        // Get the object from S3
        const getObjectParams = {
          Bucket: bucketName,
          Key: fileKey,
        };
        const s3Object = await s3Client.send(
          new GetObjectCommand(getObjectParams),
        );

        // Write the object to a local file
        const writeStream = createWriteStream(localFilePath);
        // @ts-expect-error
        s3Object.Body?.pipe(writeStream);

        console.log(`Downloaded ${fileKey} to ${localFilePath}`);
      }
    } else {
      console.log("No files to download.");
    }
  } catch (error) {
    console.error("Error pulling directory from S3:", error);
  }
}

const bucketName = "comfyui-static";
const s3Key = "extensions/";
const localPath = "./comfyui-fork/web/extensions";

// Call the function
pullDirectoryFromS3(s3Key, bucketName, localPath)
  .then(() => console.log("Download completed"))
  .catch((error) => console.error("Download failed:", error));
