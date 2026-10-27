import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BlogAuditLogModel = runtime.Types.Result.DefaultSelection<Prisma.$BlogAuditLogPayload>;
export type AggregateBlogAuditLog = {
    _count: BlogAuditLogCountAggregateOutputType | null;
    _min: BlogAuditLogMinAggregateOutputType | null;
    _max: BlogAuditLogMaxAggregateOutputType | null;
};
export type BlogAuditLogMinAggregateOutputType = {
    id: string | null;
    blogId: string | null;
    action: string | null;
    performedBy: string | null;
    createdAt: Date | null;
};
export type BlogAuditLogMaxAggregateOutputType = {
    id: string | null;
    blogId: string | null;
    action: string | null;
    performedBy: string | null;
    createdAt: Date | null;
};
export type BlogAuditLogCountAggregateOutputType = {
    id: number;
    blogId: number;
    action: number;
    performedBy: number;
    createdAt: number;
    _all: number;
};
export type BlogAuditLogMinAggregateInputType = {
    id?: true;
    blogId?: true;
    action?: true;
    performedBy?: true;
    createdAt?: true;
};
export type BlogAuditLogMaxAggregateInputType = {
    id?: true;
    blogId?: true;
    action?: true;
    performedBy?: true;
    createdAt?: true;
};
export type BlogAuditLogCountAggregateInputType = {
    id?: true;
    blogId?: true;
    action?: true;
    performedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type BlogAuditLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogAuditLogWhereInput;
    orderBy?: Prisma.BlogAuditLogOrderByWithRelationInput | Prisma.BlogAuditLogOrderByWithRelationInput[];
    cursor?: Prisma.BlogAuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BlogAuditLogCountAggregateInputType;
    _min?: BlogAuditLogMinAggregateInputType;
    _max?: BlogAuditLogMaxAggregateInputType;
};
export type GetBlogAuditLogAggregateType<T extends BlogAuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogAuditLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlogAuditLog[P]> : Prisma.GetScalarType<T[P], AggregateBlogAuditLog[P]>;
};
export type BlogAuditLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogAuditLogWhereInput;
    orderBy?: Prisma.BlogAuditLogOrderByWithAggregationInput | Prisma.BlogAuditLogOrderByWithAggregationInput[];
    by: Prisma.BlogAuditLogScalarFieldEnum[] | Prisma.BlogAuditLogScalarFieldEnum;
    having?: Prisma.BlogAuditLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BlogAuditLogCountAggregateInputType | true;
    _min?: BlogAuditLogMinAggregateInputType;
    _max?: BlogAuditLogMaxAggregateInputType;
};
export type BlogAuditLogGroupByOutputType = {
    id: string;
    blogId: string;
    action: string;
    performedBy: string;
    createdAt: Date;
    _count: BlogAuditLogCountAggregateOutputType | null;
    _min: BlogAuditLogMinAggregateOutputType | null;
    _max: BlogAuditLogMaxAggregateOutputType | null;
};
export type GetBlogAuditLogGroupByPayload<T extends BlogAuditLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BlogAuditLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BlogAuditLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BlogAuditLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BlogAuditLogGroupByOutputType[P]>;
}>>;
export type BlogAuditLogWhereInput = {
    AND?: Prisma.BlogAuditLogWhereInput | Prisma.BlogAuditLogWhereInput[];
    OR?: Prisma.BlogAuditLogWhereInput[];
    NOT?: Prisma.BlogAuditLogWhereInput | Prisma.BlogAuditLogWhereInput[];
    id?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    blogId?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    action?: Prisma.StringFilter<"BlogAuditLog"> | string;
    performedBy?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogAuditLog"> | Date | string;
    blog?: Prisma.XOR<Prisma.BlogScalarRelationFilter, Prisma.BlogWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type BlogAuditLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    blog?: Prisma.BlogOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type BlogAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BlogAuditLogWhereInput | Prisma.BlogAuditLogWhereInput[];
    OR?: Prisma.BlogAuditLogWhereInput[];
    NOT?: Prisma.BlogAuditLogWhereInput | Prisma.BlogAuditLogWhereInput[];
    blogId?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    action?: Prisma.StringFilter<"BlogAuditLog"> | string;
    performedBy?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogAuditLog"> | Date | string;
    blog?: Prisma.XOR<Prisma.BlogScalarRelationFilter, Prisma.BlogWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type BlogAuditLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BlogAuditLogCountOrderByAggregateInput;
    _max?: Prisma.BlogAuditLogMaxOrderByAggregateInput;
    _min?: Prisma.BlogAuditLogMinOrderByAggregateInput;
};
export type BlogAuditLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.BlogAuditLogScalarWhereWithAggregatesInput | Prisma.BlogAuditLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.BlogAuditLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BlogAuditLogScalarWhereWithAggregatesInput | Prisma.BlogAuditLogScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"BlogAuditLog"> | string;
    blogId?: Prisma.UuidWithAggregatesFilter<"BlogAuditLog"> | string;
    action?: Prisma.StringWithAggregatesFilter<"BlogAuditLog"> | string;
    performedBy?: Prisma.UuidWithAggregatesFilter<"BlogAuditLog"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BlogAuditLog"> | Date | string;
};
export type BlogAuditLogCreateInput = {
    id?: string;
    action: string;
    createdAt?: Date | string;
    blog: Prisma.BlogCreateNestedOneWithoutAuditLogsInput;
    actor: Prisma.UserCreateNestedOneWithoutBlogAuditEventsInput;
};
export type BlogAuditLogUncheckedCreateInput = {
    id?: string;
    blogId: string;
    action: string;
    performedBy: string;
    createdAt?: Date | string;
};
export type BlogAuditLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blog?: Prisma.BlogUpdateOneRequiredWithoutAuditLogsNestedInput;
    actor?: Prisma.UserUpdateOneRequiredWithoutBlogAuditEventsNestedInput;
};
export type BlogAuditLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogCreateManyInput = {
    id?: string;
    blogId: string;
    action: string;
    performedBy: string;
    createdAt?: Date | string;
};
export type BlogAuditLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogListRelationFilter = {
    every?: Prisma.BlogAuditLogWhereInput;
    some?: Prisma.BlogAuditLogWhereInput;
    none?: Prisma.BlogAuditLogWhereInput;
};
export type BlogAuditLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BlogAuditLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogAuditLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogAuditLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogAuditLogCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput> | Prisma.BlogAuditLogCreateWithoutActorInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutActorInput | Prisma.BlogAuditLogCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.BlogAuditLogCreateManyActorInputEnvelope;
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
};
export type BlogAuditLogUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput> | Prisma.BlogAuditLogCreateWithoutActorInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutActorInput | Prisma.BlogAuditLogCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.BlogAuditLogCreateManyActorInputEnvelope;
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
};
export type BlogAuditLogUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput> | Prisma.BlogAuditLogCreateWithoutActorInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutActorInput | Prisma.BlogAuditLogCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutActorInput | Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.BlogAuditLogCreateManyActorInputEnvelope;
    set?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    disconnect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    delete?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    update?: Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutActorInput | Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.BlogAuditLogUpdateManyWithWhereWithoutActorInput | Prisma.BlogAuditLogUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
};
export type BlogAuditLogUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput> | Prisma.BlogAuditLogCreateWithoutActorInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutActorInput | Prisma.BlogAuditLogCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutActorInput | Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.BlogAuditLogCreateManyActorInputEnvelope;
    set?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    disconnect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    delete?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    update?: Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutActorInput | Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.BlogAuditLogUpdateManyWithWhereWithoutActorInput | Prisma.BlogAuditLogUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
};
export type BlogAuditLogCreateNestedManyWithoutBlogInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput> | Prisma.BlogAuditLogCreateWithoutBlogInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput | Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput[];
    createMany?: Prisma.BlogAuditLogCreateManyBlogInputEnvelope;
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
};
export type BlogAuditLogUncheckedCreateNestedManyWithoutBlogInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput> | Prisma.BlogAuditLogCreateWithoutBlogInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput | Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput[];
    createMany?: Prisma.BlogAuditLogCreateManyBlogInputEnvelope;
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
};
export type BlogAuditLogUpdateManyWithoutBlogNestedInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput> | Prisma.BlogAuditLogCreateWithoutBlogInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput | Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput[];
    upsert?: Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutBlogInput | Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutBlogInput[];
    createMany?: Prisma.BlogAuditLogCreateManyBlogInputEnvelope;
    set?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    disconnect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    delete?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    update?: Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutBlogInput | Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutBlogInput[];
    updateMany?: Prisma.BlogAuditLogUpdateManyWithWhereWithoutBlogInput | Prisma.BlogAuditLogUpdateManyWithWhereWithoutBlogInput[];
    deleteMany?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
};
export type BlogAuditLogUncheckedUpdateManyWithoutBlogNestedInput = {
    create?: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput> | Prisma.BlogAuditLogCreateWithoutBlogInput[] | Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput | Prisma.BlogAuditLogCreateOrConnectWithoutBlogInput[];
    upsert?: Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutBlogInput | Prisma.BlogAuditLogUpsertWithWhereUniqueWithoutBlogInput[];
    createMany?: Prisma.BlogAuditLogCreateManyBlogInputEnvelope;
    set?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    disconnect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    delete?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    connect?: Prisma.BlogAuditLogWhereUniqueInput | Prisma.BlogAuditLogWhereUniqueInput[];
    update?: Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutBlogInput | Prisma.BlogAuditLogUpdateWithWhereUniqueWithoutBlogInput[];
    updateMany?: Prisma.BlogAuditLogUpdateManyWithWhereWithoutBlogInput | Prisma.BlogAuditLogUpdateManyWithWhereWithoutBlogInput[];
    deleteMany?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
};
export type BlogAuditLogCreateWithoutActorInput = {
    id?: string;
    action: string;
    createdAt?: Date | string;
    blog: Prisma.BlogCreateNestedOneWithoutAuditLogsInput;
};
export type BlogAuditLogUncheckedCreateWithoutActorInput = {
    id?: string;
    blogId: string;
    action: string;
    createdAt?: Date | string;
};
export type BlogAuditLogCreateOrConnectWithoutActorInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput>;
};
export type BlogAuditLogCreateManyActorInputEnvelope = {
    data: Prisma.BlogAuditLogCreateManyActorInput | Prisma.BlogAuditLogCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type BlogAuditLogUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.BlogAuditLogUpdateWithoutActorInput, Prisma.BlogAuditLogUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutActorInput, Prisma.BlogAuditLogUncheckedCreateWithoutActorInput>;
};
export type BlogAuditLogUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateWithoutActorInput, Prisma.BlogAuditLogUncheckedUpdateWithoutActorInput>;
};
export type BlogAuditLogUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.BlogAuditLogScalarWhereInput;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateManyMutationInput, Prisma.BlogAuditLogUncheckedUpdateManyWithoutActorInput>;
};
export type BlogAuditLogScalarWhereInput = {
    AND?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
    OR?: Prisma.BlogAuditLogScalarWhereInput[];
    NOT?: Prisma.BlogAuditLogScalarWhereInput | Prisma.BlogAuditLogScalarWhereInput[];
    id?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    blogId?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    action?: Prisma.StringFilter<"BlogAuditLog"> | string;
    performedBy?: Prisma.UuidFilter<"BlogAuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogAuditLog"> | Date | string;
};
export type BlogAuditLogCreateWithoutBlogInput = {
    id?: string;
    action: string;
    createdAt?: Date | string;
    actor: Prisma.UserCreateNestedOneWithoutBlogAuditEventsInput;
};
export type BlogAuditLogUncheckedCreateWithoutBlogInput = {
    id?: string;
    action: string;
    performedBy: string;
    createdAt?: Date | string;
};
export type BlogAuditLogCreateOrConnectWithoutBlogInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput>;
};
export type BlogAuditLogCreateManyBlogInputEnvelope = {
    data: Prisma.BlogAuditLogCreateManyBlogInput | Prisma.BlogAuditLogCreateManyBlogInput[];
    skipDuplicates?: boolean;
};
export type BlogAuditLogUpsertWithWhereUniqueWithoutBlogInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.BlogAuditLogUpdateWithoutBlogInput, Prisma.BlogAuditLogUncheckedUpdateWithoutBlogInput>;
    create: Prisma.XOR<Prisma.BlogAuditLogCreateWithoutBlogInput, Prisma.BlogAuditLogUncheckedCreateWithoutBlogInput>;
};
export type BlogAuditLogUpdateWithWhereUniqueWithoutBlogInput = {
    where: Prisma.BlogAuditLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateWithoutBlogInput, Prisma.BlogAuditLogUncheckedUpdateWithoutBlogInput>;
};
export type BlogAuditLogUpdateManyWithWhereWithoutBlogInput = {
    where: Prisma.BlogAuditLogScalarWhereInput;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateManyMutationInput, Prisma.BlogAuditLogUncheckedUpdateManyWithoutBlogInput>;
};
export type BlogAuditLogCreateManyActorInput = {
    id?: string;
    blogId: string;
    action: string;
    createdAt?: Date | string;
};
export type BlogAuditLogUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blog?: Prisma.BlogUpdateOneRequiredWithoutAuditLogsNestedInput;
};
export type BlogAuditLogUncheckedUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogCreateManyBlogInput = {
    id?: string;
    action: string;
    performedBy: string;
    createdAt?: Date | string;
};
export type BlogAuditLogUpdateWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneRequiredWithoutBlogAuditEventsNestedInput;
};
export type BlogAuditLogUncheckedUpdateWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogUncheckedUpdateManyWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogAuditLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    action?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogAuditLog"]>;
export type BlogAuditLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    action?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogAuditLog"]>;
export type BlogAuditLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    action?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogAuditLog"]>;
export type BlogAuditLogSelectScalar = {
    id?: boolean;
    blogId?: boolean;
    action?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
};
export type BlogAuditLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "blogId" | "action" | "performedBy" | "createdAt", ExtArgs["result"]["blogAuditLog"]>;
export type BlogAuditLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlogAuditLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlogAuditLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BlogAuditLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BlogAuditLog";
    objects: {
        blog: Prisma.$BlogPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        blogId: string;
        action: string;
        performedBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["blogAuditLog"]>;
    composites: {};
};
export type BlogAuditLogGetPayload<S extends boolean | null | undefined | BlogAuditLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload, S>;
export type BlogAuditLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BlogAuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BlogAuditLogCountAggregateInputType | true;
};
export interface BlogAuditLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BlogAuditLog'];
        meta: {
            name: 'BlogAuditLog';
        };
    };
    findUnique<T extends BlogAuditLogFindUniqueArgs>(args: Prisma.SelectSubset<T, BlogAuditLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BlogAuditLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BlogAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BlogAuditLogFindFirstArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BlogAuditLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BlogAuditLogFindManyArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BlogAuditLogCreateArgs>(args: Prisma.SelectSubset<T, BlogAuditLogCreateArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BlogAuditLogCreateManyArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BlogAuditLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BlogAuditLogDeleteArgs>(args: Prisma.SelectSubset<T, BlogAuditLogDeleteArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BlogAuditLogUpdateArgs>(args: Prisma.SelectSubset<T, BlogAuditLogUpdateArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BlogAuditLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, BlogAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BlogAuditLogUpdateManyArgs>(args: Prisma.SelectSubset<T, BlogAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BlogAuditLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BlogAuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BlogAuditLogUpsertArgs>(args: Prisma.SelectSubset<T, BlogAuditLogUpsertArgs<ExtArgs>>): Prisma.Prisma__BlogAuditLogClient<runtime.Types.Result.GetResult<Prisma.$BlogAuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BlogAuditLogCountArgs>(args?: Prisma.Subset<T, BlogAuditLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BlogAuditLogCountAggregateOutputType> : number>;
    aggregate<T extends BlogAuditLogAggregateArgs>(args: Prisma.Subset<T, BlogAuditLogAggregateArgs>): Prisma.PrismaPromise<GetBlogAuditLogAggregateType<T>>;
    groupBy<T extends BlogAuditLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BlogAuditLogGroupByArgs['orderBy'];
    } : {
        orderBy?: BlogAuditLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BlogAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BlogAuditLogFieldRefs;
}
export interface Prisma__BlogAuditLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blog<T extends Prisma.BlogDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BlogDefaultArgs<ExtArgs>>): Prisma.Prisma__BlogClient<runtime.Types.Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BlogAuditLogFieldRefs {
    readonly id: Prisma.FieldRef<"BlogAuditLog", 'String'>;
    readonly blogId: Prisma.FieldRef<"BlogAuditLog", 'String'>;
    readonly action: Prisma.FieldRef<"BlogAuditLog", 'String'>;
    readonly performedBy: Prisma.FieldRef<"BlogAuditLog", 'String'>;
    readonly createdAt: Prisma.FieldRef<"BlogAuditLog", 'DateTime'>;
}
export type BlogAuditLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    where: Prisma.BlogAuditLogWhereUniqueInput;
};
export type BlogAuditLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    where: Prisma.BlogAuditLogWhereUniqueInput;
};
export type BlogAuditLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogAuditLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogAuditLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogAuditLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogAuditLogCreateInput, Prisma.BlogAuditLogUncheckedCreateInput>;
};
export type BlogAuditLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BlogAuditLogCreateManyInput | Prisma.BlogAuditLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BlogAuditLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    data: Prisma.BlogAuditLogCreateManyInput | Prisma.BlogAuditLogCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BlogAuditLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BlogAuditLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateInput, Prisma.BlogAuditLogUncheckedUpdateInput>;
    where: Prisma.BlogAuditLogWhereUniqueInput;
};
export type BlogAuditLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateManyMutationInput, Prisma.BlogAuditLogUncheckedUpdateManyInput>;
    where?: Prisma.BlogAuditLogWhereInput;
    limit?: number;
};
export type BlogAuditLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogAuditLogUpdateManyMutationInput, Prisma.BlogAuditLogUncheckedUpdateManyInput>;
    where?: Prisma.BlogAuditLogWhereInput;
    limit?: number;
    include?: Prisma.BlogAuditLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BlogAuditLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    where: Prisma.BlogAuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogAuditLogCreateInput, Prisma.BlogAuditLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BlogAuditLogUpdateInput, Prisma.BlogAuditLogUncheckedUpdateInput>;
};
export type BlogAuditLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
    where: Prisma.BlogAuditLogWhereUniqueInput;
};
export type BlogAuditLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogAuditLogWhereInput;
    limit?: number;
};
export type BlogAuditLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogAuditLogSelect<ExtArgs> | null;
    omit?: Prisma.BlogAuditLogOmit<ExtArgs> | null;
    include?: Prisma.BlogAuditLogInclude<ExtArgs> | null;
};
