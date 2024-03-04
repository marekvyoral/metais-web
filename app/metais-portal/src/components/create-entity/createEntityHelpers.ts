import {
    Attribute,
    AttributeConstraintIntervalAllOf,
    AttributeConstraintRegexAllOf,
    AttributeProfile,
    CiCode,
    CiType,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'
import { FieldErrors, FieldValues, UseFormSetValue } from 'react-hook-form'
import { AnyObject, NumberSchema } from 'yup'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { isDate, isObjectEmpty } from '@isdd/metais-common/utils/utils'
import { ENTITY_TRAINING, ROLES } from '@isdd/metais-common/constants'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { DateTime } from 'luxon'
import { ConfigurationItemUiAttributes, ApiError, ConfigurationItemUi, RequestIdUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useEffect, useState } from 'react'
import {
    useInvalidateCiHistoryListCache,
    useInvalidateCiItemCache,
    useInvalidateCiListFilteredCache,
} from '@isdd/metais-common/hooks/invalidate-cache'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { v4 as uuidV4 } from 'uuid'

import { ByteInterval, ShortInterval } from './createCiEntityFormSchema'

import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'

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

export const formatFormAttributeValue = (formAttributes: FieldValues, key: string, ciurl?: string) => {
    if (Array.isArray(formAttributes[key]) && formAttributes[key][0] && formAttributes[key][0].value != null) {
        return formAttributes[key].map((item: { value: string; label: string; disabled: boolean }) => item.value)
    }
    if (isDate(formAttributes[key])) {
        return DateTime.fromJSDate(formAttributes[key]).toISO()
    }
    if (key === ATTRIBUTE_NAME.Gen_Profil_ref_id) {
        return `${ciurl ?? ''}${formAttributes[key]}`
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

export const getFilteredAttributeProfilesBasedOnRole = (profiles: AttributeProfile[], currentRoleName: string) => {
    return profiles.filter((profile) => profile?.roleList?.includes(currentRoleName))
}

export const isEAGarpoRole = (roleName: string): boolean => {
    return roleName === ROLES.EA_GARPO
}

export const getHint = (att: Attribute, generatedEntityId: CiCode) => {
    if (att.technicalName === AttributesConfigTechNames.REFERENCE_ID) {
        const lastIndex = generatedEntityId?.ciurl?.lastIndexOf('/')
        const urlString = generatedEntityId?.ciurl?.slice(0, lastIndex) + '/'
        return urlString
    }
}

type ResetDefaultValuesForCiEntityArgs = {
    generatedEntityId: CiCode | undefined
    setValue: UseFormSetValue<ConfigurationItemUiAttributes>
    formDefaultValues: ConfigurationItemUiAttributes
    defaultValues:
        | Readonly<{
              [x: string]: unknown
          }>
        | undefined
    isUpdate: boolean
}

export const useResetDefaultValuesForCiEntity = ({
    defaultValues,
    formDefaultValues,
    generatedEntityId,
    setValue,
    isUpdate,
}: ResetDefaultValuesForCiEntityArgs) => {
    useEffect(() => {
        if (!isUpdate) {
            const referenceIdValue = generatedEntityId?.ciurl
            const metaIsCodeValue = generatedEntityId?.cicode
            setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
            setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
        }

        Object.entries(formDefaultValues).forEach((item) => {
            const element = defaultValues?.[item[0]]
            if (element === '' || element === undefined) {
                setValue(item[0], item[1])
            }
        })
    }, [defaultValues, formDefaultValues, generatedEntityId?.cicode, generatedEntityId?.ciurl, isUpdate, setValue])
}

export const getUrlStringFromCiCode = (ciCode: CiCode) => {
    const lastIndex = ciCode.ciurl?.lastIndexOf('/')
    const urlString = ciCode.ciurl?.slice(0, lastIndex) + '/'
    return urlString
}

type CiStatusSuccess = {
    configurationItemId: string
    entityName: string
    isUpdate: boolean
}

export const useCiCreateEditOnStatusSuccess = (basePath?: string) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate: invalidateCilistFilteredCache } = useInvalidateCiListFilteredCache()
    const { invalidate: invalidateCiByUuidCache } = useInvalidateCiItemCache()
    const { invalidate: invalidateCiHistoryList } = useInvalidateCiHistoryListCache()

    const onStatusSuccess = ({ configurationItemId, entityName, isUpdate }: CiStatusSuccess) => {
        invalidateCiHistoryList(configurationItemId)
        invalidateCilistFilteredCache({ ciType: entityName })
        invalidateCiByUuidCache(configurationItemId)

        const toPath = basePath ? `${basePath}/${configurationItemId}` : `/ci/${entityName}/${configurationItemId}`
        setIsActionSuccess({ value: true, path: toPath, additionalInfo: { type: isUpdate ? 'edit' : 'create' } })
        navigate(toPath, { state: { from: location } })
    }

    return onStatusSuccess
}

type CiOnSubmitType = {
    formData: FieldValues
    storeCiItem: UseMutateAsyncFunction<
        RequestIdUi,
        ApiError,
        {
            data: ConfigurationItemUi
        },
        unknown
    >
    ownerId: string | undefined
    generatedEntityId: CiCode | undefined
    updateCiItemId?: string
}

export const useCiCreateUpdateOnSubmit = (entityName?: string) => {
    const [uploadError, setUploadError] = useState(false)
    const [configurationItemId, setConfigurationItemId] = useState<string>('')

    const onSubmit = async ({ formData, storeCiItem, ownerId, generatedEntityId, updateCiItemId }: CiOnSubmitType) => {
        const isUpdate = !!updateCiItemId
        if (!isUpdate && entityName === ENTITY_TRAINING) {
            formData[ATTRIBUTE_NAME.Profil_Skolenie_pocet_volnych_miest] = formData[ATTRIBUTE_NAME.Profil_Skolenie_pocet_miest]
        }
        const formAttributesKeys = Object.keys(formData)
        const urlString = getUrlStringFromCiCode(generatedEntityId ?? {})
        const formattedAttributesToSend = formAttributesKeys
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formData, key, urlString),
            }))
            .filter((att) => !isObjectEmpty(att.value))

        const type = entityName
        const uuid = isUpdate ? updateCiItemId : uuidV4()
        const dataToUpdate = {
            uuid: uuid,
            type: type,
            attributes: formattedAttributesToSend,
        }

        const dataToCreate = {
            ...dataToUpdate,
            owner: ownerId,
        }

        setUploadError(false)
        setConfigurationItemId(uuid)

        await storeCiItem({
            data: isUpdate ? dataToUpdate : dataToCreate,
        })

        return uuid
    }

    return { uploadError, setUploadError, configurationItemId, onSubmit }
}

export const getValidAndVisibleAttributes = (ciTypeData: CiType | undefined): Attribute[] => {
    return [...(ciTypeData?.attributes ?? []), ...(ciTypeData?.attributeProfiles?.flatMap((profile) => profile.attributes ?? []) ?? [])].filter(
        (att) => att && !att.invisible && att.valid,
    )
}
