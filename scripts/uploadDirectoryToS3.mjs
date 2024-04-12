import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs/promises";
import path from "path";
import mime from "mime"; // Make sure this import works based on the installed version

const s3Client = new S3Client({ region: "us-west-1" });

async function getMimeType(filePath) {
  return mime.getType(filePath) || "application/octet-stream";
}

async function uploadFile(bucketName, fileKey, filePath) {
  const contentType = await getMimeType(filePath);
  const body = await fs.readFile(filePath);
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: fileKey,
      Body: body,
      ContentType: contentType,
    },
  });

  await upload.done();
  console.log(`Uploaded ${fileKey} with Content-Type: ${contentType}`);
}

async function uploadDirectoryToS3(bucketName, localDirectory, prefix = "") {
  const files = await fs.readdir(localDirectory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(localDirectory, file.name);
    const fileKey = prefix ? path.join(prefix, file.name) : file.name;
    // Skip certain directories except a specific subdirectory
    if (
      file.isDirectory() &&
      filePath.includes("/extensions/") &&
      !filePath.endsWith("/extensions/core")
    ) {
      console.log(`Skipping directory: ${filePath}`);
      continue; // Skip this directory
    }
    try {
      if (file.isFile()) {
        await uploadFile(bucketName, fileKey, filePath);
      } else if (file.isDirectory()) {
        await uploadDirectoryToS3(bucketName, filePath, fileKey);
      }
    } catch (error) {
      console.error(`Error uploading ${fileKey}:`, error);
    }
  }
}

const bucketName = "comfyui-static";
const localDirectory = "comfyui-fork/web";

uploadDirectoryToS3(bucketName, localDirectory)
  .then(() => console.log("Upload completed"))
  .catch((error) => console.error("Upload failed:", error));
