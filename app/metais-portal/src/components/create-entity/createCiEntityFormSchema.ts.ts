import { BooleanSchema, DateSchema, MixedSchema, NumberSchema, StringSchema, boolean, date, number, object, string, mixed } from 'yup'
import { TFunction } from 'i18next'
import {
    Attribute,
    AttributeAttributeTypeEnum,
    AttributeConstraintIntervalAllOf,
    AttributeConstraintRegexAllOf,
} from '@isdd/metais-common/api/generated/types-repo-swagger'

enum ByteInterval {
    MIN = -128,
    MAX = 127,
}

enum ShortInterval {
    MIN = -32_768,
    MAX = 32_767,
}

type NullableDateSchema = DateSchema<Date | null | undefined>
type NullableNumberSchema = NumberSchema<number | null | undefined>

type SchemaType = {
    [key: string]: StringSchema | NumberSchema | BooleanSchema | DateSchema | MixedSchema | NullableDateSchema | NullableNumberSchema
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

        const hasNumericValue = isInteger || isDouble || isLong || isByte || isShort || isFloat
        const canBeDecimal = isDouble || isFloat

        const isRoundNumber = (value: number) => {
            return value === parseInt(value.toString(), 10)
        }

        if (isInvisible) return
        if (attribute?.technicalName == null) return

        if (isString) {
            switch (true) {
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
            schema[attribute.technicalName] = number()
                .transform((value) => (isNaN(value) ? undefined : value))
                .nullable()
                .when('isByteOrShort', (_, current) => {
                    if (isByte) {
                        return current
                            .min(ByteInterval.MIN, `${t('validation.minValue')} ${ByteInterval.MIN}`)
                            .max(ByteInterval.MAX, `${t('validation.maxValue')} ${ByteInterval.MAX}`)
                    }
                    if (isShort) {
                        return current
                            .min(ShortInterval.MIN, `${t('validation.minValue')} ${ShortInterval.MIN}`)
                            .max(ShortInterval.MAX, `${t('validation.maxValue')} ${ShortInterval.MAX}`)
                    }
                    return current
                })
                .when('isRound', (_, current) => {
                    if (!canBeDecimal) {
                        return current.test('isRound', t('validation.canNotBeDecimal'), (value) => {
                            if (value == null) return true
                            return isRoundNumber(value)
                        })
                    }
                    return current
                })
                .when('isInterval', (_, current) => {
                    if (attribute?.constraints && isInterval) {
                        const interval = attribute.constraints[0] as AttributeConstraintIntervalAllOf
                        return current
                            .min(interval.minValue ?? 0, `${t('validation.minValue')} ${interval.minValue}`)
                            .max(interval.maxValue ?? 0, `${t('validation.maxValue')} ${interval.maxValue}`)
                    }
                    return current
                })
                .when('isRegex', (_, current) => {
                    if (attribute?.constraints && attribute.constraints?.length > 0) {
                        if (isRegex && attribute.technicalName) {
                            const regexConstraints = attribute.constraints[0] as AttributeConstraintRegexAllOf
                            const regexPattern = new RegExp(regexConstraints.regex ?? '')

                            return current.test('matchesRegex', t('validation.wrongRegex', { regexFormat: regexConstraints.regex }), (value) => {
                                if (value) {
                                    return regexPattern.test(value?.toString())
                                }
                            })
                        }
                    }
                    return current
                })
                .when('isRequired', (_, current) => {
                    if (isRequired) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
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
