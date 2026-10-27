const ALLOWED_NODES = new Set([
  'doc',
  'paragraph',
  'text',
  'heading',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
  'hardBreak',
  'horizontalRule',
  'image',
  'codeBlock',
]);

const ALLOWED_MARKS = new Set([
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'link',
]);

const MAX_BYTES = 1_000_000;
const MAX_NODES = 10_000;
const MAX_DEPTH = 40;

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateUrl(value: unknown, field: string): void {
  if (typeof value !== 'string' || value.length > 2048) {
    throw new Error(`Invalid ${field}`);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid ${field}`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${field} must use HTTP or HTTPS`);
  }
}

export function validateTiptapDocument(input: unknown): JsonObject {
  if (!isObject(input) || input.type !== 'doc') {
    throw new Error('Content must be a Tiptap document');
  }

  const serialized = JSON.stringify(input);

  if (Buffer.byteLength(serialized, 'utf8') > MAX_BYTES) {
    throw new Error('Tiptap document exceeds 1 MB');
  }

  let count = 0;

  function visit(value: unknown, depth: number): void {
    if (!isObject(value)) {
      throw new Error('Invalid Tiptap node');
    }

    if (depth > MAX_DEPTH || ++count > MAX_NODES) {
      throw new Error('Tiptap document limits exceeded');
    }

    if (typeof value.type !== 'string' || !ALLOWED_NODES.has(value.type)) {
      throw new Error(`Unsupported node type: ${String(value.type)}`);
    }

    if (value.type === 'text' && typeof value.text !== 'string') {
      throw new Error('Text nodes must contain text');
    }

    if (value.type === 'heading') {
      const attrs = isObject(value.attrs) ? value.attrs : {};
      const level = attrs.level ?? 2;

      if (level !== 2 && level !== 3) {
        throw new Error('Only heading levels 2 and 3 are allowed');
      }
    }

    if (value.type === 'image') {
      const attrs = isObject(value.attrs) ? value.attrs : {};
      validateUrl(attrs.src, 'image URL');
    }

    if (value.marks !== undefined) {
      if (!Array.isArray(value.marks)) {
        throw new Error('Marks must be an array');
      }

      for (const mark of value.marks) {
        if (!isObject(mark) || typeof mark.type !== 'string') {
          throw new Error('Invalid Tiptap mark');
        }

        if (!ALLOWED_MARKS.has(mark.type)) {
          throw new Error(`Unsupported mark: ${mark.type}`);
        }

        if (mark.type === 'link') {
          const attrs = isObject(mark.attrs) ? mark.attrs : {};
          validateUrl(attrs.href, 'link URL');
        }
      }
    }

    if (value.content !== undefined) {
      if (!Array.isArray(value.content)) {
        throw new Error('Node content must be an array');
      }

      for (const child of value.content) {
        visit(child, depth + 1);
      }
    }
  }

  visit(input, 0);
  return input;
}