import React, { FC } from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import { useTranslation } from 'react-i18next'
import { Input } from '@isdd/idsk-ui-kit/input/Input'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'

import style from './customFilterAttribute.module.scss'

import { FilterAttribute, ColumnAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'

interface Props {
    index: number
    onChange: (data: FilterAttribute, prevData?: FilterAttribute) => void
    value: FilterAttribute
    remove: () => void
    availableAttributes?: ColumnAttribute[]
    selectedAttributes: FilterAttribute[]
}

export const DynamicFilterAttributeRow: FC<Props> = ({ index, onChange, value, remove, availableAttributes, selectedAttributes }) => {
    const { t } = useTranslation()

    const availableOperators = Object.values(OPERATOR_OPTIONS)
        .filter(
            (operator) =>
                !selectedAttributes.find(
                    (attribute) => value.operator !== operator && attribute.operator === operator && value.name && value.name === attribute.name,
                ),
        )
        .map((option) => ({ value: option, label: t(`customAttributeFilter.operator.${option}`) }))
    const availableAttrs =
        availableAttributes?.map((attr: ColumnAttribute) => ({
            value: attr.name,
            label: attr.name,
        })) || []
    return (
        <div className={style.customFilterWrapper}>
            <SimpleSelect
                className={style.rowItem}
                id={`attribute-name-${index}`}
                label={t('customAttributeFilter.attribute.label')}
                placeholder={t('customAttributeFilter.attribute.placeholder')}
                name={`atributeName`}
                value={value.name}
                options={availableAttrs}
                onChange={(e) => onChange({ ...value, name: e.target.value }, value)}
            />
            <SimpleSelect
                className={style.rowItem}
                id={`attribute-operator-${index}`}
                label={t('customAttributeFilter.operator.label')}
                placeholder={t('customAttributeFilter.operator.placeholder')}
                options={availableOperators}
                value={value.operator}
                onChange={(e) => onChange({ ...value, operator: e.target.value }, value)}
            />
            <Input
                className={style.rowItem}
                id={`attribute-value-${index}`}
                label={t('customAttributeFilter.value.label')}
                placeholder={t('customAttributeFilter.value.placeholder')}
                name={`atributeValue`}
                value={value.value}
                onChange={(e) => onChange({ ...value, value: e.target.value })}
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
