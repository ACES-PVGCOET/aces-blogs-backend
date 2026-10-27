import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Blog: "Blog";
    readonly BlogContent: "BlogContent";
    readonly BlogAuditLog: "BlogAuditLog";
    readonly RoleChangeLog: "RoleChangeLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly profileImg: "profileImg";
    readonly linkedIn: "linkedIn";
    readonly bio: "bio";
    readonly role: "role";
    readonly status: "status";
    readonly sessionVersion: "sessionVersion";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const BlogScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly excerpt: "excerpt";
    readonly thumbnailUrl: "thumbnailUrl";
    readonly category: "category";
    readonly tags: "tags";
    readonly authorId: "authorId";
    readonly reviewerId: "reviewerId";
    readonly status: "status";
    readonly latestRevisionVersion: "latestRevisionVersion";
    readonly latestPublishedVersion: "latestPublishedVersion";
    readonly submittedAt: "submittedAt";
    readonly publishedAt: "publishedAt";
    readonly deletedAt: "deletedAt";
    readonly createdAt: "createdAt";
    readonly modifiedAt: "modifiedAt";
};
export type BlogScalarFieldEnum = (typeof BlogScalarFieldEnum)[keyof typeof BlogScalarFieldEnum];
export declare const BlogContentScalarFieldEnum: {
    readonly id: "id";
    readonly blogId: "blogId";
    readonly version: "version";
    readonly content: "content";
    readonly createdById: "createdById";
    readonly createdAt: "createdAt";
};
export type BlogContentScalarFieldEnum = (typeof BlogContentScalarFieldEnum)[keyof typeof BlogContentScalarFieldEnum];
export declare const BlogAuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly blogId: "blogId";
    readonly action: "action";
    readonly performedBy: "performedBy";
    readonly createdAt: "createdAt";
};
export type BlogAuditLogScalarFieldEnum = (typeof BlogAuditLogScalarFieldEnum)[keyof typeof BlogAuditLogScalarFieldEnum];
export declare const RoleChangeLogScalarFieldEnum: {
    readonly id: "id";
    readonly targetUserId: "targetUserId";
    readonly changedBy: "changedBy";
    readonly oldRole: "oldRole";
    readonly newRole: "newRole";
    readonly createdAt: "createdAt";
};
export type RoleChangeLogScalarFieldEnum = (typeof RoleChangeLogScalarFieldEnum)[keyof typeof RoleChangeLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
