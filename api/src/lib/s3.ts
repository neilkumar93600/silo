import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env.js";

export const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const UPLOAD_URL_TTL_SECONDS = 15 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

export function presignUpload(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: UPLOAD_URL_TTL_SECONDS });
}

export function presignDownload(key: string, downloadName: string, inline = false) {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ...(inline
      ? { ResponseContentDisposition: "inline" }
      : { ResponseContentDisposition: `attachment; filename="${encodeURIComponent(downloadName)}"` }),
  });
  return getSignedUrl(s3, command, { expiresIn: DOWNLOAD_URL_TTL_SECONDS });
}

export async function headObject(key: string) {
  try {
    const result = await s3.send(new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
    return { exists: true as const, size: result.ContentLength ?? 0, contentType: result.ContentType ?? "" };
  } catch (err) {
    return { exists: false as const };
  }
}

export function deleteObject(key: string) {
  return s3.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
}
