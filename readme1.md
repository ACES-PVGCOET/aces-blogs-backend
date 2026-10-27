to work on:
tech stack:
    - backend: Nest TS, PostgreSQL
    - frontend: Next TS, Tailwind CSS, TipTap

Blog Storage Architecture:
    - Blog metadata and content will be stored separately
    - Blog metadata contains id and version
    - We can find accurate blog content using blog id and version
    - Blog content (TipTap JSON) is stored as JSONB datatype in separate postgres table

user:
    - id
    - name
    - profileImg
    - linkedIn
    - status [ACTIVE | DELETED | BLOCKED]
    - role [READER | WRITER | REVIWER | ADMIN]

blog:
    - id
    - slug
    - title
    - thumbnail
    - author
    - reviewer
    - status [DRAFT | PUBLISHED | UNDER_REVIEW | REVISION_DRAFT | DELETED | ARCHIVED | REJECT]
    - category
    - tags
    - latest_revision_version
    - latest_published_version
    - created_at
    - modified_at

user-mgmt-api:
    - create user
    - login user
    - update user
    - delete user
    - authorize user

blog-post-api:
    - create blog: create new blog with required details with DRAFT status
    - update blog content: modify content of blog and make status REVISION_DRAFT and update modified_at and increment latest_revision_version
    - publish blog: change status to PUBLISHED and increment latest_published_version and update reviewer
    - delete blog
    - archive blog
    - fetch blogs (based on title, filters or ALL)
    - get content: get content using blog id and latest_published_version from content warehouse
    - get blogs to review: fetch blogs with DRAFT or REVISION_DRAFT status
    - comparison: review changes between latest_published_version and latest_revision_version
    - start review: change status to UNDER_REVIEW and update reviewer
    - reject revision: change status to REJECT

blog-cat-api:
    - get categories
    - create new category: only created during blog publishing (if review is passed)
    - delete categories

blog-uploads-api:
    - upload image: returned URL of uploaded asset on cloud

----------------------------------------------------------------------------------------------------------

editor , blog submission page: pranav dev .pranav mankar
user module: pranav dev, vaishnavi di
blog module: everyone 

----------------------------------------------------------------------------------------------------------

aces-blog-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── generated/prisma/       (already generated)
│   ├── prisma/
│   │   ├── prisma.module.ts    (existing)
│   │   └── prisma.service.ts   (existing)
│   ├── users/
│   │   ├── users.types.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   └── app.module.ts
└── .env