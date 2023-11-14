import { Button, Input } from '@isdd/idsk-ui-kit/index'
import { TextArea } from '@isdd/idsk-ui-kit/text-area/TextArea'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CloseIcon, PlusIcon } from '@isdd/metais-common/assets/images'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './attributeInput.module.scss'

import { HasResetState } from '@/components/create-entity/CreateCiEntityForm'

interface IArrayAttributeInput {
    attribute: Attribute
    error: FieldError | Merge<FieldError, FieldErrorsImpl> | undefined
    isTextarea: boolean
    isCorrect: boolean
    isSubmitted: boolean
    requiredLabel: string
    register: UseFormRegister<FieldValues>
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
    defaultValue: string[]
    hasResetState: HasResetState
    disabled?: boolean
    nameSufix: string
}

export const ArrayAttributeInput: React.FC<IArrayAttributeInput> = ({
    attribute,
    setValue,
    isTextarea,
    isCorrect,
    isSubmitted,
    error,
    requiredLabel,
    trigger,
    defaultValue,
    hasResetState,
    disabled,
    nameSufix,
}) => {
    const { t } = useTranslation()
    const [inputList, setInputList] = useState<string[]>(defaultValue)

    const info = attribute.description
    const id = attribute.technicalName ?? '' + nameSufix
    const name = attribute.name
    const isInteger = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.INTEGER

    useEffect(() => {
        if (hasResetState.hasReset) {
            setInputList(defaultValue)
            hasResetState.setHasReset(false)
        }
    }, [defaultValue, hasResetState.hasReset, hasResetState])

    useEffect(() => {
        setValue(id, inputList)
        if (isSubmitted) {
            trigger(id)
        }
    }, [id, inputList, isSubmitted, setValue, trigger])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value
        setInputList((prev) => [...prev.slice(0, index), value, ...prev.slice(index + 1)])
    }

    const handleDeleteInput = (index: number) => {
        setInputList((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
    }

    const getArrayInputError = (index: number) => {
        if (Array.isArray(error)) {
            return error[index]?.message?.toString() ?? ''
        }
        return ''
    }

    return (
        <fieldset className={styles.fieldset}>
            <legend className="govuk-label">{name + requiredLabel}</legend>
            <div className={classNames('govuk-form-group', styles.formGroup)}>
                <div className={styles.infoDiv}>{info && <Tooltip descriptionElement={info} />}</div>
                <div className={styles.buttonDiv}>
                    <Button
                        disabled={attribute.readOnly || disabled}
                        label={
                            <div className={styles.buttonWithIcon}>
                                <img className={styles.iconAddItems} src={PlusIcon} />
                                {t('createEntity.addNewRow')}
                            </div>
                        }
                        onClick={() => setInputList((prev) => [...prev, ''])}
                    />
                    {info && <Tooltip descriptionElement={info} />}
                </div>
            </div>

            {inputList.map((value, index) => (
                <React.Fragment key={index}>
                    {isTextarea && (
                        <div className={styles.inputWithCloseIconDivTextarea}>
                            <img src={CloseIcon} onClick={() => handleDeleteInput(index)} />
                            <TextArea
                                name={`${id}${index}`}
                                rows={3}
                                correct={isCorrect}
                                id={`${id}${index}`}
                                label={name + ' (' + (index + 1) + ') ' + requiredLabel}
                                error={getArrayInputError(index)}
                                onChange={(e) => handleInputChange(e, index)}
                                defaultValue={value}
                                disabled={disabled}
                            />
                        </div>
                    )}
                    {!isTextarea && (
                        <div className={styles.inputWithCloseIconDivInput}>
                            <img src={CloseIcon} onClick={() => handleDeleteInput(index)} />
                            <Input
                                name={`${id}${index}`}
                                correct={isCorrect}
                                label={name + '(' + (index + 1) + ')' + requiredLabel}
                                error={getArrayInputError(index)}
                                id={`${id}${index}`}
                                type={isInteger ? 'number' : 'text'}
                                onChange={(e) => handleInputChange(e, index)}
                                defaultValue={value}
                                disabled={disabled}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </fieldset>
    )
}
