
export type Enumerable<T> = T | Array<T>;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type TableColumns<Table> = keyof Table;

export type TableRelationShips<Create, Model> = keyof Omit<Create, keyof Model>;


/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> =
    T extends object ?
    U extends object ?
    (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


export type PrismaWhereInput = {
    AND?: Enumerable<PrismaWhereInput> | any
    OR?: Enumerable<PrismaWhereInput> | any
    NOT?: Enumerable<PrismaWhereInput> | any
    [x: string]: StringFilter | IntFilter | BoolFilter | FloatFilter | DateTimeFilter | DateTimeNullableFilter;
}

export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: StringFilter | string
}

export type FloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: FloatFilter | number
}

export type EnumFilter<Enum = String> = {
    equals?: Enum
    in?: Enumerable<Enum>
    notIn?: Enumerable<Enum>
    not?: EnumFilter | Enum
}

export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: DateTimeFilter | Date | string
}

export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: DateTimeNullableFilter | Date | string | null
}

export type BoolFilter = {
    equals?: boolean
    not?: BoolFilter | boolean
}

export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: IntFilter | number
}

export type PrismaValidStringFilter =
  | 'equals'
  | 'in'
  | 'notIn'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'mode'
  | 'not';
