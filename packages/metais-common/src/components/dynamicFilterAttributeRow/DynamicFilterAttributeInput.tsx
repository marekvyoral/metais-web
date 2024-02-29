import { Input, MultiSelect, RadioButton, RadioButtonGroup } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import styleDateInput from '@isdd/idsk-ui-kit/date-input/dateInput.module.scss'

import style from './customFilterAttribute.module.scss'

import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FilterAttribute, FilterAttributeValue } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { MetaInformationTypes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { formatDateForDefaultValue, hasCiType } from '@isdd/metais-common/componentHelpers'
import { CustomAttributeType } from '@isdd/metais-common/componentHelpers/filter/findAttributeType'
enum RadioInputValue {
    TRUE = 'true',
    FALSE = 'false',
}

interface Props {
    attributeType: CustomAttributeType
    index: number
    value: FilterAttribute
    customComponent?: (
        value: FilterAttribute,
        onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void,
    ) => React.ReactNode
    constraints: EnumType | undefined
    onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void
}

export const DynamicFilterAttributeInput: React.FC<Props> = ({ attributeType, index, value, onChange, constraints, customComponent }) => {
    const { t } = useTranslation()

    const isOwner = attributeType.type === MetaInformationTypes.OWNER
    const isState = attributeType.type === MetaInformationTypes.STATE
    const lastModified = attributeType.type === MetaInformationTypes.LAST_MODIFIED
    const createdAt = attributeType.type === MetaInformationTypes.CREATED_AT

    const isBoolean = attributeType.type === AttributeAttributeTypeEnum.BOOLEAN
    const isInteger = attributeType.type === AttributeAttributeTypeEnum.INTEGER
    const isDouble = attributeType.type === AttributeAttributeTypeEnum.DOUBLE
    const isFloat = attributeType.type === AttributeAttributeTypeEnum.FLOAT
    const isShort = attributeType.type === AttributeAttributeTypeEnum.SHORT
    const isLong = attributeType.type === AttributeAttributeTypeEnum.LONG
    const isByte = attributeType.type === AttributeAttributeTypeEnum.BYTE
    const isDate = attributeType.type === AttributeAttributeTypeEnum.DATE
    const isCharacter = attributeType.type === AttributeAttributeTypeEnum.CHARACTER

    const hasEnumItems = !!constraints?.code && constraints.enumItems && constraints.enumItems.length > 0
    const hasNumericValue = isByte || isFloat || isInteger || isDouble || isLong || isShort

    const isCMDBType = !!attributeType.cmdbConstraints?.type
    const ciTypeCMDB = attributeType.cmdbConstraints && hasCiType(attributeType.cmdbConstraints) ? attributeType.cmdbConstraints.ciType : ''

    const optionsForSelects =
        constraints?.enumItems?.map((item) => ({ label: item.description ? `${item.description}` : `${item.value}`, value: `${item.code}` })) ?? []

    const valueAsArray = (filterValue: FilterAttributeValue) => {
        return Array.isArray(filterValue) ? filterValue.map((val) => val.toString() ?? '') : [filterValue?.toString() ?? '']
    }

    const renderContent = () => {
        if (customComponent) {
            return (
                <div className={classNames(style.rowItem, style.lazySelect)}>
                    <>{customComponent(value, onChange)}</>
                </div>
            )
        }

        switch (true) {
            case isCMDBType: {
                return (
                    <div className={classNames(style.rowItem, style.lazySelect)}>
                        <SelectPOForFilter
                            isMulti
                            ciType={ciTypeCMDB}
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            valuesAsUuids={valueAsArray(value.value ?? '')}
                            onChange={(val) => onChange({ ...value, value: val?.map((v) => v?.uuid ?? '') })}
                        />
                    </div>
                )
            }
            case hasEnumItems: {
                return (
                    <div className={classNames(style.rowItem, style.lazySelect)}>
                        <MultiSelect
                            options={optionsForSelects}
                            id={`attribute-value-${index}`}
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            value={Array.isArray(value.value) && value.value.length > 1 ? value.value : [value.value ? value.value.toString() : '']}
                            defaultValue={
                                Array.isArray(value.value) && value.value.length > 1 ? value.value : [value.value ? value.value.toString() : '']
                            }
                            placeholder={t('customAttributeFilter.value.placeholderSelectMulti')}
                            onChange={(val) => onChange({ ...value, value: val })}
                        />
                    </div>
                )
            }

            case lastModified || createdAt || isDate: {
                return (
                    <div className={classNames('govuk-form-group', style.rowItem)}>
                        <label className="govuk-label" htmlFor={`attribute-value-${index}-date`}>
                            {t('customAttributeFilter.value.label')}
                        </label>
                        <DatePicker
                            wrapperClassName={style.fullWidth}
                            id={`attribute-value-${index}-date`}
                            className={classNames('govuk-input', style.rowItem)}
                            placeholderText="dd.mm.yyyy"
                            popperClassName={styleDateInput.dateInputPopperClass}
                            name="atributeValueDate"
                            selected={value.value ? new Date(value.value as string) : null}
                            onChange={(val) => onChange({ ...value, value: formatDateForDefaultValue(val?.toISOString() ?? '') })}
                            dateFormat="dd.MM.yyyy"
                        />
                    </div>
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

            case isOwner: {
                return (
                    <div className={classNames(style.rowItem, style.lazySelect)}>
                        <SelectPOForFilter
                            isMulti
                            ciType="PO"
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            valuesAsUuids={valueAsArray(value.value ?? '')}
                            onChange={(val) => onChange({ ...value, value: val?.map((v) => v?.uuid ?? '') })}
                        />
                    </div>
                )
            }

            case isState: {
                return (
                    <div className={classNames(style.rowItem, style.lazySelect)}>
                        <MultiSelect
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            options={[
                                { value: 'INVALIDATED', label: t('metaAttributes.state.INVALIDATED') },
                                { value: 'DRAFT', label: t('metaAttributes.state.DRAFT') },
                            ]}
                            value={valueAsArray(value.value ?? '')}
                            onChange={(val) => onChange({ ...value, value: val })}
                        />
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
