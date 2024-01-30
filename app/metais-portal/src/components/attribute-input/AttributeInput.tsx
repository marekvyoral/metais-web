import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Input, MultiSelect, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { TextArea } from '@isdd/idsk-ui-kit/text-area/TextArea'
import { EnumItem, EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute, AttributeAttributeTypeEnum, AttributeConstraintRegexAllOf } from '@isdd/metais-common/api/generated/types-repo-swagger'
import classnames from 'classnames'
import React from 'react'
import {
    Control,
    Controller,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
    UseFormClearErrors,
    UseFormRegister,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, formatDateForDefaultValue } from '@isdd/metais-common/index'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { HTML_TYPE, MAX_TITLE_LENGTH } from '@isdd/metais-common/constants'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { isConstraintCiType } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { formatNumberWithSpaces, isFalsyStringValue } from '@isdd/metais-common/utils/utils'
import { Languages } from '@isdd/metais-common/localization/languages'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { ArrayAttributeInput } from './ArrayAttributeInput'
import { AttributesConfigTechNames, attClassNameConfig } from './attributeDisplaySettings'
import { getDefaultArrayValue, getDefaultValue } from './attributeInputHelpers'

import { HasResetState } from '@/components/create-entity/CreateCiEntityForm'

enum ConstraintTypes {
    REGEX = 'regex',
    ENUM = 'enum',
    INTERVAL = 'interval',
    CI_TYPE = 'ciType',
}

enum MandatoryType {
    CRITICAL = 'critical',
}

enum DisplayTextArea {
    TEXTAREA = 'textarea',
}

interface IAttributeInput {
    nameSufix?: string
    attribute: Attribute
    register: UseFormRegister<FieldValues>
    clearErrors: UseFormClearErrors<FieldValues>
    constraints?: EnumType
    error: FieldError | Merge<FieldError, FieldErrorsImpl> | undefined
    hint?: string
    isSubmitted: boolean
    unitsData?: EnumItem
    setValue: UseFormSetValue<FieldValues>
    trigger: UseFormTrigger<{
        [x: string]:
            | string
            | number
            | boolean
            | Date
            | unknown
            | (string | undefined)[]
            | {
                  label?: string | undefined
                  value?: string | undefined
              }[]
            | null
            | undefined
    }>
    defaultValueFromCiItem?: string | boolean | string[] | number
    hasResetState: HasResetState
    disabled?: boolean
    isUpdate?: boolean
    control: Control
}

