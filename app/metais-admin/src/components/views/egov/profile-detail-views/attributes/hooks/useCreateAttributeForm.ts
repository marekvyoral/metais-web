import { yupResolver } from '@hookform/resolvers/yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    AttributeAttributeTypeEnum,
    AttributeConstraint,
    AttributeConstraintEnumAllOf,
    AttributeConstraintIntervalAllOf,
    AttributeConstraintRegexAllOf,
    AttributeProfile,
} from '@isdd/metais-common/api/generated/types-repo-swagger'

import { generateSchemaForCreateAttribute } from './schemas/createAttributeSchema'
import { isSelectedTypeNumber } from './helpers'

interface iUseCreateAttributeForm {
    formMethods: UseFormReturn<
        {
            name: string
            engName: string
            technicalName: string
            order: number
            description: string
            engDescription: string | undefined
            attributeProfiles: AttributeProfile[] | undefined
            type: string
            units: string | undefined
            defaultValue: string | boolean | number | undefined
            constraints: AttributeConstraint[] | AttributeConstraintRegexAllOf[] | AttributeConstraintIntervalAllOf[] | AttributeConstraintEnumAllOf[]
            array?: boolean
            displayAs?: string
        },
        unknown,
        undefined
    >
    selectedConstraint?: string
    showConstraint?: boolean
    showUnit?: boolean
    selectedType?: string
}

export const useCreateAttributeForm = (): iUseCreateAttributeForm => {
    const { t } = useTranslation()
    const formMethods = useForm({
        shouldUnregister: true,
        resolver: yupResolver(generateSchemaForCreateAttribute(t)),
    })

    const selectedType = formMethods.watch('type')

    const showUnit = isSelectedTypeNumber(selectedType)
    const showConstraint = selectedType === AttributeAttributeTypeEnum.INTEGER || selectedType === AttributeAttributeTypeEnum.STRING

    const selectedConstraint = formMethods.watch('constraints.0.type')
    return {
        formMethods,
        selectedConstraint,
        showConstraint,
        showUnit,
        selectedType,
    }
}
