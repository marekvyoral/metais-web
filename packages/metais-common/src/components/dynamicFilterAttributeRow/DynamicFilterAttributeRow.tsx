import React, { FC } from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'

import style from './customFilterAttribute.module.scss'
import { DynamicFilterAttributeInput } from './DynamicFilterAttributeInput'

import { FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { Attribute, AttributeAttributeTypeEnum, EnumType } from '@isdd/metais-common/api'
import { findAvailableOperators } from '@isdd/metais-common/componentHelpers/filter/findAvailableOperators'

interface Props {
    index: number
    onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void
    attribute: FilterAttribute
    remove: () => void
    availableAttributes?: (Attribute | undefined)[]
    selectedAttributes: FilterAttribute[]
    attributeType: {
        isArray: boolean
        type: string
    }
    attributeConstraints: EnumType | undefined
    currentAttribute: FilterAttribute
}

export const DynamicFilterAttributeRow: FC<Props> = ({
    index,
    onChange,
    attribute,
    remove,
    availableAttributes,
    attributeType,
    attributeConstraints,
    selectedAttributes,
    currentAttribute,
}) => {
    const { t } = useTranslation()

    const currentAvailableOperators = selectedAttributes.filter((item) => item.name === currentAttribute.name).map((item) => item.operator)
    const operatorsToDisable = findAvailableOperators(
        attributeType,
        attributeConstraints,
        Object.values(OPERATOR_OPTIONS_URL),
        currentAvailableOperators,
    )

    const availableAttrs =
        availableAttributes?.map((attr) => {
            return {
                value: `${attr?.technicalName}`,
                label: `${attr?.name}`,
                disabled:
                    //create context for current names with operators
                    //!!(selectedAttributes.find((item) => item.name === attr?.technicalName) && currentAttribute.name !== attr?.technicalName) ||
                    attr?.attributeTypeEnum === AttributeAttributeTypeEnum.IMAGE ||
                    //date type until bug with dates in dynamic inputs is not resolved
                    attr?.attributeTypeEnum === AttributeAttributeTypeEnum.DATE ||
                    attr?.attributeTypeEnum === AttributeAttributeTypeEnum.STRING_PAIR,
            }
        }) || []

    const availableOperators = findAvailableOperators(attributeType, attributeConstraints, Object.values(OPERATOR_OPTIONS_URL)).map((option) => ({
        value: option,
        label: t(`customAttributeFilter.operator.${option}`),
        disabled: !operatorsToDisable.includes(option),
    }))

    return (
        <div className={style.customFilterWrapper}>
            <SimpleSelect
                className={style.rowItem}
                id={`attribute-name-${index}`}
                label={t('customAttributeFilter.attribute.label')}
                placeholder={t('customAttributeFilter.attribute.placeholder')}
                name={`atributeName`}
                value={attribute.name}
                options={availableAttrs}
                onChange={(val) => onChange({ ...attribute, name: val }, attribute, true)}
            />
            <SimpleSelect
                className={style.rowItem}
                id={`attribute-operator-${index}`}
                name={`attribute-operator-${index}`}
                label={t('customAttributeFilter.operator.label')}
                placeholder={t('customAttributeFilter.operator.placeholder')}
                options={availableOperators}
                value={attribute.operator}
                onChange={(val) => onChange({ ...attribute, operator: val }, attribute)}
            />

            <DynamicFilterAttributeInput
                constraints={attributeConstraints}
                attributeType={attributeType}
                value={attribute}
                index={index}
                onChange={onChange}
            />

            <ButtonLink
                onClick={(e) => {
                    e.preventDefault()
                    remove()
                }}
                type="button"
                className={style.trashIcon}
                label={
                    <>
                        <span className="govuk-visually-hidden">{t('customAttributeFilter.remove')}</span>
                        <i aria-hidden="true" className="fas fa-trash" />
                    </>
                }
            />
        </div>
    )
}