export const AttributeInput: React.FC<IAttributeInput> = ({
    attribute,
    trigger,
    setValue,
    register,
    error,
    constraints,
    hint,
    isSubmitted,
    unitsData,
    defaultValueFromCiItem,
    hasResetState,
    clearErrors,
    disabled,
    nameSufix = '',
    isUpdate,
    control,
}) => {
    const { t, i18n } = useTranslation()

    const hasUnits = !!attribute.units && !!unitsData
    const unitsLabel = hasUnits ? ' ' + t('createEntity.units', { units: unitsData.value }) : ''

    const isCorrect = !error && isSubmitted

    const isRequired = attribute.mandatory?.type === MandatoryType.CRITICAL && !attribute.readOnly
    const requiredText = ` (${t('createEntity.required')})`
    const requiredLabel = `${isRequired ? requiredText : ''}`

    const isString = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.STRING
    const isTextarea = attribute.displayAs === DisplayTextArea.TEXTAREA
    const isCharacter = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.CHARACTER
    const isInteger = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.INTEGER
    const isDouble = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.DOUBLE
    const isByte = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.BYTE
    const isShort = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.SHORT
    const isLong = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.LONG
    const isFloat = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.FLOAT
    const isDate = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.DATE
    const isBoolean = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.BOOLEAN
    const isFile = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.IMAGE

    const isArray = attribute.array
    const isHTML = attribute.type === HTML_TYPE

    const isEnum = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === ConstraintTypes.ENUM

    const isCiTypeConstraint =
        attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === ConstraintTypes.CI_TYPE
    const ciType = isConstraintCiType(attribute?.constraints?.[0]) ? attribute?.constraints?.[0].ciType ?? '' : ''

    const isRegex = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === ConstraintTypes.REGEX
    const hasNumericValue = isInteger || isDouble || isFloat || isByte || isLong || isShort
    const hasStringValue = isString || isCharacter

    const createOptions = (constraintItem: EnumType) => {
        const options =
            constraintItem?.enumItems?.map((item) => ({
                value: item.code ?? '',
                label: `${item.value} - ${item.description}`,
                disabled: !item.valid,
            })) ?? []
        return options
    }

    const createDefaultValuesForMulti = (constraintItem: EnumType, values: string[]) => {
        const options = values.map((value) => {
            const foundItem = constraintItem.enumItems?.find((item) => item.code == value)
            return foundItem?.code ?? ''
        })
        return options
    }

    const getDefaultValueForSimple = (constraintItem: EnumType, value: string) => {
        const defaultValue = constraintItem.enumItems?.find((item) => item.code === value)?.code

        return defaultValue
    }
    const renderContent = () => {
        if (attribute.technicalName == null) return <></>
        switch (true) {
            case isArray && !isEnum: {
                return (
                    <ArrayAttributeInput
                        isSubmitted={isSubmitted}
                        register={register}
                        attribute={attribute}
                        error={error}
                        isCorrect={isCorrect}
                        isTextarea={isTextarea}
                        requiredLabel={requiredLabel}
                        setValue={setValue}
                        trigger={trigger}
                        defaultValue={getDefaultArrayValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                        hasResetState={hasResetState}
                        disabled={disabled}
                        nameSufix={nameSufix}
                    />
                )
            }
            case isDate: {
                const handleDateChange = (date: Date | null, name: string) => {
                    setValue(name, date ? formatDateForDefaultValue(date.toISOString()) : null)
                }

                return (
                    <DateInput
                        handleDateChange={handleDateChange}
                        name={attribute.technicalName + nameSufix}
                        control={control}
                        correct={isCorrect}
                        info={attribute.description}
                        id={attribute.technicalName}
                        clearErrors={clearErrors}
                        disabled={attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        hint={hint}
                    />
                )
            }
            case isFile: {
                return (
                    <Input
                        isUpload
                        correct={isCorrect}
                        type="file"
                        info={attribute.description}
                        id={attribute.technicalName}
                        disabled={attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName + nameSufix)}
                        hint={defaultValueFromCiItem?.toString()}
                    />
                )
            }
            case isBoolean: {
                return (
                    <div className="govuk-form-group">
                        <Controller
                            name={attribute.technicalName + nameSufix}
                            control={control}
                            render={({ field: { onChange, value, name } }) => {
                                return (
                                    <CheckBox
                                        name={name}
                                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` ?? ''}
                                        error={error?.message?.toString()}
                                        id={attribute.technicalName ?? ''}
                                        info={attribute.description}
                                        disabled={attribute.readOnly || disabled}
                                        checked={isFalsyStringValue(value) ? false : value}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                )
            }
            case isCiTypeConstraint && !!ciType: {
                return (
                    <CiLazySelect
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` ?? '' + requiredLabel}
                        name={attribute.technicalName ?? '' + nameSufix}
                        ciType={ciType}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        error={error?.message?.toString()}
                        disabled={attribute.readOnly || disabled}
                        info={attribute.description}
                        defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem)}
                        metaAttributes={{ state: ['DRAFT'] }}
                    />
                )
            }
            case isEnum: {
                if (constraints) {
                    if (attribute.array) {
                        return (
                            <MultiSelect
                                id={attribute.technicalName ?? ''}
                                name={attribute.technicalName ?? '' + nameSufix}
                                label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` ?? '' + requiredLabel}
                                correct={isCorrect}
                                options={createOptions(constraints)}
                                setValue={setValue}
                                clearErrors={clearErrors}
                                disabled={disabled}
                                placeholder={t('createEntity.select')}
                                defaultValue={createDefaultValuesForMulti(
                                    constraints,
                                    getDefaultArrayValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate),
                                )}
                                menuPosition="absolute"
                            />
                        )
                    } else {
                        return (
                            <SimpleSelect
                                id={attribute.technicalName ?? ''}
                                label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` ?? '' + requiredLabel}
                                error={error?.message?.toString()}
                                info={attribute.description}
                                correct={isCorrect}
                                options={createOptions(constraints)}
                                disabled={attribute.readOnly || disabled}
                                defaultValue={getDefaultValueForSimple(
                                    constraints,
                                    getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate),
                                )}
                                name={attribute.technicalName + nameSufix}
                                setValue={setValue}
                                clearErrors={clearErrors}
                                placeholder={t('createEntity.select')}
                                menuPosition="absolute"
                            />
                        )
                    }
                }
                return
            }

            case isRegex: {
                const regexConstraints = attribute?.constraints?.[0] as AttributeConstraintRegexAllOf
                return (
                    <Input
                        correct={isCorrect}
                        info={t('validation.wrongRegex', { regexFormat: regexConstraints.regex })}
                        className={classnames(attClassNameConfig.attributes[attribute.technicalName]?.className || '')}
                        id={attribute.technicalName}
                        disabled={attribute.technicalName === AttributesConfigTechNames.METAIS_CODE || attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName + nameSufix)}
                        type="text"
                        defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                        hint={hint}
                    />
                )
            }

            case hasNumericValue: {
                return (
                    <Controller
                        control={control}
                        name={attribute.technicalName + nameSufix}
                        render={({ field: { onChange, value, ref } }) => (
                            <Input
                                name={attribute.technicalName + nameSufix}
                                ref={ref}
                                value={formatNumberWithSpaces(value)}
                                onChange={(e) => {
                                    const formattedValue = e.target.value.replace(/[^\d]/g, '').replace(/\s/g, '')
                                    onChange(formattedValue)
                                }}
                                hint={hint}
                                step={isDouble || isFloat ? 'any' : 1}
                                correct={isCorrect}
                                info={attribute.description}
                                id={attribute.technicalName}
                                disabled={attribute.readOnly || disabled}
                                label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel + unitsLabel}
                                error={error?.message?.toString()}
                            />
                        )}
                    />
                )
            }

            case isHTML: {
                return (
                    <Controller
                        name={attribute.technicalName + nameSufix}
                        control={control}
                        render={({ field }) => {
                            return (
                                <RichTextQuill
                                    id={attribute.technicalName ?? ''}
                                    label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                                    error={error?.message?.toString()}
                                    info={attribute.description}
                                    readOnly={attribute.readOnly || disabled}
                                    defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                                    {...field}
                                />
                            )
                        }}
                    />
                )
            }

            case isTextarea: {
                return (
                    <TextArea
                        rows={3}
                        info={attribute.description}
                        correct={isCorrect}
                        id={attribute.technicalName}
                        disabled={attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName + nameSufix)}
                        defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                        hint={hint}
                    />
                )
            }

            case hasStringValue: {
                const isGenProfilNazov = attribute.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov

                return (
                    <Input
                        correct={isCorrect}
                        info={attribute.description}
                        className={classnames(attClassNameConfig.attributes[attribute.technicalName]?.className || '')}
                        id={attribute.technicalName}
                        disabled={attribute.technicalName === AttributesConfigTechNames.METAIS_CODE || attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName + nameSufix)}
                        type="text"
                        defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                        hint={hint}
                        maxLength={isGenProfilNazov ? MAX_TITLE_LENGTH : undefined}
                    />
                )
            }

            default: {
                // eslint-disable-next-line no-console
                console.warn('missing attribute input for: ' + attribute.technicalName)
                return (
                    <Input
                        correct={isCorrect}
                        info={attribute.description}
                        id={attribute.technicalName}
                        disabled={attribute.readOnly || disabled}
                        label={`${i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}` + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName + nameSufix)}
                        type="text"
                        defaultValue={getDefaultValue(attribute.defaultValue ?? '', defaultValueFromCiItem, isUpdate)}
                        hint={hint}
                    />
                )
            }
        }
    }
    return <>{renderContent()}</>
}
