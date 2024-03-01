import { GroupedOption, SelectWithGroupedOptions, SimpleSelect } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import style from './customFilterAttribute.module.scss'
import { DynamicFilterAttributeInput } from './DynamicFilterAttributeInput'

import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CustomAttributeType } from '@isdd/metais-common/componentHelpers/filter/findAttributeType'
import { findAvailableOperators } from '@isdd/metais-common/componentHelpers/filter/findAvailableOperators'
import { ExtendedAttribute, FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { Languages } from '@isdd/metais-common/localization/languages'

interface Props {
    index: number
    onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void
    attribute: FilterAttribute
    remove: () => void
    selectedAttributes: FilterAttribute[]
    attributeProfiles: AttributeProfile[] | undefined
    attributes: ExtendedAttribute[] | undefined
    attributeType: CustomAttributeType
    attributeConstraints: EnumType | undefined
    currentAttribute: FilterAttribute
    ignoreInputNames?: string[]
    ciName?: string
}

export const DynamicFilterAttributeRow: FC<Props> = ({
    index,
    onChange,
    attribute,
    remove,
    attributeType,
    attributeConstraints,
    selectedAttributes,
    currentAttribute,
    attributes,
    ignoreInputNames,
    attributeProfiles,
    ciName,
}) => {
    const { t, i18n } = useTranslation()

    const language = i18n.language
    const isLangSK = language === Languages.SLOVAK
    const currentAvailableOperators = selectedAttributes.filter((item) => item.name === currentAttribute.name).map((item) => item.operator)
    const operatorsToDisable = findAvailableOperators(
        attributeType,
        attributeConstraints,
        Object.values(OPERATOR_OPTIONS_URL),
        currentAvailableOperators,
    )

    const attributeProfilesColumnSections: GroupedOption[] =
        attributeProfiles?.map((attributeProfile) => ({
            label: attributeProfile.name || '',
            options:
                attributeProfile.attributes
                    ?.filter((attr) => attr.invisible === false && attr.valid)
                    .map((attr) => ({
                        label: isLangSK ? attr.name ?? '' : attr.engName ?? '',
                        value: attr.technicalName ?? '',
                    })) || [],
        })) ?? []

    const metaAttributes4 = getCiDefaultMetaAttributes({ t })
    const metaAttributesColumnSections: GroupedOption = {
        label: metaAttributes4.name || '',
        options:
            metaAttributes4.attributes
                .filter((item) => !ignoreInputNames?.includes(item.technicalName))
                .map((attr) => ({
                    label: isLangSK ? attr.name ?? '' : attr.engName ?? '',
                    value: attr.technicalName ?? '',
                })) || [],
    }

    const attributesColumnSection: GroupedOption = {
        label: ciName || '',
        options:
            attributes
                ?.filter((attr) => attr.invisible === false && attr.valid)
                ?.map((attr) => ({
                    label: isLangSK ? attr.name ?? '' : attr.engName ?? '',
                    value: attr.technicalName ?? '',
                })) ?? [],
    }

    const availableOperators = findAvailableOperators(attributeType, attributeConstraints, Object.values(OPERATOR_OPTIONS_URL)).map((option) => ({
        value: option,
        label: t(`customAttributeFilter.operator.${option}`),
        disabled: !operatorsToDisable.includes(option),
    }))
    const options = [attributesColumnSection, ...attributeProfilesColumnSections, metaAttributesColumnSections]
    const defaultValue = options.map((opt) => opt.options?.find((item) => item.value === attribute.name))
    const deleteLabelValue = defaultValue.find((option) => option !== undefined)

    return (
        <div className={style.customFilterWrapper}>
            <SelectWithGroupedOptions
                id={`attribute-name-${index}`}
                name={`attributeName`}
                className={style.rowItem}
                label={t('customAttributeFilter.attribute.label')}
                defaultValue={defaultValue}
                options={options}
                placeholder={t('customAttributeFilter.attribute.placeholder')}
                onChange={(val) => {
                    onChange({ ...attribute, name: val?.value }, attribute, true)
                }}
            />
            <SimpleSelect
                isClearable={false}
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
                customComponent={attributeType.customComponent}
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
                        <span className="govuk-visually-hidden">
                            {t('customAttributeFilter.remove', {
                                name: deleteLabelValue?.label ? String(deleteLabelValue.label).toLowerCase() : undefined,
                            })}
                        </span>
                        <i aria-hidden="true" className="fas fa-trash" />
                    </>
                }
            />
        </div>
    )
}
