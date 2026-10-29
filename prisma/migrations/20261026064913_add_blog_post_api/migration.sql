-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNDER_REVIEW', 'REVISION_DRAFT', 'DELETED', 'ARCHIVED', 'REJECT');

-- CreateTable
CREATE TABLE "blogs" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(500),
    "author" VARCHAR(100) NOT NULL,
    "reviewer" VARCHAR(100),
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "category" VARCHAR(100),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "latestRevisionVersion" INTEGER NOT NULL DEFAULT 0,
    "latestPublishedVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_contents" (
    "id" UUID NOT NULL,
    "blogId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_author_status_idx" ON "blogs"("author", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_blog_content_version" ON "blog_contents"("blogId", "version");

-- AddForeignKey
ALTER TABLE "blog_contents" ADD CONSTRAINT "blog_contents_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
