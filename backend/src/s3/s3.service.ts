import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>("AWS_REGION");
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY",
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials not properly configured");
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket: string =
      this.configService.get("AWS_BUCKET_NAME") || "ong-connect";
    const key = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    await this.s3Client.send(command);

    return `https://${bucket}.s3.${this.configService.get("AWS_REGION")}.amazonaws.com/${key}`;
  }

  async deleteFile(url: string) {
    const bucket: string =
      this.configService.get("AWS_BUCKET_NAME") || "ong-connect";

    const key = url.split(
      `https://${bucket}.s3.${this.configService.get("AWS_REGION")}.amazonaws.com/`,
    )[1];

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
