import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserAvgAggregateOutputType = {
    sessionVersion: number | null;
};
export type UserSumAggregateOutputType = {
    sessionVersion: number | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    profileImg: string | null;
    linkedIn: string | null;
    bio: string | null;
    role: $Enums.UserRole | null;
    status: $Enums.UserStatus | null;
    sessionVersion: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    profileImg: string | null;
    linkedIn: string | null;
    bio: string | null;
    role: $Enums.UserRole | null;
    status: $Enums.UserStatus | null;
    sessionVersion: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    passwordHash: number;
    profileImg: number;
    linkedIn: number;
    bio: number;
    role: number;
    status: number;
    sessionVersion: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserAvgAggregateInputType = {
    sessionVersion?: true;
};
export type UserSumAggregateInputType = {
    sessionVersion?: true;
};
export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    profileImg?: true;
    linkedIn?: true;
    bio?: true;
    role?: true;
    status?: true;
    sessionVersion?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    profileImg?: true;
    linkedIn?: true;
    bio?: true;
    role?: true;
    status?: true;
    sessionVersion?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    profileImg?: true;
    linkedIn?: true;
    bio?: true;
    role?: true;
    status?: true;
    sessionVersion?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg: string | null;
    linkedIn: string | null;
    bio: string | null;
    role: $Enums.UserRole;
    status: $Enums.UserStatus;
    sessionVersion: number;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    profileImg?: Prisma.StringNullableFilter<"User"> | string | null;
    linkedIn?: Prisma.StringNullableFilter<"User"> | string | null;
    bio?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFilter<"User"> | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFilter<"User"> | number;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    authoredBlogs?: Prisma.BlogListRelationFilter;
    reviewedBlogs?: Prisma.BlogListRelationFilter;
    createdBlogContent?: Prisma.BlogContentListRelationFilter;
    blogAuditEvents?: Prisma.BlogAuditLogListRelationFilter;
    roleChangesReceived?: Prisma.RoleChangeLogListRelationFilter;
    roleChangesMade?: Prisma.RoleChangeLogListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    profileImg?: Prisma.SortOrderInput | Prisma.SortOrder;
    linkedIn?: Prisma.SortOrderInput | Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    sessionVersion?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    authoredBlogs?: Prisma.BlogOrderByRelationAggregateInput;
    reviewedBlogs?: Prisma.BlogOrderByRelationAggregateInput;
    createdBlogContent?: Prisma.BlogContentOrderByRelationAggregateInput;
    blogAuditEvents?: Prisma.BlogAuditLogOrderByRelationAggregateInput;
    roleChangesReceived?: Prisma.RoleChangeLogOrderByRelationAggregateInput;
    roleChangesMade?: Prisma.RoleChangeLogOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    profileImg?: Prisma.StringNullableFilter<"User"> | string | null;
    linkedIn?: Prisma.StringNullableFilter<"User"> | string | null;
    bio?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFilter<"User"> | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFilter<"User"> | number;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    authoredBlogs?: Prisma.BlogListRelationFilter;
    reviewedBlogs?: Prisma.BlogListRelationFilter;
    createdBlogContent?: Prisma.BlogContentListRelationFilter;
    blogAuditEvents?: Prisma.BlogAuditLogListRelationFilter;
    roleChangesReceived?: Prisma.RoleChangeLogListRelationFilter;
    roleChangesMade?: Prisma.RoleChangeLogListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    profileImg?: Prisma.SortOrderInput | Prisma.SortOrder;
    linkedIn?: Prisma.SortOrderInput | Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    sessionVersion?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _avg?: Prisma.UserAvgOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
    _sum?: Prisma.UserSumOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    profileImg?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    linkedIn?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    bio?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus;
    sessionVersion?: Prisma.IntWithAggregatesFilter<"User"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    profileImg?: Prisma.SortOrder;
    linkedIn?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    sessionVersion?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvgOrderByAggregateInput = {
    sessionVersion?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    profileImg?: Prisma.SortOrder;
    linkedIn?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    sessionVersion?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    profileImg?: Prisma.SortOrder;
    linkedIn?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    sessionVersion?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserSumOrderByAggregateInput = {
    sessionVersion?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
};
export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutAuthoredBlogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuthoredBlogsInput, Prisma.UserUncheckedCreateWithoutAuthoredBlogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuthoredBlogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutReviewedBlogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutReviewedBlogsInput, Prisma.UserUncheckedCreateWithoutReviewedBlogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutReviewedBlogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAuthoredBlogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuthoredBlogsInput, Prisma.UserUncheckedCreateWithoutAuthoredBlogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuthoredBlogsInput;
    upsert?: Prisma.UserUpsertWithoutAuthoredBlogsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuthoredBlogsInput, Prisma.UserUpdateWithoutAuthoredBlogsInput>, Prisma.UserUncheckedUpdateWithoutAuthoredBlogsInput>;
};
export type UserUpdateOneWithoutReviewedBlogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutReviewedBlogsInput, Prisma.UserUncheckedCreateWithoutReviewedBlogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutReviewedBlogsInput;
    upsert?: Prisma.UserUpsertWithoutReviewedBlogsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutReviewedBlogsInput, Prisma.UserUpdateWithoutReviewedBlogsInput>, Prisma.UserUncheckedUpdateWithoutReviewedBlogsInput>;
};
export type UserCreateNestedOneWithoutCreatedBlogContentInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedBlogContentInput, Prisma.UserUncheckedCreateWithoutCreatedBlogContentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedBlogContentInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCreatedBlogContentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedBlogContentInput, Prisma.UserUncheckedCreateWithoutCreatedBlogContentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedBlogContentInput;
    upsert?: Prisma.UserUpsertWithoutCreatedBlogContentInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCreatedBlogContentInput, Prisma.UserUpdateWithoutCreatedBlogContentInput>, Prisma.UserUncheckedUpdateWithoutCreatedBlogContentInput>;
};
export type UserCreateNestedOneWithoutBlogAuditEventsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBlogAuditEventsInput, Prisma.UserUncheckedCreateWithoutBlogAuditEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBlogAuditEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutBlogAuditEventsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBlogAuditEventsInput, Prisma.UserUncheckedCreateWithoutBlogAuditEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBlogAuditEventsInput;
    upsert?: Prisma.UserUpsertWithoutBlogAuditEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutBlogAuditEventsInput, Prisma.UserUpdateWithoutBlogAuditEventsInput>, Prisma.UserUncheckedUpdateWithoutBlogAuditEventsInput>;
};
export type UserCreateNestedOneWithoutRoleChangesReceivedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedCreateWithoutRoleChangesReceivedInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleChangesReceivedInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutRoleChangesMadeInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesMadeInput, Prisma.UserUncheckedCreateWithoutRoleChangesMadeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleChangesMadeInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutRoleChangesReceivedNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedCreateWithoutRoleChangesReceivedInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleChangesReceivedInput;
    upsert?: Prisma.UserUpsertWithoutRoleChangesReceivedInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRoleChangesReceivedInput, Prisma.UserUpdateWithoutRoleChangesReceivedInput>, Prisma.UserUncheckedUpdateWithoutRoleChangesReceivedInput>;
};
export type UserUpdateOneRequiredWithoutRoleChangesMadeNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesMadeInput, Prisma.UserUncheckedCreateWithoutRoleChangesMadeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleChangesMadeInput;
    upsert?: Prisma.UserUpsertWithoutRoleChangesMadeInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRoleChangesMadeInput, Prisma.UserUpdateWithoutRoleChangesMadeInput>, Prisma.UserUncheckedUpdateWithoutRoleChangesMadeInput>;
};
export type UserCreateWithoutAuthoredBlogsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutAuthoredBlogsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutAuthoredBlogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuthoredBlogsInput, Prisma.UserUncheckedCreateWithoutAuthoredBlogsInput>;
};
export type UserCreateWithoutReviewedBlogsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutReviewedBlogsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutReviewedBlogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutReviewedBlogsInput, Prisma.UserUncheckedCreateWithoutReviewedBlogsInput>;
};
export type UserUpsertWithoutAuthoredBlogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuthoredBlogsInput, Prisma.UserUncheckedUpdateWithoutAuthoredBlogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuthoredBlogsInput, Prisma.UserUncheckedCreateWithoutAuthoredBlogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuthoredBlogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuthoredBlogsInput, Prisma.UserUncheckedUpdateWithoutAuthoredBlogsInput>;
};
export type UserUpdateWithoutAuthoredBlogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutAuthoredBlogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUpsertWithoutReviewedBlogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutReviewedBlogsInput, Prisma.UserUncheckedUpdateWithoutReviewedBlogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutReviewedBlogsInput, Prisma.UserUncheckedCreateWithoutReviewedBlogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutReviewedBlogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutReviewedBlogsInput, Prisma.UserUncheckedUpdateWithoutReviewedBlogsInput>;
};
export type UserUpdateWithoutReviewedBlogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutReviewedBlogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutCreatedBlogContentInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutCreatedBlogContentInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutCreatedBlogContentInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedBlogContentInput, Prisma.UserUncheckedCreateWithoutCreatedBlogContentInput>;
};
export type UserUpsertWithoutCreatedBlogContentInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCreatedBlogContentInput, Prisma.UserUncheckedUpdateWithoutCreatedBlogContentInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedBlogContentInput, Prisma.UserUncheckedCreateWithoutCreatedBlogContentInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCreatedBlogContentInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCreatedBlogContentInput, Prisma.UserUncheckedUpdateWithoutCreatedBlogContentInput>;
};
export type UserUpdateWithoutCreatedBlogContentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutCreatedBlogContentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutBlogAuditEventsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutBlogAuditEventsInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutBlogAuditEventsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutBlogAuditEventsInput, Prisma.UserUncheckedCreateWithoutBlogAuditEventsInput>;
};
export type UserUpsertWithoutBlogAuditEventsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutBlogAuditEventsInput, Prisma.UserUncheckedUpdateWithoutBlogAuditEventsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutBlogAuditEventsInput, Prisma.UserUncheckedCreateWithoutBlogAuditEventsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutBlogAuditEventsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutBlogAuditEventsInput, Prisma.UserUncheckedUpdateWithoutBlogAuditEventsInput>;
};
export type UserUpdateWithoutBlogAuditEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutBlogAuditEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutRoleChangesReceivedInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesMade?: Prisma.RoleChangeLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutRoleChangesReceivedInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutRoleChangesReceivedInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedCreateWithoutRoleChangesReceivedInput>;
};
export type UserCreateWithoutRoleChangesMadeInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogCreateNestedManyWithoutTargetUserInput;
};
export type UserUncheckedCreateWithoutRoleChangesMadeInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    profileImg?: string | null;
    linkedIn?: string | null;
    bio?: string | null;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    sessionVersion?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authoredBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutAuthorInput;
    reviewedBlogs?: Prisma.BlogUncheckedCreateNestedManyWithoutReviewerInput;
    createdBlogContent?: Prisma.BlogContentUncheckedCreateNestedManyWithoutCreatedByInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedCreateNestedManyWithoutActorInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput;
};
export type UserCreateOrConnectWithoutRoleChangesMadeInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesMadeInput, Prisma.UserUncheckedCreateWithoutRoleChangesMadeInput>;
};
export type UserUpsertWithoutRoleChangesReceivedInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedUpdateWithoutRoleChangesReceivedInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedCreateWithoutRoleChangesReceivedInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutRoleChangesReceivedInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRoleChangesReceivedInput, Prisma.UserUncheckedUpdateWithoutRoleChangesReceivedInput>;
};
export type UserUpdateWithoutRoleChangesReceivedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutRoleChangesReceivedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesMade?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUpsertWithoutRoleChangesMadeInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutRoleChangesMadeInput, Prisma.UserUncheckedUpdateWithoutRoleChangesMadeInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleChangesMadeInput, Prisma.UserUncheckedCreateWithoutRoleChangesMadeInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutRoleChangesMadeInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRoleChangesMadeInput, Prisma.UserUncheckedUpdateWithoutRoleChangesMadeInput>;
};
export type UserUpdateWithoutRoleChangesMadeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUpdateManyWithoutTargetUserNestedInput;
};
export type UserUncheckedUpdateWithoutRoleChangesMadeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    profileImg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    linkedIn?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    sessionVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authoredBlogs?: Prisma.BlogUncheckedUpdateManyWithoutAuthorNestedInput;
    reviewedBlogs?: Prisma.BlogUncheckedUpdateManyWithoutReviewerNestedInput;
    createdBlogContent?: Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput;
    blogAuditEvents?: Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput;
    roleChangesReceived?: Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput;
};
export type UserCountOutputType = {
    authoredBlogs: number;
    reviewedBlogs: number;
    createdBlogContent: number;
    blogAuditEvents: number;
    roleChangesReceived: number;
    roleChangesMade: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    authoredBlogs?: boolean | UserCountOutputTypeCountAuthoredBlogsArgs;
    reviewedBlogs?: boolean | UserCountOutputTypeCountReviewedBlogsArgs;
    createdBlogContent?: boolean | UserCountOutputTypeCountCreatedBlogContentArgs;
    blogAuditEvents?: boolean | UserCountOutputTypeCountBlogAuditEventsArgs;
    roleChangesReceived?: boolean | UserCountOutputTypeCountRoleChangesReceivedArgs;
    roleChangesMade?: boolean | UserCountOutputTypeCountRoleChangesMadeArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountAuthoredBlogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogWhereInput;
};
export type UserCountOutputTypeCountReviewedBlogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogWhereInput;
};
export type UserCountOutputTypeCountCreatedBlogContentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogContentWhereInput;
};
export type UserCountOutputTypeCountBlogAuditEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogAuditLogWhereInput;
};
export type UserCountOutputTypeCountRoleChangesReceivedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleChangeLogWhereInput;
};
export type UserCountOutputTypeCountRoleChangesMadeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleChangeLogWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    profileImg?: boolean;
    linkedIn?: boolean;
    bio?: boolean;
    role?: boolean;
    status?: boolean;
    sessionVersion?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    authoredBlogs?: boolean | Prisma.User$authoredBlogsArgs<ExtArgs>;
    reviewedBlogs?: boolean | Prisma.User$reviewedBlogsArgs<ExtArgs>;
    createdBlogContent?: boolean | Prisma.User$createdBlogContentArgs<ExtArgs>;
    blogAuditEvents?: boolean | Prisma.User$blogAuditEventsArgs<ExtArgs>;
    roleChangesReceived?: boolean | Prisma.User$roleChangesReceivedArgs<ExtArgs>;
    roleChangesMade?: boolean | Prisma.User$roleChangesMadeArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    profileImg?: boolean;
    linkedIn?: boolean;
    bio?: boolean;
    role?: boolean;
    status?: boolean;
    sessionVersion?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    profileImg?: boolean;
    linkedIn?: boolean;
    bio?: boolean;
    role?: boolean;
    status?: boolean;
    sessionVersion?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    profileImg?: boolean;
    linkedIn?: boolean;
    bio?: boolean;
    role?: boolean;
    status?: boolean;
    sessionVersion?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "profileImg" | "linkedIn" | "bio" | "role" | "status" | "sessionVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    authoredBlogs?: boolean | Prisma.User$authoredBlogsArgs<ExtArgs>;
    reviewedBlogs?: boolean | Prisma.User$reviewedBlogsArgs<ExtArgs>;
    createdBlogContent?: boolean | Prisma.User$createdBlogContentArgs<ExtArgs>;
    blogAuditEvents?: boolean | Prisma.User$blogAuditEventsArgs<ExtArgs>;
    roleChangesReceived?: boolean | Prisma.User$roleChangesReceivedArgs<ExtArgs>;
    roleChangesMade?: boolean | Prisma.User$roleChangesMadeArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        authoredBlogs: Prisma.$BlogPayload<ExtArgs>[];
        reviewedBlogs: Prisma.$BlogPayload<ExtArgs>[];
        createdBlogContent: Prisma.$BlogContentPayload<ExtArgs>[];
        blogAuditEvents: Prisma.$BlogAuditLogPayload<ExtArgs>[];
        roleChangesReceived: Prisma.$RoleChangeLogPayload<ExtArgs>[];
        roleChangesMade: Prisma.$RoleChangeLogPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: $Enums.UserRole;
        status: $Enums.UserStatus;
        sessionVersion: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    authoredBlogs<T extends Prisma.User$authoredBlogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$authoredBlogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reviewedBlogs<T extends Prisma.User$reviewedBlogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$reviewedBlogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    createdBlogContent<T extends Prisma.User$createdBlogContentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$createdBlogContentArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    blogAuditEvents<T extends Prisma.User$blogAuditEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$blogAuditEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    roleChangesReceived<T extends Prisma.User$roleChangesReceivedArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$roleChangesReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    roleChangesMade<T extends Prisma.User$roleChangesMadeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$roleChangesMadeArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly profileImg: Prisma.FieldRef<"User", 'String'>;
    readonly linkedIn: Prisma.FieldRef<"User", 'String'>;
    readonly bio: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'UserRole'>;
    readonly status: Prisma.FieldRef<"User", 'UserStatus'>;
    readonly sessionVersion: Prisma.FieldRef<"User", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$authoredBlogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogSelect<ExtArgs> | null;
    omit?: Prisma.BlogOmit<ExtArgs> | null;
    include?: Prisma.BlogInclude<ExtArgs> | null;
    where?: Prisma.BlogWhereInput;
    orderBy?: Prisma.BlogOrderByWithRelationInput | Prisma.BlogOrderByWithRelationInput[];
    cursor?: Prisma.BlogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlogScalarFieldEnum | Prisma.BlogScalarFieldEnum[];
};
export type User$reviewedBlogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogSelect<ExtArgs> | null;
    omit?: Prisma.BlogOmit<ExtArgs> | null;
    include?: Prisma.BlogInclude<ExtArgs> | null;
    where?: Prisma.BlogWhereInput;
    orderBy?: Prisma.BlogOrderByWithRelationInput | Prisma.BlogOrderByWithRelationInput[];
    cursor?: Prisma.BlogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlogScalarFieldEnum | Prisma.BlogScalarFieldEnum[];
};
export type User$createdBlogContentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    where?: Prisma.BlogContentWhereInput;
    orderBy?: Prisma.BlogContentOrderByWithRelationInput | Prisma.BlogContentOrderByWithRelationInput[];
    cursor?: Prisma.BlogContentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlogContentScalarFieldEnum | Prisma.BlogContentScalarFieldEnum[];
};
export type User$blogAuditEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    where?: Prisma.BlogAuditLogWhereInput;
    orderBy?: Prisma.BlogAuditLogOrderByWithRelationInput | Prisma.BlogAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BlogAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlogAuditLogScalarFieldEnum | Prisma.BlogAuditLogScalarFieldEnum[];
};
export type User$roleChangesReceivedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where?: Prisma.RoleChangeLogWhereInput;
    orderBy?: Prisma.RoleChangeLogOrderByWithRelationInput | Prisma.RoleChangeLogOrderByWithRelationInput[];
    cursor?: Prisma.RoleChangeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoleChangeLogScalarFieldEnum | Prisma.RoleChangeLogScalarFieldEnum[];
};
export type User$roleChangesMadeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where?: Prisma.RoleChangeLogWhereInput;
    orderBy?: Prisma.RoleChangeLogOrderByWithRelationInput | Prisma.RoleChangeLogOrderByWithRelationInput[];
    cursor?: Prisma.RoleChangeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoleChangeLogScalarFieldEnum | Prisma.RoleChangeLogScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
