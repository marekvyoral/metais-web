import { Attribute, AttributeAttributeTypeEnum, AttributeConstraintRegexAllOf } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'
import {
    AnyObject,
    ArraySchema,
    BooleanSchema,
    DateSchema,
    MixedSchema,
    NumberSchema,
    StringSchema,
    array,
    boolean,
    date,
    mixed,
    number,
    object,
    string,
} from 'yup'
import { HTML_TYPE } from '@isdd/metais-common/constants'

import { numericProperties } from './createEntityHelpers'

export enum ByteInterval {
    MIN = -128,
    MAX = 127,
}

export enum ShortInterval {
    MIN = -32_768,
    MAX = 32_767,
}

type NullableDateSchema = DateSchema<Date | null | undefined>
type NullableNumberSchema = NumberSchema<number | null | undefined>

type SchemaType = {
    [key: string]:
        | StringSchema
        | NumberSchema
        | BooleanSchema
        | DateSchema
        | MixedSchema
        | NullableDateSchema
        | NullableNumberSchema
        | ArraySchema<(string | undefined)[] | undefined, AnyObject, '', ''>
        | ArraySchema<{ label?: string | undefined; value?: string | undefined }[] | undefined, AnyObject, '', ''>
        | ArraySchema<number[] | undefined, AnyObject, '', ''>
        | ArraySchema<(number | null | undefined)[] | undefined, AnyObject, '', ''>
}

export const generateFormSchema = (data: (Attribute | undefined)[], t: TFunction<'translation', undefined, 'translation'>) => {
    const schema: SchemaType = {}

    const phoneOrEmptyStringRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$|^$/

    data?.forEach((attribute: Attribute | undefined) => {
        const isInvisible = attribute?.invisible

        const isRegex = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === 'regex'
        const isInterval = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === 'interval'

        const isEmail = attribute?.name?.toLowerCase() === 'email'
        const isPhone = attribute?.name?.toLowerCase() === 'phone'

        const isRequired = attribute?.mandatory?.type === 'critical'

        const hasConstraints = attribute?.constraints && attribute.constraints.length > 0

        const isDate = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.DATE
        const isBoolean = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.BOOLEAN
        const isFile = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.IMAGE
        const isString = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.STRING
        const isCharacter = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.CHARACTER
        const isLong = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.LONG
        const isFloat = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.FLOAT
        const isByte = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.BYTE
        const isShort = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.SHORT
        const isDouble = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.DOUBLE
        const isInteger = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.INTEGER
        const isArray = attribute?.array
        const isHTML = attribute?.type === HTML_TYPE

        const hasNumericValue = isInteger || isDouble || isLong || isByte || isShort || isFloat
        const canBeDecimal = isDouble || isFloat

        if (isInvisible) return
        if (attribute?.technicalName == null) return
        if (isString || isHTML) {
            switch (true) {
                case isArray && isRegex: {
                    if (attribute.constraints) {
                        const regexConstraints = attribute.constraints[0] as AttributeConstraintRegexAllOf
                        const regexPattern = new RegExp(regexConstraints.regex ?? '')

                        schema[attribute.technicalName] = array().of(
                            string()
                                .matches(regexPattern, t('validation.wrongRegex', { regexFormat: regexConstraints.regex }))
                                .required(t('validation.required')),
                        )
                    }
                    break
                }
                case isArray && hasConstraints: {
                    schema[attribute.technicalName] = array()
                        .of(string())
                        .when('isRequired', (_, current) => {
                            if (isRequired) {
                                return current.required(t('validation.required'))
                            }
                            return current
                        })
                    break
                }
                case isArray && !hasConstraints: {
                    schema[attribute.technicalName] = array().of(string().required(t('validation.required')))

                    break
                }
                case isRegex: {
                    if (attribute.constraints) {
                        const regexConstraints = attribute.constraints[0] as AttributeConstraintRegexAllOf
                        const regexPattern = new RegExp(regexConstraints.regex ?? '')

                        schema[attribute.technicalName] = string()
                            .matches(regexPattern, t('validation.wrongRegex', { regexFormat: regexConstraints.regex }))
                            .when('isRequired', (_, current) => {
                                if (isRequired) {
                                    return current.required(t('validation.required'))
                                }
                                return current
                            })
                    }
                    break
                }
                case isEmail: {
                    schema[attribute.technicalName] = string()
                        .email(t('validation.invalidEmail'))
                        .when('isRequired', (_, current) => {
                            if (isRequired) {
                                return current.required(t('validation.required'))
                            }
                            return current
                        })
                    break
                }
                case isPhone: {
                    schema[attribute.technicalName] = string()
                        .matches(phoneOrEmptyStringRegex, t('validation.invalidPhone'))
                        .when('isRequired', (_, current) => {
                            if (isRequired) {
                                return current.required(t('validation.required'))
                            }
                            return current
                        })
                    break
                }

                default: {
                    schema[attribute.technicalName] = string().when('isRequired', (_, current) => {
                        if (isRequired) {
                            return current.required(t('validation.required'))
                        }
                        return current
                    })
                }
            }
        } else if (hasNumericValue) {
            switch (true) {
                case isArray: {
                    schema[attribute.technicalName] = array().of(
                        numericProperties(t, number(), attribute, isByte, isShort, canBeDecimal, isInterval ?? false, isRegex ?? false, isRequired),
                    )
                    break
                }
                default: {
                    schema[attribute.technicalName] = numericProperties(
                        t,
                        number(),
                        attribute,
                        isByte,
                        isShort,
                        canBeDecimal,
                        isInterval ?? false,
                        isRegex ?? false,
                        isRequired,
                    )
                }
            }
        } else if (isDate) {
            schema[attribute.technicalName] = date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (isRequired) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
        } else if (isBoolean) {
            schema[attribute.technicalName] = boolean().when('isRequired', (_, current) => {
                if (isRequired) {
                    return current.required(t('validation.required'))
                }
                return current
            })
        } else if (isFile) {
            schema[attribute.technicalName] = mixed<FileList>().when('isRequired', (_, current) => {
                if (isRequired) {
                    return current.required(t('validation.required'))
                }
                return current
            })
        } else if (isCharacter) {
            schema[attribute.technicalName] = string()
                .min(0, t('validation.character'))
                .max(1, t('validation.character'))
                .when('isRequired', (_, current) => {
                    if (isRequired) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
        }
    })

    return object().shape(schema)
}
