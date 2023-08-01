import React from 'react'
import { useTranslation } from 'react-i18next'
import { Control, FieldValues, UseFormRegister } from 'react-hook-form'
import classnames from 'classnames'
import { TextArea } from '@isdd/idsk-ui-kit/text-area/TextArea'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Input, SimpleSelect, MultiSelect } from '@isdd/idsk-ui-kit'
import { Attribute, AttributeAttributeTypeEnum, EnumType } from '@isdd/metais-common/api'

import { AttributesConfigTechNames, attClassNameConfig } from './attributeDisplaySettings'

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
    constraints?: EnumType
    error: string
    hint?: string
    isSubmitted: boolean
    unitsData?: EnumType
    control?: Control
}

export const AttributeInput: React.FC<IAttributeInput> = ({ attribute, register, error, constraints, hint, isSubmitted, control }) => {
    const { t } = useTranslation()
    //needs to be implemented with InputWithIcon component to show icon or string based on units
    //const hasUnits = !!attribute.units && !!unitsData
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

    const isEnum = attribute?.constraints && attribute.constraints.length > 0 && attribute?.constraints[0].type === ConstraintTypes.ENUM

    const hasNumericValue = isInteger || isDouble || isFloat || isByte || isLong || isShort
    const hasStringValue = isString || isCharacter

    const createOptions = (constraintItem: EnumType) => {
        const options =
            constraintItem?.enumItems?.map((item) => ({
                value: item.value ?? '',
                label: `${item.value} - ${item.description}` ?? '',
                disabled: !item.valid,
            })) ?? []

        return [{ label: t('createEntity.select'), value: '' }, ...options]
    }

    const renderContent = () => {
        if (attribute.technicalName == null) return <></>
        switch (true) {
            case isDate: {
                return (
                    <Input
                        correct={isCorrect}
                        type="date"
                        info={attribute.description}
                        disabled={attribute.readOnly}
                        id={attribute.technicalName}
                        label={attribute.name + requiredLabel}
                        error={error}
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
                        error={error}
                        {...register(attribute.technicalName)}
                        defaultValue={attribute.defaultValue}
                        hint={hint}
                    />
                )
            }
            case isBoolean: {
                return (
                    <CheckBox
                        label={attribute.name + requiredLabel}
                        error={error}
                        id={attribute.technicalName}
                        info={attribute.description}
                        disabled={attribute.readOnly}
                        {...register(attribute.technicalName)}
                        value="true"
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
                                error={error}
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
                        label={attribute.name + requiredLabel}
                        error={error}
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
                        error={error}
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
                        error={error}
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
                        error={error}
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
