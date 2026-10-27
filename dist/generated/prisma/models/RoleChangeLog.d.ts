import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RoleChangeLogModel = runtime.Types.Result.DefaultSelection<Prisma.$RoleChangeLogPayload>;
export type AggregateRoleChangeLog = {
    _count: RoleChangeLogCountAggregateOutputType | null;
    _min: RoleChangeLogMinAggregateOutputType | null;
    _max: RoleChangeLogMaxAggregateOutputType | null;
};
export type RoleChangeLogMinAggregateOutputType = {
    id: string | null;
    targetUserId: string | null;
    changedBy: string | null;
    oldRole: $Enums.UserRole | null;
    newRole: $Enums.UserRole | null;
    createdAt: Date | null;
};
export type RoleChangeLogMaxAggregateOutputType = {
    id: string | null;
    targetUserId: string | null;
    changedBy: string | null;
    oldRole: $Enums.UserRole | null;
    newRole: $Enums.UserRole | null;
    createdAt: Date | null;
};
export type RoleChangeLogCountAggregateOutputType = {
    id: number;
    targetUserId: number;
    changedBy: number;
    oldRole: number;
    newRole: number;
    createdAt: number;
    _all: number;
};
export type RoleChangeLogMinAggregateInputType = {
    id?: true;
    targetUserId?: true;
    changedBy?: true;
    oldRole?: true;
    newRole?: true;
    createdAt?: true;
};
export type RoleChangeLogMaxAggregateInputType = {
    id?: true;
    targetUserId?: true;
    changedBy?: true;
    oldRole?: true;
    newRole?: true;
    createdAt?: true;
};
export type RoleChangeLogCountAggregateInputType = {
    id?: true;
    targetUserId?: true;
    changedBy?: true;
    oldRole?: true;
    newRole?: true;
    createdAt?: true;
    _all?: true;
};
export type RoleChangeLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleChangeLogWhereInput;
    orderBy?: Prisma.RoleChangeLogOrderByWithRelationInput | Prisma.RoleChangeLogOrderByWithRelationInput[];
    cursor?: Prisma.RoleChangeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoleChangeLogCountAggregateInputType;
    _min?: RoleChangeLogMinAggregateInputType;
    _max?: RoleChangeLogMaxAggregateInputType;
};
export type GetRoleChangeLogAggregateType<T extends RoleChangeLogAggregateArgs> = {
    [P in keyof T & keyof AggregateRoleChangeLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoleChangeLog[P]> : Prisma.GetScalarType<T[P], AggregateRoleChangeLog[P]>;
};
export type RoleChangeLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleChangeLogWhereInput;
    orderBy?: Prisma.RoleChangeLogOrderByWithAggregationInput | Prisma.RoleChangeLogOrderByWithAggregationInput[];
    by: Prisma.RoleChangeLogScalarFieldEnum[] | Prisma.RoleChangeLogScalarFieldEnum;
    having?: Prisma.RoleChangeLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoleChangeLogCountAggregateInputType | true;
    _min?: RoleChangeLogMinAggregateInputType;
    _max?: RoleChangeLogMaxAggregateInputType;
};
export type RoleChangeLogGroupByOutputType = {
    id: string;
    targetUserId: string;
    changedBy: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt: Date;
    _count: RoleChangeLogCountAggregateOutputType | null;
    _min: RoleChangeLogMinAggregateOutputType | null;
    _max: RoleChangeLogMaxAggregateOutputType | null;
};
export type GetRoleChangeLogGroupByPayload<T extends RoleChangeLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoleChangeLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoleChangeLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoleChangeLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoleChangeLogGroupByOutputType[P]>;
}>>;
export type RoleChangeLogWhereInput = {
    AND?: Prisma.RoleChangeLogWhereInput | Prisma.RoleChangeLogWhereInput[];
    OR?: Prisma.RoleChangeLogWhereInput[];
    NOT?: Prisma.RoleChangeLogWhereInput | Prisma.RoleChangeLogWhereInput[];
    id?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    targetUserId?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    changedBy?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    oldRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFilter<"RoleChangeLog"> | Date | string;
    targetUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type RoleChangeLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    targetUserId?: Prisma.SortOrder;
    changedBy?: Prisma.SortOrder;
    oldRole?: Prisma.SortOrder;
    newRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    targetUser?: Prisma.UserOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type RoleChangeLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RoleChangeLogWhereInput | Prisma.RoleChangeLogWhereInput[];
    OR?: Prisma.RoleChangeLogWhereInput[];
    NOT?: Prisma.RoleChangeLogWhereInput | Prisma.RoleChangeLogWhereInput[];
    targetUserId?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    changedBy?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    oldRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFilter<"RoleChangeLog"> | Date | string;
    targetUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type RoleChangeLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    targetUserId?: Prisma.SortOrder;
    changedBy?: Prisma.SortOrder;
    oldRole?: Prisma.SortOrder;
    newRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RoleChangeLogCountOrderByAggregateInput;
    _max?: Prisma.RoleChangeLogMaxOrderByAggregateInput;
    _min?: Prisma.RoleChangeLogMinOrderByAggregateInput;
};
export type RoleChangeLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoleChangeLogScalarWhereWithAggregatesInput | Prisma.RoleChangeLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoleChangeLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoleChangeLogScalarWhereWithAggregatesInput | Prisma.RoleChangeLogScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"RoleChangeLog"> | string;
    targetUserId?: Prisma.UuidWithAggregatesFilter<"RoleChangeLog"> | string;
    changedBy?: Prisma.UuidWithAggregatesFilter<"RoleChangeLog"> | string;
    oldRole?: Prisma.EnumUserRoleWithAggregatesFilter<"RoleChangeLog"> | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleWithAggregatesFilter<"RoleChangeLog"> | $Enums.UserRole;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RoleChangeLog"> | Date | string;
};
export type RoleChangeLogCreateInput = {
    id?: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
    targetUser: Prisma.UserCreateNestedOneWithoutRoleChangesReceivedInput;
    actor: Prisma.UserCreateNestedOneWithoutRoleChangesMadeInput;
};
export type RoleChangeLogUncheckedCreateInput = {
    id?: string;
    targetUserId: string;
    changedBy: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    targetUser?: Prisma.UserUpdateOneRequiredWithoutRoleChangesReceivedNestedInput;
    actor?: Prisma.UserUpdateOneRequiredWithoutRoleChangesMadeNestedInput;
};
export type RoleChangeLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    changedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogCreateManyInput = {
    id?: string;
    targetUserId: string;
    changedBy: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    changedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogListRelationFilter = {
    every?: Prisma.RoleChangeLogWhereInput;
    some?: Prisma.RoleChangeLogWhereInput;
    none?: Prisma.RoleChangeLogWhereInput;
};
export type RoleChangeLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RoleChangeLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetUserId?: Prisma.SortOrder;
    changedBy?: Prisma.SortOrder;
    oldRole?: Prisma.SortOrder;
    newRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoleChangeLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetUserId?: Prisma.SortOrder;
    changedBy?: Prisma.SortOrder;
    oldRole?: Prisma.SortOrder;
    newRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoleChangeLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetUserId?: Prisma.SortOrder;
    changedBy?: Prisma.SortOrder;
    oldRole?: Prisma.SortOrder;
    newRole?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RoleChangeLogCreateNestedManyWithoutTargetUserInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput> | Prisma.RoleChangeLogCreateWithoutTargetUserInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput | Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput[];
    createMany?: Prisma.RoleChangeLogCreateManyTargetUserInputEnvelope;
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
};
export type RoleChangeLogCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput> | Prisma.RoleChangeLogCreateWithoutActorInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutActorInput | Prisma.RoleChangeLogCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.RoleChangeLogCreateManyActorInputEnvelope;
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
};
export type RoleChangeLogUncheckedCreateNestedManyWithoutTargetUserInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput> | Prisma.RoleChangeLogCreateWithoutTargetUserInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput | Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput[];
    createMany?: Prisma.RoleChangeLogCreateManyTargetUserInputEnvelope;
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
};
export type RoleChangeLogUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput> | Prisma.RoleChangeLogCreateWithoutActorInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutActorInput | Prisma.RoleChangeLogCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.RoleChangeLogCreateManyActorInputEnvelope;
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
};
export type RoleChangeLogUpdateManyWithoutTargetUserNestedInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput> | Prisma.RoleChangeLogCreateWithoutTargetUserInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput | Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput[];
    upsert?: Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutTargetUserInput | Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutTargetUserInput[];
    createMany?: Prisma.RoleChangeLogCreateManyTargetUserInputEnvelope;
    set?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    disconnect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    delete?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    update?: Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutTargetUserInput | Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutTargetUserInput[];
    updateMany?: Prisma.RoleChangeLogUpdateManyWithWhereWithoutTargetUserInput | Prisma.RoleChangeLogUpdateManyWithWhereWithoutTargetUserInput[];
    deleteMany?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
};
export type RoleChangeLogUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput> | Prisma.RoleChangeLogCreateWithoutActorInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutActorInput | Prisma.RoleChangeLogCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutActorInput | Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.RoleChangeLogCreateManyActorInputEnvelope;
    set?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    disconnect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    delete?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    update?: Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutActorInput | Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.RoleChangeLogUpdateManyWithWhereWithoutActorInput | Prisma.RoleChangeLogUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
};
export type RoleChangeLogUncheckedUpdateManyWithoutTargetUserNestedInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput> | Prisma.RoleChangeLogCreateWithoutTargetUserInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput | Prisma.RoleChangeLogCreateOrConnectWithoutTargetUserInput[];
    upsert?: Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutTargetUserInput | Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutTargetUserInput[];
    createMany?: Prisma.RoleChangeLogCreateManyTargetUserInputEnvelope;
    set?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    disconnect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    delete?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    update?: Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutTargetUserInput | Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutTargetUserInput[];
    updateMany?: Prisma.RoleChangeLogUpdateManyWithWhereWithoutTargetUserInput | Prisma.RoleChangeLogUpdateManyWithWhereWithoutTargetUserInput[];
    deleteMany?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
};
export type RoleChangeLogUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput> | Prisma.RoleChangeLogCreateWithoutActorInput[] | Prisma.RoleChangeLogUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.RoleChangeLogCreateOrConnectWithoutActorInput | Prisma.RoleChangeLogCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutActorInput | Prisma.RoleChangeLogUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.RoleChangeLogCreateManyActorInputEnvelope;
    set?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    disconnect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    delete?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    connect?: Prisma.RoleChangeLogWhereUniqueInput | Prisma.RoleChangeLogWhereUniqueInput[];
    update?: Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutActorInput | Prisma.RoleChangeLogUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.RoleChangeLogUpdateManyWithWhereWithoutActorInput | Prisma.RoleChangeLogUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
};
export type RoleChangeLogCreateWithoutTargetUserInput = {
    id?: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
    actor: Prisma.UserCreateNestedOneWithoutRoleChangesMadeInput;
};
export type RoleChangeLogUncheckedCreateWithoutTargetUserInput = {
    id?: string;
    changedBy: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogCreateOrConnectWithoutTargetUserInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput>;
};
export type RoleChangeLogCreateManyTargetUserInputEnvelope = {
    data: Prisma.RoleChangeLogCreateManyTargetUserInput | Prisma.RoleChangeLogCreateManyTargetUserInput[];
    skipDuplicates?: boolean;
};
export type RoleChangeLogCreateWithoutActorInput = {
    id?: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
    targetUser: Prisma.UserCreateNestedOneWithoutRoleChangesReceivedInput;
};
export type RoleChangeLogUncheckedCreateWithoutActorInput = {
    id?: string;
    targetUserId: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogCreateOrConnectWithoutActorInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput>;
};
export type RoleChangeLogCreateManyActorInputEnvelope = {
    data: Prisma.RoleChangeLogCreateManyActorInput | Prisma.RoleChangeLogCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type RoleChangeLogUpsertWithWhereUniqueWithoutTargetUserInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.RoleChangeLogUpdateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedUpdateWithoutTargetUserInput>;
    create: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedCreateWithoutTargetUserInput>;
};
export type RoleChangeLogUpdateWithWhereUniqueWithoutTargetUserInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateWithoutTargetUserInput, Prisma.RoleChangeLogUncheckedUpdateWithoutTargetUserInput>;
};
export type RoleChangeLogUpdateManyWithWhereWithoutTargetUserInput = {
    where: Prisma.RoleChangeLogScalarWhereInput;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateManyMutationInput, Prisma.RoleChangeLogUncheckedUpdateManyWithoutTargetUserInput>;
};
export type RoleChangeLogScalarWhereInput = {
    AND?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
    OR?: Prisma.RoleChangeLogScalarWhereInput[];
    NOT?: Prisma.RoleChangeLogScalarWhereInput | Prisma.RoleChangeLogScalarWhereInput[];
    id?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    targetUserId?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    changedBy?: Prisma.UuidFilter<"RoleChangeLog"> | string;
    oldRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFilter<"RoleChangeLog"> | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFilter<"RoleChangeLog"> | Date | string;
};
export type RoleChangeLogUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.RoleChangeLogUpdateWithoutActorInput, Prisma.RoleChangeLogUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.RoleChangeLogCreateWithoutActorInput, Prisma.RoleChangeLogUncheckedCreateWithoutActorInput>;
};
export type RoleChangeLogUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.RoleChangeLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateWithoutActorInput, Prisma.RoleChangeLogUncheckedUpdateWithoutActorInput>;
};
export type RoleChangeLogUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.RoleChangeLogScalarWhereInput;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateManyMutationInput, Prisma.RoleChangeLogUncheckedUpdateManyWithoutActorInput>;
};
export type RoleChangeLogCreateManyTargetUserInput = {
    id?: string;
    changedBy: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogCreateManyActorInput = {
    id?: string;
    targetUserId: string;
    oldRole: $Enums.UserRole;
    newRole: $Enums.UserRole;
    createdAt?: Date | string;
};
export type RoleChangeLogUpdateWithoutTargetUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneRequiredWithoutRoleChangesMadeNestedInput;
};
export type RoleChangeLogUncheckedUpdateWithoutTargetUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    changedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogUncheckedUpdateManyWithoutTargetUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    changedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    targetUser?: Prisma.UserUpdateOneRequiredWithoutRoleChangesReceivedNestedInput;
};
export type RoleChangeLogUncheckedUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    oldRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    newRole?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RoleChangeLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetUserId?: boolean;
    changedBy?: boolean;
    oldRole?: boolean;
    newRole?: boolean;
    createdAt?: boolean;
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["roleChangeLog"]>;
export type RoleChangeLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetUserId?: boolean;
    changedBy?: boolean;
    oldRole?: boolean;
    newRole?: boolean;
    createdAt?: boolean;
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["roleChangeLog"]>;
export type RoleChangeLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetUserId?: boolean;
    changedBy?: boolean;
    oldRole?: boolean;
    newRole?: boolean;
    createdAt?: boolean;
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["roleChangeLog"]>;
export type RoleChangeLogSelectScalar = {
    id?: boolean;
    targetUserId?: boolean;
    changedBy?: boolean;
    oldRole?: boolean;
    newRole?: boolean;
    createdAt?: boolean;
};
export type RoleChangeLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "targetUserId" | "changedBy" | "oldRole" | "newRole" | "createdAt", ExtArgs["result"]["roleChangeLog"]>;
export type RoleChangeLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type RoleChangeLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type RoleChangeLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    targetUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $RoleChangeLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RoleChangeLog";
    objects: {
        targetUser: Prisma.$UserPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        targetUserId: string;
        changedBy: string;
        oldRole: $Enums.UserRole;
        newRole: $Enums.UserRole;
        createdAt: Date;
    }, ExtArgs["result"]["roleChangeLog"]>;
    composites: {};
};
export type RoleChangeLogGetPayload<S extends boolean | null | undefined | RoleChangeLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload, S>;
export type RoleChangeLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoleChangeLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoleChangeLogCountAggregateInputType | true;
};
export interface RoleChangeLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RoleChangeLog'];
        meta: {
            name: 'RoleChangeLog';
        };
    };
    findUnique<T extends RoleChangeLogFindUniqueArgs>(args: Prisma.SelectSubset<T, RoleChangeLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoleChangeLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoleChangeLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoleChangeLogFindFirstArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoleChangeLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoleChangeLogFindManyArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoleChangeLogCreateArgs>(args: Prisma.SelectSubset<T, RoleChangeLogCreateArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoleChangeLogCreateManyArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoleChangeLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoleChangeLogDeleteArgs>(args: Prisma.SelectSubset<T, RoleChangeLogDeleteArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoleChangeLogUpdateArgs>(args: Prisma.SelectSubset<T, RoleChangeLogUpdateArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoleChangeLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoleChangeLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoleChangeLogUpdateManyArgs>(args: Prisma.SelectSubset<T, RoleChangeLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoleChangeLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoleChangeLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoleChangeLogUpsertArgs>(args: Prisma.SelectSubset<T, RoleChangeLogUpsertArgs<ExtArgs>>): Prisma.Prisma__RoleChangeLogClient<runtime.Types.Result.GetResult<Prisma.$RoleChangeLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoleChangeLogCountArgs>(args?: Prisma.Subset<T, RoleChangeLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoleChangeLogCountAggregateOutputType> : number>;
    aggregate<T extends RoleChangeLogAggregateArgs>(args: Prisma.Subset<T, RoleChangeLogAggregateArgs>): Prisma.PrismaPromise<GetRoleChangeLogAggregateType<T>>;
    groupBy<T extends RoleChangeLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoleChangeLogGroupByArgs['orderBy'];
    } : {
        orderBy?: RoleChangeLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoleChangeLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleChangeLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoleChangeLogFieldRefs;
}
export interface Prisma__RoleChangeLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    targetUser<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoleChangeLogFieldRefs {
    readonly id: Prisma.FieldRef<"RoleChangeLog", 'String'>;
    readonly targetUserId: Prisma.FieldRef<"RoleChangeLog", 'String'>;
    readonly changedBy: Prisma.FieldRef<"RoleChangeLog", 'String'>;
    readonly oldRole: Prisma.FieldRef<"RoleChangeLog", 'UserRole'>;
    readonly newRole: Prisma.FieldRef<"RoleChangeLog", 'UserRole'>;
    readonly createdAt: Prisma.FieldRef<"RoleChangeLog", 'DateTime'>;
}
export type RoleChangeLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where: Prisma.RoleChangeLogWhereUniqueInput;
};
export type RoleChangeLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where: Prisma.RoleChangeLogWhereUniqueInput;
};
export type RoleChangeLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RoleChangeLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RoleChangeLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RoleChangeLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleChangeLogCreateInput, Prisma.RoleChangeLogUncheckedCreateInput>;
};
export type RoleChangeLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoleChangeLogCreateManyInput | Prisma.RoleChangeLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoleChangeLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    data: Prisma.RoleChangeLogCreateManyInput | Prisma.RoleChangeLogCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RoleChangeLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RoleChangeLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateInput, Prisma.RoleChangeLogUncheckedUpdateInput>;
    where: Prisma.RoleChangeLogWhereUniqueInput;
};
export type RoleChangeLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateManyMutationInput, Prisma.RoleChangeLogUncheckedUpdateManyInput>;
    where?: Prisma.RoleChangeLogWhereInput;
    limit?: number;
};
export type RoleChangeLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleChangeLogUpdateManyMutationInput, Prisma.RoleChangeLogUncheckedUpdateManyInput>;
    where?: Prisma.RoleChangeLogWhereInput;
    limit?: number;
    include?: Prisma.RoleChangeLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RoleChangeLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where: Prisma.RoleChangeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleChangeLogCreateInput, Prisma.RoleChangeLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoleChangeLogUpdateInput, Prisma.RoleChangeLogUncheckedUpdateInput>;
};
export type RoleChangeLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
    where: Prisma.RoleChangeLogWhereUniqueInput;
};
export type RoleChangeLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleChangeLogWhereInput;
    limit?: number;
};
export type RoleChangeLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleChangeLogSelect<ExtArgs> | null;
    omit?: Prisma.RoleChangeLogOmit<ExtArgs> | null;
    include?: Prisma.RoleChangeLogInclude<ExtArgs> | null;
};
