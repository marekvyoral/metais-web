import { AttributeAttributeTypeEnum, AttributeConstraintRegexAllOf, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
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
import { REGEX_TEL, HTML_TYPE, REGEX_EMAIL } from '@isdd/metais-common/constants'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'

import { numericProperties } from './createEntityHelpers'

import { getSpecialRule } from '@/componentHelpers/ci/ciEntityFormSchemaSpecialRulesConfig'

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
        | ArraySchema<(string | undefined)[] | undefined | null, AnyObject, '', ''>
        | ArraySchema<{ label?: string | undefined; value?: string | undefined }[] | undefined, AnyObject, '', ''>
        | ArraySchema<number[] | undefined, AnyObject, '', ''>
        | ArraySchema<(number | null | undefined)[] | undefined, AnyObject, '', ''>
}

export const generateFormSchema = (
    data: AttributeProfile[],
    t: TFunction<'translation', undefined, 'translation'>,
    lang: string,
    selectedRole?: GidRoleData | null,
    entityName?: string,
) => {
    const schema: SchemaType = {}
    const attributes = selectedRole
        ? data.filter((profile) => profile?.roleList?.includes(selectedRole?.roleName ?? '')).flatMap((profile) => profile?.attributes)
        : data.flatMap((profile) => profile?.attributes ?? [])

    attributes?.forEach((attribute) => {
        const isInvisible = attribute?.invisible

        const isRegex = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === 'regex'
        const isInterval = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === 'interval'

        const isEmail = attribute?.name?.toLowerCase() === 'email'
        const isPhone = attribute?.name == t('validation.phone')

        const isName = attribute?.name == t('validation.name') || attribute?.name == t('validation.surname')

        const isRequired = attribute?.mandatory?.type === 'critical' && !attribute.readOnly

        const isDate = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.DATE
        const isDateTime = attribute?.attributeTypeEnum === AttributeAttributeTypeEnum.DATETIME
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
                        const attributeMessage = lang === Languages.ENGLISH ? attribute.engDescription : attribute.description
                        schema[attribute.technicalName] = array().of(
                            string().matches(regexPattern, attributeMessage).required(t('validation.required')),
                        )
                    }
                    break
                }

                case isArray: {
                    schema[attribute.technicalName] = array()
                        .nullable()
                        .transform((curr, orig) => (orig === '' ? null : curr))
                        .of(string())
                        .when('isRequired', (_, current) => {
                            if (isRequired) {
                                return current.required(t('validation.required'))
                            }
                            return current
                        })

                    break
                }

                case isRegex: {
                    if (attribute.constraints) {
                        const regexConstraints = attribute.constraints[0] as AttributeConstraintRegexAllOf
                        const regexPattern = new RegExp(regexConstraints.regex ?? '')
                        const attributeMessage = lang === Languages.ENGLISH ? attribute.engDescription : attribute.description
                        schema[attribute.technicalName] = string()
                            .matches(regexPattern, attributeMessage)
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
                        .matches(REGEX_EMAIL, { message: t('validation.invalidEmail') })
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
                        .matches(REGEX_TEL, t('validation.invalidPhone'))
                        .when('isRequired', (_, current) => {
                            if (isRequired) {
                                return current.required(t('validation.required'))
                            }
                            return current
                        })
                    break
                }

                case isName: {
                    schema[attribute.technicalName] = string()
                        .matches(/^([^0-9]*)$/, t('validation.noNumbers'))
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
            schema[attribute.technicalName] =
                getSpecialRule({ technicalName: attribute.technicalName, entityName, t, required: isRequired }) ??
                date()
                    .nullable()
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .when('isRequired', (_, current) => {
                        if (isRequired) {
                            return current.required(t('validation.required'))
                        }
                        return current
                    })
        } else if (isDateTime) {
            schema[attribute.technicalName] =
                getSpecialRule({ technicalName: attribute.technicalName, entityName, t, required: isRequired }) ??
                date()
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
