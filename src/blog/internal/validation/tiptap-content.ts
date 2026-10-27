import { BadRequestException } from '@nestjs/common';
import { CLOUDINARY_URL_MESSAGE, isCloudinaryUrl } from './cloudinary-url';
import { validateTiptapDocument } from './tiptap-document';

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: TipTapNode[];
  text?: string;
}
export interface TipTapDoc extends TipTapNode {
  type: 'doc';
}

export const EMPTY_DOC: TipTapDoc = { type: 'doc', content: [{ type: 'paragraph' }] };

/** True if the doc has any visible text or an image. Stops empty blogs being submitted. */
export function hasContent(node: TipTapNode): boolean {
  if (node.type === 'image') return true;
  if (typeof node.text === 'string' && node.text.trim().length > 0) return true;
  return (node.content ?? []).some(hasContent);
}

function assertImagesFromCloudinary(node: TipTapNode): void {
  if (node.type === 'image' && !isCloudinaryUrl(node.attrs?.src)) {
    throw new BadRequestException(`Image URL ${CLOUDINARY_URL_MESSAGE}`);
  }
  for (const child of node.content ?? []) assertImagesFromCloudinary(child);
}

/**
 * x's validateTiptapDocument (node/mark allow-lists, size, depth, URL protocols) plus our own rule
 * that images must come from our Cloudinary account. Throws 400.
 */
export function parseTiptapContent(input: unknown): TipTapDoc {
  let doc: Record<string, unknown>;
  try {
    doc = validateTiptapDocument(input);
  } catch (error) {
    throw new BadRequestException(error instanceof Error ? error.message : 'Invalid Tiptap content');
  }
  assertImagesFromCloudinary(doc as unknown as TipTapNode);
  return doc as unknown as TipTapDoc;
}
