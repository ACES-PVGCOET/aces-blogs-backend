import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BlogContentModel = runtime.Types.Result.DefaultSelection<Prisma.$BlogContentPayload>;
export type AggregateBlogContent = {
    _count: BlogContentCountAggregateOutputType | null;
    _avg: BlogContentAvgAggregateOutputType | null;
    _sum: BlogContentSumAggregateOutputType | null;
    _min: BlogContentMinAggregateOutputType | null;
    _max: BlogContentMaxAggregateOutputType | null;
};
export type BlogContentAvgAggregateOutputType = {
    version: number | null;
};
export type BlogContentSumAggregateOutputType = {
    version: number | null;
};
export type BlogContentMinAggregateOutputType = {
    id: string | null;
    blogId: string | null;
    version: number | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type BlogContentMaxAggregateOutputType = {
    id: string | null;
    blogId: string | null;
    version: number | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type BlogContentCountAggregateOutputType = {
    id: number;
    blogId: number;
    version: number;
    content: number;
    createdById: number;
    createdAt: number;
    _all: number;
};
export type BlogContentAvgAggregateInputType = {
    version?: true;
};
export type BlogContentSumAggregateInputType = {
    version?: true;
};
export type BlogContentMinAggregateInputType = {
    id?: true;
    blogId?: true;
    version?: true;
    createdById?: true;
    createdAt?: true;
};
export type BlogContentMaxAggregateInputType = {
    id?: true;
    blogId?: true;
    version?: true;
    createdById?: true;
    createdAt?: true;
};
export type BlogContentCountAggregateInputType = {
    id?: true;
    blogId?: true;
    version?: true;
    content?: true;
    createdById?: true;
    createdAt?: true;
    _all?: true;
};
export type BlogContentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogContentWhereInput;
    orderBy?: Prisma.BlogContentOrderByWithRelationInput | Prisma.BlogContentOrderByWithRelationInput[];
    cursor?: Prisma.BlogContentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BlogContentCountAggregateInputType;
    _avg?: BlogContentAvgAggregateInputType;
    _sum?: BlogContentSumAggregateInputType;
    _min?: BlogContentMinAggregateInputType;
    _max?: BlogContentMaxAggregateInputType;
};
export type GetBlogContentAggregateType<T extends BlogContentAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogContent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlogContent[P]> : Prisma.GetScalarType<T[P], AggregateBlogContent[P]>;
};
export type BlogContentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogContentWhereInput;
    orderBy?: Prisma.BlogContentOrderByWithAggregationInput | Prisma.BlogContentOrderByWithAggregationInput[];
    by: Prisma.BlogContentScalarFieldEnum[] | Prisma.BlogContentScalarFieldEnum;
    having?: Prisma.BlogContentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BlogContentCountAggregateInputType | true;
    _avg?: BlogContentAvgAggregateInputType;
    _sum?: BlogContentSumAggregateInputType;
    _min?: BlogContentMinAggregateInputType;
    _max?: BlogContentMaxAggregateInputType;
};
export type BlogContentGroupByOutputType = {
    id: string;
    blogId: string;
    version: number;
    content: runtime.JsonValue;
    createdById: string;
    createdAt: Date;
    _count: BlogContentCountAggregateOutputType | null;
    _avg: BlogContentAvgAggregateOutputType | null;
    _sum: BlogContentSumAggregateOutputType | null;
    _min: BlogContentMinAggregateOutputType | null;
    _max: BlogContentMaxAggregateOutputType | null;
};
export type GetBlogContentGroupByPayload<T extends BlogContentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BlogContentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BlogContentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BlogContentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BlogContentGroupByOutputType[P]>;
}>>;
export type BlogContentWhereInput = {
    AND?: Prisma.BlogContentWhereInput | Prisma.BlogContentWhereInput[];
    OR?: Prisma.BlogContentWhereInput[];
    NOT?: Prisma.BlogContentWhereInput | Prisma.BlogContentWhereInput[];
    id?: Prisma.UuidFilter<"BlogContent"> | string;
    blogId?: Prisma.UuidFilter<"BlogContent"> | string;
    version?: Prisma.IntFilter<"BlogContent"> | number;
    content?: Prisma.JsonFilter<"BlogContent">;
    createdById?: Prisma.UuidFilter<"BlogContent"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogContent"> | Date | string;
    blog?: Prisma.XOR<Prisma.BlogScalarRelationFilter, Prisma.BlogWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type BlogContentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    blog?: Prisma.BlogOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
};
export type BlogContentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    blogId_version?: Prisma.BlogContentBlogIdVersionCompoundUniqueInput;
    AND?: Prisma.BlogContentWhereInput | Prisma.BlogContentWhereInput[];
    OR?: Prisma.BlogContentWhereInput[];
    NOT?: Prisma.BlogContentWhereInput | Prisma.BlogContentWhereInput[];
    blogId?: Prisma.UuidFilter<"BlogContent"> | string;
    version?: Prisma.IntFilter<"BlogContent"> | number;
    content?: Prisma.JsonFilter<"BlogContent">;
    createdById?: Prisma.UuidFilter<"BlogContent"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogContent"> | Date | string;
    blog?: Prisma.XOR<Prisma.BlogScalarRelationFilter, Prisma.BlogWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "blogId_version">;
