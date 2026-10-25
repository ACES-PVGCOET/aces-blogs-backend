import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
@Injectable()
export class UploadsService {
  constructor(config: ConfigService) {
    cloudinary.config({ cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'), api_key: config.get<string>('CLOUDINARY_API_KEY'), api_secret: config.get<string>('CLOUDINARY_API_SECRET'), secure: true });
  }
  async upload(file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image file is required');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Only image files are allowed');
    if (file.size > 5 * 1024 * 1024) throw new BadRequestException('Maximum image size is 5 MB');
    try {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'aces-blog' }, (error, result) => error ? reject(error) : resolve(result));
        Readable.from(file.buffer).pipe(stream);
      });
      return { url: result.secure_url, publicId: result.public_id };
    } catch { throw new InternalServerErrorException('Image upload failed; check Cloudinary configuration'); }
  }
}
