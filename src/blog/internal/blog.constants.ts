/**
 * One category length limit for the whole project.
 * blogs.category is VARCHAR(100); z's categories.name is capped at 80, so 80 is the value
 * that fits both. Used by every DTO that accepts a category.
 */
export const CATEGORY_MIN_LENGTH = 2;
export const CATEGORY_MAX_LENGTH = 80;

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 200; // blogs.title VARCHAR(200)
export const EXCERPT_MAX_LENGTH = 500; // blogs.excerpt VARCHAR(500)
export const THUMBNAIL_MAX_LENGTH = 2048;

export const MAX_TAGS = 10;
export const TAG_MIN_LENGTH = 2;
export const TAG_MAX_LENGTH = 30;

export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_MAX = 50;