export type BlogContentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BlogContentCountOrderByAggregateInput;
    _avg?: Prisma.BlogContentAvgOrderByAggregateInput;
    _max?: Prisma.BlogContentMaxOrderByAggregateInput;
    _min?: Prisma.BlogContentMinOrderByAggregateInput;
    _sum?: Prisma.BlogContentSumOrderByAggregateInput;
};
export type BlogContentScalarWhereWithAggregatesInput = {
    AND?: Prisma.BlogContentScalarWhereWithAggregatesInput | Prisma.BlogContentScalarWhereWithAggregatesInput[];
    OR?: Prisma.BlogContentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BlogContentScalarWhereWithAggregatesInput | Prisma.BlogContentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"BlogContent"> | string;
    blogId?: Prisma.UuidWithAggregatesFilter<"BlogContent"> | string;
    version?: Prisma.IntWithAggregatesFilter<"BlogContent"> | number;
    content?: Prisma.JsonWithAggregatesFilter<"BlogContent">;
    createdById?: Prisma.UuidWithAggregatesFilter<"BlogContent"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BlogContent"> | Date | string;
};
export type BlogContentCreateInput = {
    id?: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    blog: Prisma.BlogCreateNestedOneWithoutContentsInput;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedBlogContentInput;
};
export type BlogContentUncheckedCreateInput = {
    id?: string;
    blogId: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById: string;
    createdAt?: Date | string;
};
export type BlogContentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blog?: Prisma.BlogUpdateOneRequiredWithoutContentsNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedBlogContentNestedInput;
};
export type BlogContentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentCreateManyInput = {
    id?: string;
    blogId: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById: string;
    createdAt?: Date | string;
};
export type BlogContentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentListRelationFilter = {
    every?: Prisma.BlogContentWhereInput;
    some?: Prisma.BlogContentWhereInput;
    none?: Prisma.BlogContentWhereInput;
};
export type BlogContentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BlogContentBlogIdVersionCompoundUniqueInput = {
    blogId: string;
    version: number;
};
export type BlogContentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogContentAvgOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type BlogContentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogContentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blogId?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlogContentSumOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type BlogContentCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput> | Prisma.BlogContentCreateWithoutCreatedByInput[] | Prisma.BlogContentUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutCreatedByInput | Prisma.BlogContentCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.BlogContentCreateManyCreatedByInputEnvelope;
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
};
export type BlogContentUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput> | Prisma.BlogContentCreateWithoutCreatedByInput[] | Prisma.BlogContentUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutCreatedByInput | Prisma.BlogContentCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.BlogContentCreateManyCreatedByInputEnvelope;
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
};
export type BlogContentUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput> | Prisma.BlogContentCreateWithoutCreatedByInput[] | Prisma.BlogContentUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutCreatedByInput | Prisma.BlogContentCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.BlogContentUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.BlogContentUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.BlogContentCreateManyCreatedByInputEnvelope;
    set?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    disconnect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    delete?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    update?: Prisma.BlogContentUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.BlogContentUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.BlogContentUpdateManyWithWhereWithoutCreatedByInput | Prisma.BlogContentUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
};
export type BlogContentUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput> | Prisma.BlogContentCreateWithoutCreatedByInput[] | Prisma.BlogContentUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutCreatedByInput | Prisma.BlogContentCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.BlogContentUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.BlogContentUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.BlogContentCreateManyCreatedByInputEnvelope;
    set?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    disconnect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    delete?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    update?: Prisma.BlogContentUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.BlogContentUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.BlogContentUpdateManyWithWhereWithoutCreatedByInput | Prisma.BlogContentUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
};
export type BlogContentCreateNestedManyWithoutBlogInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput> | Prisma.BlogContentCreateWithoutBlogInput[] | Prisma.BlogContentUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutBlogInput | Prisma.BlogContentCreateOrConnectWithoutBlogInput[];
    createMany?: Prisma.BlogContentCreateManyBlogInputEnvelope;
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
};
export type BlogContentUncheckedCreateNestedManyWithoutBlogInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput> | Prisma.BlogContentCreateWithoutBlogInput[] | Prisma.BlogContentUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutBlogInput | Prisma.BlogContentCreateOrConnectWithoutBlogInput[];
    createMany?: Prisma.BlogContentCreateManyBlogInputEnvelope;
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
};
export type BlogContentUpdateManyWithoutBlogNestedInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput> | Prisma.BlogContentCreateWithoutBlogInput[] | Prisma.BlogContentUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutBlogInput | Prisma.BlogContentCreateOrConnectWithoutBlogInput[];
    upsert?: Prisma.BlogContentUpsertWithWhereUniqueWithoutBlogInput | Prisma.BlogContentUpsertWithWhereUniqueWithoutBlogInput[];
    createMany?: Prisma.BlogContentCreateManyBlogInputEnvelope;
    set?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    disconnect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    delete?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    update?: Prisma.BlogContentUpdateWithWhereUniqueWithoutBlogInput | Prisma.BlogContentUpdateWithWhereUniqueWithoutBlogInput[];
    updateMany?: Prisma.BlogContentUpdateManyWithWhereWithoutBlogInput | Prisma.BlogContentUpdateManyWithWhereWithoutBlogInput[];
    deleteMany?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
};
export type BlogContentUncheckedUpdateManyWithoutBlogNestedInput = {
    create?: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput> | Prisma.BlogContentCreateWithoutBlogInput[] | Prisma.BlogContentUncheckedCreateWithoutBlogInput[];
    connectOrCreate?: Prisma.BlogContentCreateOrConnectWithoutBlogInput | Prisma.BlogContentCreateOrConnectWithoutBlogInput[];
    upsert?: Prisma.BlogContentUpsertWithWhereUniqueWithoutBlogInput | Prisma.BlogContentUpsertWithWhereUniqueWithoutBlogInput[];
    createMany?: Prisma.BlogContentCreateManyBlogInputEnvelope;
    set?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    disconnect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    delete?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    connect?: Prisma.BlogContentWhereUniqueInput | Prisma.BlogContentWhereUniqueInput[];
    update?: Prisma.BlogContentUpdateWithWhereUniqueWithoutBlogInput | Prisma.BlogContentUpdateWithWhereUniqueWithoutBlogInput[];
    updateMany?: Prisma.BlogContentUpdateManyWithWhereWithoutBlogInput | Prisma.BlogContentUpdateManyWithWhereWithoutBlogInput[];
    deleteMany?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
};
export type BlogContentCreateWithoutCreatedByInput = {
    id?: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    blog: Prisma.BlogCreateNestedOneWithoutContentsInput;
};
export type BlogContentUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    blogId: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BlogContentCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput>;
};
export type BlogContentCreateManyCreatedByInputEnvelope = {
    data: Prisma.BlogContentCreateManyCreatedByInput | Prisma.BlogContentCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type BlogContentUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    update: Prisma.XOR<Prisma.BlogContentUpdateWithoutCreatedByInput, Prisma.BlogContentUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.BlogContentCreateWithoutCreatedByInput, Prisma.BlogContentUncheckedCreateWithoutCreatedByInput>;
};
export type BlogContentUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    data: Prisma.XOR<Prisma.BlogContentUpdateWithoutCreatedByInput, Prisma.BlogContentUncheckedUpdateWithoutCreatedByInput>;
};
export type BlogContentUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.BlogContentScalarWhereInput;
    data: Prisma.XOR<Prisma.BlogContentUpdateManyMutationInput, Prisma.BlogContentUncheckedUpdateManyWithoutCreatedByInput>;
};
export type BlogContentScalarWhereInput = {
    AND?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
    OR?: Prisma.BlogContentScalarWhereInput[];
    NOT?: Prisma.BlogContentScalarWhereInput | Prisma.BlogContentScalarWhereInput[];
    id?: Prisma.UuidFilter<"BlogContent"> | string;
    blogId?: Prisma.UuidFilter<"BlogContent"> | string;
    version?: Prisma.IntFilter<"BlogContent"> | number;
    content?: Prisma.JsonFilter<"BlogContent">;
    createdById?: Prisma.UuidFilter<"BlogContent"> | string;
    createdAt?: Prisma.DateTimeFilter<"BlogContent"> | Date | string;
};
export type BlogContentCreateWithoutBlogInput = {
    id?: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedBlogContentInput;
};
export type BlogContentUncheckedCreateWithoutBlogInput = {
    id?: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById: string;
    createdAt?: Date | string;
};
export type BlogContentCreateOrConnectWithoutBlogInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput>;
};
export type BlogContentCreateManyBlogInputEnvelope = {
    data: Prisma.BlogContentCreateManyBlogInput | Prisma.BlogContentCreateManyBlogInput[];
    skipDuplicates?: boolean;
};
export type BlogContentUpsertWithWhereUniqueWithoutBlogInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    update: Prisma.XOR<Prisma.BlogContentUpdateWithoutBlogInput, Prisma.BlogContentUncheckedUpdateWithoutBlogInput>;
    create: Prisma.XOR<Prisma.BlogContentCreateWithoutBlogInput, Prisma.BlogContentUncheckedCreateWithoutBlogInput>;
};
export type BlogContentUpdateWithWhereUniqueWithoutBlogInput = {
    where: Prisma.BlogContentWhereUniqueInput;
    data: Prisma.XOR<Prisma.BlogContentUpdateWithoutBlogInput, Prisma.BlogContentUncheckedUpdateWithoutBlogInput>;
};
export type BlogContentUpdateManyWithWhereWithoutBlogInput = {
    where: Prisma.BlogContentScalarWhereInput;
    data: Prisma.XOR<Prisma.BlogContentUpdateManyMutationInput, Prisma.BlogContentUncheckedUpdateManyWithoutBlogInput>;
};
export type BlogContentCreateManyCreatedByInput = {
    id?: string;
    blogId: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BlogContentUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blog?: Prisma.BlogUpdateOneRequiredWithoutContentsNestedInput;
};
export type BlogContentUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blogId?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentCreateManyBlogInput = {
    id?: string;
    version: number;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById: string;
    createdAt?: Date | string;
};
export type BlogContentUpdateWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedBlogContentNestedInput;
};
export type BlogContentUncheckedUpdateWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentUncheckedUpdateManyWithoutBlogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlogContentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    version?: boolean;
    content?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogContent"]>;
