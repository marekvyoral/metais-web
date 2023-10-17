import React, { FC, useEffect, useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { UseFormSetValue } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { TextWarning } from '@isdd/idsk-ui-kit'

import style from './customFilterAttribute.module.scss'

import { IAttributeFilters, IFilterParams, OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { DynamicFilterAttributeRow } from '@isdd/metais-common/components/dynamicFilterAttributeRow/DynamicFilterAttributeRow'
import { MAX_DYNAMIC_ATTRIBUTES_LENGHT, OPERATOR_SEPARATOR_TYPE } from '@isdd/metais-common/constants/index'
import { EnumType } from '@isdd/metais-common/api'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { formatAttributeOperatorString } from '@isdd/metais-common/componentHelpers/filter/formatAttirbuteOperatorString'
import { transformOperatorsFromUrl } from '@isdd/metais-common/componentHelpers/filter/transformOperators'
import { findDefaultOperator } from '@isdd/metais-common/componentHelpers/filter/findDefaultOperator'
import { findAvailableOperators } from '@isdd/metais-common/componentHelpers/filter/findAvailableOperators'
import { findAttributeType } from '@isdd/metais-common/componentHelpers/filter/findAttributeType'
import { findAttributeConstraints } from '@isdd/metais-common/componentHelpers/filter/findAttributeConstraints'

export interface FilterAttribute {
    value?: string | string[] | Date | null
    operator?: string
    name?: string
}

export interface ColumnAttribute {
    name: string
}

interface Props {
    data?: IAttributeFilters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaults: { [key: string]: any }
    setValue: UseFormSetValue<IFilterParams>
    attributes: Attribute[] | undefined
    attributeProfiles: AttributeProfile[] | undefined
    constraintsData: (EnumType | undefined)[]
}

export const DynamicFilterAttributes: FC<Props> = ({ data = {}, setValue, attributes, attributeProfiles, constraintsData, defaults }) => {
    const [dynamicAttributes, setDynamicAttributes] = useState<FilterAttribute[]>([])

    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()

    const [addRowError, setAddRowError] = useState<string>('')
    const combinedAttributes = [...(attributes ?? []), ...(attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? [])]
    const filteredAvailable = attributeProfiles?.map((profile) => {
        const defaultKeys = Object.keys(defaults)
        const newProfile = { ...profile }
        newProfile.attributes = profile.attributes?.filter((attr) => !defaultKeys.includes(attr.technicalName || ''))
        return newProfile
    })

    useEffect(() => {
        // this should happened only on mount is one time thing which restore params from url
        const filterAttributes: FilterAttribute[] = []

        Object.keys(data).forEach((name) => {
            if (data[name].length > 1) {
                const values = data[name].map((attr) => attr.value as string)

                const operators = data[name].map((attr) => attr.operator)
                const uniqueOperators = [...new Set(operators)]

                //this means it is multiSelect
                if (uniqueOperators.length > 1) {
                    uniqueOperators.forEach((operator, index) => {
                        filterAttributes.push({ name, operator: transformOperatorsFromUrl(operator), value: values[index] })
                        setValue(formatAttributeOperatorString(name, transformOperatorsFromUrl(operator)), values[index])
                    })
                } else {
                    filterAttributes.push({ name, operator: transformOperatorsFromUrl(operators[0]), value: values })
                    setValue(formatAttributeOperatorString(name, transformOperatorsFromUrl(operators[0])), values)
                }
            } else {
                data[name].forEach((attr) => {
                    filterAttributes.push({ name, operator: transformOperatorsFromUrl(attr.operator), value: attr.value })
                    setValue(formatAttributeOperatorString(name, transformOperatorsFromUrl(attr.operator)), attr.value)
                })
            }
        })

        setDynamicAttributes(filterAttributes)
        // eslint-disable-next-line
    }, [])

    const removeAttrRow = (index: number, attribute: FilterAttribute) => {
        const copyAttribute = [...dynamicAttributes]
        const formName: `${string}${OPERATOR_SEPARATOR_TYPE}${string}` = formatAttributeOperatorString(attribute.name ?? '', attribute.operator ?? '')
        copyAttribute.splice(index, 1)
        setDynamicAttributes(copyAttribute)
        setValue(formName, '')
        if (searchParams.get(formName)) {
            searchParams.delete(formName)
            setSearchParams(searchParams)
        }
    }

    const handleAttrChange = (index: number, attr: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => {
        const copyAttribute = [...dynamicAttributes]
        copyAttribute[index] = attr

        const attributeConstraints = findAttributeConstraints(attr.name ?? '', combinedAttributes, constraintsData)
        const attributeType = findAttributeType(attr.name ?? '', combinedAttributes)

        const currentAvailableOperators = dynamicAttributes.filter((item) => item.name === attr.name).map((item) => item.operator)
        const operatorsToDisable = findAvailableOperators(
            attributeType,
            attributeConstraints,
            Object.values(OPERATOR_OPTIONS_URL),
            currentAvailableOperators,
        )

        const attributeDefaultOperator = findDefaultOperator(attributeType, attributeConstraints)

        const newAttribute = {
            name: copyAttribute[index].name ?? '',
            operator: isNewName && operatorsToDisable.includes(attributeDefaultOperator) ? attributeDefaultOperator : copyAttribute[index].operator,
            value: copyAttribute[index].value ?? '',
        }

        setDynamicAttributes([...copyAttribute.slice(0, index), newAttribute, ...copyAttribute.slice(index + 1)])

        if (attr.name && attr.operator && (attr.value || attr.value === '')) {
            setValue(formatAttributeOperatorString(attr.name, attr.operator), attr.value)
        }
        if (prevData?.name && prevData?.operator) {
            setValue(formatAttributeOperatorString(prevData.name, prevData.operator), undefined)
        }
    }

    const addRow = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const defaultDynamicValue = { value: '', operator: '', name: '' }
        if (dynamicAttributes.length < MAX_DYNAMIC_ATTRIBUTES_LENGHT) {
            setDynamicAttributes([...dynamicAttributes, defaultDynamicValue])
        } else {
            setAddRowError(t('customAttributeFilter.addRowErrorMessage', { value: MAX_DYNAMIC_ATTRIBUTES_LENGHT }))
        }
    }

    return (
        <div>
            {dynamicAttributes.map((attribute, index) => (
                <DynamicFilterAttributeRow
                    key={`custom-attribute-${index}`}
                    index={index}
                    selectedAttributes={dynamicAttributes}
                    attributeProfiles={filteredAvailable}
                    attributes={attributes}
                    remove={() => removeAttrRow(index, attribute)}
                    onChange={(attr, prevData, isNewName) => handleAttrChange(index, attr, prevData, isNewName)}
                    attribute={attribute}
                    attributeType={findAttributeType(attribute.name ?? '', combinedAttributes)}
                    currentAttribute={attribute}
                    attributeConstraints={findAttributeConstraints(attribute.name ?? '', combinedAttributes, constraintsData)}
                />
            ))}
            {addRowError && (
                <div className={style.addRowErrorDiv}>
                    <TextWarning>{addRowError}</TextWarning>
                    <ButtonLink
                        className={style.addRowErrorClose}
                        label={t('customAttributeFilter.addRowErrorClose')}
                        onClick={() => setAddRowError('')}
                    />
                </div>
            )}
            <ButtonLink label={t('customAttributeFilter.add')} className={style.addButton} type="button" onClick={addRow} />
        </div>
    )
}
