export declare const UserRole: {
    readonly READER: "READER";
    readonly WRITER: "WRITER";
    readonly REVIEWER: "REVIEWER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BLOCKED: "BLOCKED";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BlogStatus: {
    readonly DRAFT: "DRAFT";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly REVISION_DRAFT: "REVISION_DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly REJECT: "REJECT";
    readonly ARCHIVED: "ARCHIVED";
    readonly DELETED: "DELETED";
};
export type BlogStatus = (typeof BlogStatus)[keyof typeof BlogStatus];
