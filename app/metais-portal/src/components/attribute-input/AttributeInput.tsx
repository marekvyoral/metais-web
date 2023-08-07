import React from 'react'
import { useTranslation } from 'react-i18next'
import { Control, FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import classnames from 'classnames'
import { TextArea } from '@isdd/idsk-ui-kit/text-area/TextArea'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Input, SimpleSelect, MultiSelect } from '@isdd/idsk-ui-kit/index'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EnumItem, EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'

import { AttributesConfigTechNames, attClassNameConfig } from './attributeDisplaySettings'
import { ArrayAttributeInput } from './ArrayAttributeInput'
import styles from './attributeInput.module.scss'

enum ConstraintTypes {
    REGEX = 'regex',
    ENUM = 'enum',
    INTERVAL = 'interval',
}

enum MandatoryType {
    CRITICAL = 'critical',
}

enum DisplayTextArea {
    TEXTAREA = 'textarea',
}

interface IAttributeInput {
    attribute: Attribute
    register: UseFormRegister<FieldValues>
    control: Control
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
}

export const AttributeInput: React.FC<IAttributeInput> = ({
    attribute,
    trigger,
    setValue,
    register,
    control,
    error,
    constraints,
    hint,
    isSubmitted,
    unitsData,
}) => {
    const { t } = useTranslation()

    const hasUnits = !!attribute.units && !!unitsData
    const unitsLabel = hasUnits ? ' ' + t('createEntity.units', { units: unitsData.value }) : ''

    const isCorrect = !error && isSubmitted

    const isRequired = attribute.mandatory?.type === MandatoryType.CRITICAL
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

    const isEnum = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === ConstraintTypes.ENUM

    const hasNumericValue = isInteger || isDouble || isFloat || isByte || isLong || isShort
    const hasStringValue = isString || isCharacter

    const createOptions = (constraintItem: EnumType) => {
        const options =
            constraintItem?.enumItems?.map((item) => ({
                value: item.code ?? '',
                label: `${item.value} - ${item.description}` ?? '',
                disabled: !item.valid,
            })) ?? []

        return [{ label: t('createEntity.select'), value: '' }, ...options]
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
                    />
                )
            }
            case isDate: {
                return (
                    <Input
                        correct={isCorrect}
                        type="date"
                        info={attribute.description}
                        disabled={attribute.readOnly}
                        id={attribute.technicalName}
                        label={attribute.name + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                        hasInputIcon
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
                        disabled={attribute.readOnly}
                        label={attribute.name + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                    />
                )
            }
            case isBoolean: {
                return (
                    <CheckBox
                        label={attribute.name ?? ''}
                        error={error?.message?.toString()}
                        id={attribute.technicalName}
                        info={attribute.description}
                        disabled={attribute.readOnly}
                        {...register(attribute.technicalName)}
                        value="true"
                        containerClassName={styles.withInfoCheckbox}
                    />
                )
            }
            case isEnum: {
                if (constraints) {
                    if (attribute.array) {
                        return (
                            <MultiSelect
                                id={attribute.technicalName ?? ''}
                                name={attribute.technicalName ?? ''}
                                label={attribute.name + requiredLabel}
                                options={createOptions(constraints)}
                                control={control}
                            />
                        )
                    } else {
                        return (
                            <SimpleSelect
                                id={attribute.technicalName ?? ''}
                                label={attribute.name + requiredLabel}
                                error={error?.message?.toString()}
                                info={attribute.description}
                                correct={isCorrect}
                                options={createOptions(constraints)}
                                disabled={attribute.readOnly}
                                defaultValue={constraints.enumItems?.find((item) => item.code === attribute.defaultValue)?.description}
                                {...register(attribute.technicalName ?? '')}
                                hasInputIcon
                            />
                        )
                    }
                }
                return
            }

            case hasNumericValue: {
                return (
                    <Input
                        correct={isCorrect}
                        info={attribute.description}
                        id={attribute.technicalName}
                        disabled={attribute.readOnly}
                        label={attribute.name + requiredLabel + unitsLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        type="number"
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                        step={isDouble || isFloat ? 'any' : 1}
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
                        disabled={attribute.readOnly}
                        label={attribute.name + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                    />
                )
            }

            case hasStringValue: {
                return (
                    <Input
                        correct={isCorrect}
                        info={attribute.description}
                        className={classnames(attClassNameConfig.attributes[attribute.technicalName]?.className || '')}
                        id={attribute.technicalName}
                        disabled={attribute.technicalName === AttributesConfigTechNames.METAIS_CODE || attribute.readOnly}
                        label={attribute.name + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        type="text"
                        defaultValue={attribute.defaultValue}
                        hint={hint}
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
                        disabled={attribute.readOnly}
                        label={attribute.name + requiredLabel}
                        error={error?.message?.toString()}
                        {...register(attribute.technicalName)}
                        type="text"
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                    />
                )
            }
        }
    }
    return <>{renderContent()}</>
}
