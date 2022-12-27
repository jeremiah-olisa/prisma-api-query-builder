
export type Enumerable<T> = T | Array<T>;

/**
 * Without<T, U> is the type of T without the properties of U.
 * @property [: undefined] - never
 */
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


/**
 * `PrismaWhereInput` is a type that can be any of the following:
 * 
 * - `AND`: an array of `PrismaWhereInput`s
 * - `OR`: an array of `PrismaWhereInput`s
 * - `NOT`: an array of `PrismaWhereInput`s
 * - a string that is a key of `PrismaWhereInput`
 * 
 * The value of the key can be any of the following:
 * 
 * - `StringFilter`
 * - `IntFilter`
 * - `BoolFilter`
 * -
 * @property {Enumerable<PrismaWhereInput> | any} AND - PrismaWhereInput[]
 * @property {Enumerable<PrismaWhereInput> | any} OR - PrismaWhereInput[]
 * @property {Enumerable<PrismaWhereInput> | any} NOT - PrismaWhereInput
 * @property {StringFilter | IntFilter | BoolFilter | FloatFilter | DateTimeFilter |
 * DateTimeNullableFilter} [x: StringFilter | IntFilter | BoolFilter | FloatFilter | DateTimeFilter |
 * DateTimeNullableFilter] - any
 */
export type PrismaWhereInput = {
    AND?: Enumerable<PrismaWhereInput> | any
    OR?: Enumerable<PrismaWhereInput> | any
    NOT?: Enumerable<PrismaWhereInput> | any
    [x: string]: StringFilter | IntFilter | BoolFilter | FloatFilter | DateTimeFilter | DateTimeNullableFilter;
}

/**
 * A StringFilter is either a string or an object with optional string properties.
 * @property equals - The value must be equal to the given value.
 * @property notIn - The value must not be equal to any of the given values.
 * @property {string} lt - Less than
 * @property {string} lte - Less than or equal to
 * @property {string} gt - greater than
 * @property {string} gte - greater than or equal to
 * @property {string} contains - The value contains the given string.
 * @property {string} startsWith - The string starts with the given value.
 * @property {string} endsWith - The string ends with the given value.
 * @property {StringFilter | string} not - The value of this property is a string filter.
 */
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

/**
 * A FloatFilter is an object that has optional properties of type number, and optional properties of
 * type FloatFilter.
 * @property equals - The value must be equal to this.
 * @property notIn - The value must not be in the array.
 * @property {number} lt - Less than
 * @property {number} lte - less than or equal to
 * @property {number} gt - greater than
 * @property {number} gte - greater than or equal to
 * @property {FloatFilter | number} not - The value must not be equal to the given value.
 */
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

/**
 * `EnumFilter` is a type that represents a filter for an enum.
 * @property equals - The value must be this value.
 * @property notIn - Enumerable<Enum>
 * @property {EnumFilter | Enum} not - The value must not be equal to the given value.
 */
export type EnumFilter<Enum = String> = {
    equals?: Enum
    in?: Enumerable<Enum>
    notIn?: Enumerable<Enum>
    not?: EnumFilter | Enum
}

/**
 * A DateTimeFilter is either a Date or a string, or an object with one or more of the following
 * properties: equals, in, notIn, lt, lte, gt, gte, not.
 * @property {Date | string
 *     in?: Enumerable<Date> | Enumerable<string>} equals - The value must be equal to the given value.
 * @property {Enumerable<Date> | Enumerable<string>} notIn - The value is not in the list of values.
 * @property {Date | string} lt - Less than
 * @property {Date | string} lte - Less than or equal to
 * @property {Date | string} gt - greater than
 * @property {Date | string} gte - greater than or equal to
 * @property {DateTimeFilter | Date | string} not - DateTimeFilter | Date | string
 */
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

/**
 * A DateTimeNullableFilter is either a DateTimeFilter or a Date or a string or null.
 * @property {Date | string | null
 *     in?: Enumerable<Date> | Enumerable<string> | null} equals - The value must be equal to the given
 * value.
 * @property {Enumerable<Date> | Enumerable<string> | null} notIn - Enumerable<Date> |
 * Enumerable<string> | null
 * @property {Date | string} lt - Less than
 * @property {Date | string} lte - Less than or equal to
 * @property {Date | string} gt - greater than
 * @property {Date | string} gte - greater than or equal to
 * @property {DateTimeNullableFilter | Date | string | null} not - DateTimeNullableFilter | Date |
 * string | null
 */
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

/**
 * `BoolFilter` is a type that can be either a boolean or an object with an optional `equals` property
 * that is a boolean and an optional `not` property that is either a boolean or another `BoolFilter`.
 * @property {boolean} equals - The value to compare against.
 * @property {BoolFilter | boolean} not - BoolFilter | boolean
 */
export type BoolFilter = {
    equals?: boolean
    not?: BoolFilter | boolean
}

/**
 * IntFilter is a type that can be an object with any of the following properties: equals, in, notIn,
 * lt, lte, gt, gte, not. Each of those properties can be either an IntFilter or a number.
 * @property equals - The value must be equal to this.
 * @property notIn - The value must not be in the array.
 * @property {number} lt - Less than
 * @property {number} lte - Less than or equal to
 * @property {number} gt - greater than
 * @property {number} gte - greater than or equal to
 * @property {IntFilter | number} not - The value must not be equal to the given value.
 */
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
