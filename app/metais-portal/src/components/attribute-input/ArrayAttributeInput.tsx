import { Button, Input } from '@isdd/idsk-ui-kit/index'
import { TextArea } from '@isdd/idsk-ui-kit/text-area/TextArea'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api'
import { CloseIcon, PlusIcon } from '@isdd/metais-common/assets/images'
import React, { useEffect, useState } from 'react'
import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { InfoInputIcon } from '@isdd/idsk-ui-kit/info-input-icon/InfoInputIcon'

import styles from './attributeInput.module.scss'

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
}) => {
    const { t } = useTranslation()
    const [inputList, setInputList] = useState<string[]>([])

    const info = attribute.description
    const id = attribute.technicalName ?? ''
    const name = attribute.name
    const isInteger = attribute.attributeTypeEnum === AttributeAttributeTypeEnum.INTEGER

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
                <div className={styles.infoDiv}>{info && <InfoInputIcon description={info} id={id} />}</div>
                <div className={styles.buttonDiv}>
                    <Button
                        disabled={attribute.readOnly}
                        label={
                            <div className={styles.buttonWithIcon}>
                                <img className={styles.iconAddItems} src={PlusIcon} />
                                {t('createEntity.addNewRow')}
                            </div>
                        }
                        onClick={() => setInputList((prev) => [...prev, ''])}
                    />
                    {info && <InfoInputIcon description={info} id={id} />}
                </div>
            </div>

            {inputList.map((_, index) => (
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
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </fieldset>
    )
}