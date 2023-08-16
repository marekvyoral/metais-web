import { Input, MultiSelect, RadioButton, RadioButtonGroup } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'

import style from './customFilterAttribute.module.scss'

import { FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { AttributeAttributeTypeEnum, EnumType } from '@isdd/metais-common/api'
import { getCurrentMultiSelectValue } from '@isdd/metais-common/componentHelpers/filter/getCurrentMultiSelectValue'

enum RadioInputValue {
    TRUE = 'true',
    FALSE = 'false',
}

interface Props {
    attributeType: {
        isArray: boolean
        type: string
    }
    index: number
    value: FilterAttribute
    constraints: EnumType | undefined
    onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void
}

export const DynamicFilterAttributeInput: React.FC<Props> = ({ attributeType, index, value, onChange, constraints }) => {
    const { t } = useTranslation()

    const isBoolean = attributeType.type === AttributeAttributeTypeEnum.BOOLEAN
    const isInteger = attributeType.type === AttributeAttributeTypeEnum.INTEGER
    const isDouble = attributeType.type === AttributeAttributeTypeEnum.DOUBLE
    const isFloat = attributeType.type === AttributeAttributeTypeEnum.FLOAT
    const isShort = attributeType.type === AttributeAttributeTypeEnum.SHORT
    const isLong = attributeType.type === AttributeAttributeTypeEnum.LONG
    const isByte = attributeType.type === AttributeAttributeTypeEnum.BYTE
    const isDate = attributeType.type === AttributeAttributeTypeEnum.DATE
    const isCharacter = attributeType.type === AttributeAttributeTypeEnum.CHARACTER
    // const isStringPair = attributeType.type === AttributeAttributeTypeEnum.STRING_PAIR
    // const isFile = attributeType.type === AttributeAttributeTypeEnum.IMAGE

    const hasEnumItems = !!constraints?.code && constraints.enumItems && constraints.enumItems.length > 0
    const hasNumericValue = isByte || isFloat || isInteger || isDouble || isLong || isShort

    const optionsForSelects =
        constraints?.enumItems?.map((item) => ({ label: item.description ? item.description : item.value, value: item.code })) ?? []

    const renderContent = () => {
        switch (true) {
            case hasEnumItems: {
                return (
                    <div className={style.rowItem}>
                        <MultiSelect
                            options={optionsForSelects}
                            id={`attribute-value-${index}`}
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            value={getCurrentMultiSelectValue(
                                Array.isArray(value.value) && value.value.length > 1 ? value.value : [value.value ? value.value.toString() : ''],
                                optionsForSelects,
                            )}
                            defaultValue={getCurrentMultiSelectValue(
                                Array.isArray(value.value) && value.value.length > 1 ? value.value : [value.value ? value.value.toString() : ''],
                                optionsForSelects,
                            )}
                            placeholder={t('customAttributeFilter.value.placeholderSelectMulti')}
                            onChange={(e) => onChange({ ...value, value: e.map((item) => item.value ?? '') })}
                        />
                    </div>
                )
            }

            case isDate: {
                //right now this returns 400
                //how to send date info I communicate with BE
                return (
                    <Input
                        className={style.rowItem}
                        id={`attribute-value-${index}-date`}
                        label={t('customAttributeFilter.value.label.date')}
                        name="atributeValueDate"
                        onChange={(e) => onChange({ ...value, value: e.target.value })}
                        type="date"
                    />
                )
            }

            case isBoolean: {
                return (
                    <div className={style.radioButtonDiv}>
                        <RadioButtonGroup inline>
                            <RadioButton
                                className={style.rowItem}
                                id={`attribute-value-${index}-yes`}
                                label={t('customAttributeFilter.value.labelYes')}
                                name="atributeValue"
                                value={RadioInputValue.TRUE}
                                checked={value.value === 'true'}
                                onChange={(e) => onChange({ ...value, value: e.target.value })}
                            />
                            <RadioButton
                                className={style.rowItem}
                                id={`attribute-value-${index}-no`}
                                label={t('customAttributeFilter.value.labelNo')}
                                name="atributeValue"
                                checked={value.value === 'false'}
                                value={RadioInputValue.FALSE}
                                onChange={(e) => onChange({ ...value, value: e.target.value })}
                            />
                        </RadioButtonGroup>
                    </div>
                )
            }
            default: {
                return (
                    <Input
                        className={style.rowItem}
                        id={`attribute-value-${index}`}
                        label={t('customAttributeFilter.value.label')}
                        placeholder={t('customAttributeFilter.value.placeholder')}
                        name="atributeValue"
                        value={hasNumericValue ? parseInt(value.value?.toString() ?? '') : value.value?.toString()}
                        onChange={(e) => onChange({ ...value, value: e.target.value })}
                        type={hasNumericValue ? 'number' : 'text'}
                        maxLength={isCharacter ? 1 : undefined}
                    />
                )
            }
        }
    }

    return <>{renderContent()}</>
}