export type BlogContentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    version?: boolean;
    content?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogContent"]>;
export type BlogContentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blogId?: boolean;
    version?: boolean;
    content?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blogContent"]>;
export type BlogContentSelectScalar = {
    id?: boolean;
    blogId?: boolean;
    version?: boolean;
    content?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
};
export type BlogContentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "blogId" | "version" | "content" | "createdById" | "createdAt", ExtArgs["result"]["blogContent"]>;
export type BlogContentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlogContentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlogContentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blog?: boolean | Prisma.BlogDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BlogContentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BlogContent";
    objects: {
        blog: Prisma.$BlogPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        blogId: string;
        version: number;
        content: runtime.JsonValue;
        createdById: string;
        createdAt: Date;
    }, ExtArgs["result"]["blogContent"]>;
    composites: {};
};
export type BlogContentGetPayload<S extends boolean | null | undefined | BlogContentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BlogContentPayload, S>;
export type BlogContentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BlogContentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BlogContentCountAggregateInputType | true;
};
export interface BlogContentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BlogContent'];
        meta: {
            name: 'BlogContent';
        };
    };
    findUnique<T extends BlogContentFindUniqueArgs>(args: Prisma.SelectSubset<T, BlogContentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BlogContentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BlogContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BlogContentFindFirstArgs>(args?: Prisma.SelectSubset<T, BlogContentFindFirstArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BlogContentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BlogContentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BlogContentFindManyArgs>(args?: Prisma.SelectSubset<T, BlogContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BlogContentCreateArgs>(args: Prisma.SelectSubset<T, BlogContentCreateArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BlogContentCreateManyArgs>(args?: Prisma.SelectSubset<T, BlogContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BlogContentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BlogContentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BlogContentDeleteArgs>(args: Prisma.SelectSubset<T, BlogContentDeleteArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BlogContentUpdateArgs>(args: Prisma.SelectSubset<T, BlogContentUpdateArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BlogContentDeleteManyArgs>(args?: Prisma.SelectSubset<T, BlogContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BlogContentUpdateManyArgs>(args: Prisma.SelectSubset<T, BlogContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BlogContentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BlogContentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BlogContentUpsertArgs>(args: Prisma.SelectSubset<T, BlogContentUpsertArgs<ExtArgs>>): Prisma.Prisma__BlogContentClient<runtime.Types.Result.GetResult<Prisma.$BlogContentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BlogContentCountArgs>(args?: Prisma.Subset<T, BlogContentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BlogContentCountAggregateOutputType> : number>;
    aggregate<T extends BlogContentAggregateArgs>(args: Prisma.Subset<T, BlogContentAggregateArgs>): Prisma.PrismaPromise<GetBlogContentAggregateType<T>>;
    groupBy<T extends BlogContentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BlogContentGroupByArgs['orderBy'];
    } : {
        orderBy?: BlogContentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BlogContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BlogContentFieldRefs;
}
export interface Prisma__BlogContentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blog<T extends Prisma.BlogDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BlogDefaultArgs<ExtArgs>>): Prisma.Prisma__BlogClient<runtime.Types.Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BlogContentFieldRefs {
    readonly id: Prisma.FieldRef<"BlogContent", 'String'>;
    readonly blogId: Prisma.FieldRef<"BlogContent", 'String'>;
    readonly version: Prisma.FieldRef<"BlogContent", 'Int'>;
    readonly content: Prisma.FieldRef<"BlogContent", 'Json'>;
    readonly createdById: Prisma.FieldRef<"BlogContent", 'String'>;
    readonly createdAt: Prisma.FieldRef<"BlogContent", 'DateTime'>;
}
export type BlogContentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    where: Prisma.BlogContentWhereUniqueInput;
};
export type BlogContentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    where: Prisma.BlogContentWhereUniqueInput;
};
export type BlogContentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogContentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogContentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BlogContentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogContentCreateInput, Prisma.BlogContentUncheckedCreateInput>;
};
export type BlogContentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BlogContentCreateManyInput | Prisma.BlogContentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BlogContentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    data: Prisma.BlogContentCreateManyInput | Prisma.BlogContentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BlogContentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BlogContentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogContentUpdateInput, Prisma.BlogContentUncheckedUpdateInput>;
    where: Prisma.BlogContentWhereUniqueInput;
};
export type BlogContentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BlogContentUpdateManyMutationInput, Prisma.BlogContentUncheckedUpdateManyInput>;
    where?: Prisma.BlogContentWhereInput;
    limit?: number;
};
export type BlogContentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlogContentUpdateManyMutationInput, Prisma.BlogContentUncheckedUpdateManyInput>;
    where?: Prisma.BlogContentWhereInput;
    limit?: number;
    include?: Prisma.BlogContentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BlogContentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    where: Prisma.BlogContentWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlogContentCreateInput, Prisma.BlogContentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BlogContentUpdateInput, Prisma.BlogContentUncheckedUpdateInput>;
};
export type BlogContentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
    where: Prisma.BlogContentWhereUniqueInput;
};
export type BlogContentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlogContentWhereInput;
    limit?: number;
};
export type BlogContentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlogContentSelect<ExtArgs> | null;
    omit?: Prisma.BlogContentOmit<ExtArgs> | null;
    include?: Prisma.BlogContentInclude<ExtArgs> | null;
};
