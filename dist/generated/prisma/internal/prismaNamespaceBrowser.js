import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Blog: 'Blog',
    BlogContent: 'BlogContent',
    BlogAuditLog: 'BlogAuditLog',
    RoleChangeLog: 'RoleChangeLog'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    profileImg: 'profileImg',
    linkedIn: 'linkedIn',
    bio: 'bio',
    role: 'role',
    status: 'status',
    sessionVersion: 'sessionVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const BlogScalarFieldEnum = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    thumbnailUrl: 'thumbnailUrl',
    category: 'category',
    tags: 'tags',
    authorId: 'authorId',
    reviewerId: 'reviewerId',
    status: 'status',
    latestRevisionVersion: 'latestRevisionVersion',
    latestPublishedVersion: 'latestPublishedVersion',
    submittedAt: 'submittedAt',
    publishedAt: 'publishedAt',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    modifiedAt: 'modifiedAt'
};
export const BlogContentScalarFieldEnum = {
    id: 'id',
    blogId: 'blogId',
    version: 'version',
    content: 'content',
    createdById: 'createdById',
    createdAt: 'createdAt'
};
export const BlogAuditLogScalarFieldEnum = {
    id: 'id',
    blogId: 'blogId',
    action: 'action',
    performedBy: 'performedBy',
    createdAt: 'createdAt'
};
export const RoleChangeLogScalarFieldEnum = {
    id: 'id',
    targetUserId: 'targetUserId',
    changedBy: 'changedBy',
    oldRole: 'oldRole',
    newRole: 'newRole',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const JsonNullValueInput = {
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map