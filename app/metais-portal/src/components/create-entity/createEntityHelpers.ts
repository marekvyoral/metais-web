import { Attribute, AttributeConstraintIntervalAllOf, AttributeConstraintRegexAllOf } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'
import { FieldErrors, FieldValues } from 'react-hook-form'
import { AnyObject, NumberSchema } from 'yup'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'

import { ByteInterval, ShortInterval } from './createCiEntityFormSchema'

export const isRoundNumber = (value: number) => {
    return value === parseInt(value.toString(), 10)
}

export const numericProperties = (
    t: TFunction<'translation', undefined, 'translation'>,
    numericSchema: NumberSchema<number | undefined, AnyObject, undefined, ''>,
    attribute: Attribute,
    isByte: boolean,
    isShort: boolean,
    canBeDecimal: boolean,
    isInterval: boolean,
    isRegex: boolean,
    isRequired: boolean,
) => {
    return numericSchema
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
}

export const formatFormAttributeValue = (formAttributes: FieldValues, key: string) => {
    if (Array.isArray(formAttributes[key]) && formAttributes[key][0] && formAttributes[key][0].value != null) {
        return formAttributes[key].map((item: { value: string; label: string; disabled: boolean }) => item.value)
    }

    return formAttributes[key] === '' ? null : formAttributes[key]
}

export const getAttributeInputErrorMessage = (attribute: Attribute, errors: FieldErrors<FieldValues>) => {
    if (attribute.technicalName != null) {
        const error = Object.keys(errors).includes(attribute.technicalName)
        return error ? errors[attribute.technicalName] : undefined
    }
    return undefined
}

export const findAttributeConstraint = (enumCodes: string[], constraintsData: (EnumType | undefined)[]) => {
    const attributeConstraint = constraintsData.find((constraint) => constraint?.code === enumCodes[0])
    return attributeConstraint
}

export const getAttributeUnits = (unitCode: string, unitsData: EnumType | undefined) => {
    const attributeUnit = unitsData?.enumItems?.find((item) => item.code == unitCode)
    return attributeUnit
}
