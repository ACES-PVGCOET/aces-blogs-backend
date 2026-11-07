import { registerDecorator, ValidationOptions } from 'class-validator';

export const CLOUDINARY_HOST = 'res.cloudinary.com';

/**
 * https only, our Cloudinary host only. When CLOUDINARY_CLOUD_NAME is set (z's uploads service uses
 * the same variable) the path must also start with /<cloud name>/, so other people's Cloudinary
 * accounts are rejected too.
 */
export function isCloudinaryUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:' || url.hostname !== CLOUDINARY_HOST) return false;
  if (url.username || url.password || url.port) return false;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  if (cloudName && !url.pathname.startsWith(`/${cloudName}/`)) return false;

  return true;
}

export const CLOUDINARY_URL_MESSAGE = 'must be an https image URL from our Cloudinary account';

export function IsCloudinaryUrl(options?: ValidationOptions) {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'isCloudinaryUrl',
      target: target.constructor,
      propertyName,
      options: { message: `$property ${CLOUDINARY_URL_MESSAGE}`, ...options },
      validator: { validate: (value: unknown) => isCloudinaryUrl(value) },
    });
  };
}
