import React, { forwardRef } from 'react'
import { Control, Controller, FieldValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import { Languages } from '@isdd/metais-common/src/localization/languages'
import { sk, enUS as en } from 'date-fns/locale'
import classNames from 'classnames'
import { GreenCheckMarkIcon } from '@isdd/metais-common/src/assets/images'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import 'react-datepicker/dist/react-datepicker.css'
import { formatDateForDefaultValue } from '@isdd/metais-common'

import styles from './dateInput.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

registerLocale('sk', sk)
registerLocale('en', en)

export enum DateTypeEnum {
    DATE = 'date',
    DATETIME = 'datetime',
}

type Props = {
    handleDateChange?: (date: Date | null, name: string) => void
    name: string
    type?: DateTypeEnum
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<FieldValue<Record<string, any>>>
    label?: string
    hint?: string
    error?: string
    disabled?: boolean
    info?: string
    correct?: boolean
    className?: string
    inputClassName?: string
    hasInputIcon?: boolean
    maxLength?: number
    id?: string
    required?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    minDate?: Date
    maxDate?: Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>
}

export const DateInput = forwardRef<ReactDatePickerProps, Props>(
    ({
        name,
        type = DateTypeEnum.DATE,
        control,
        handleDateChange,
        label,
        disabled,
        hint,
        error,
        info,
        correct,
        className,
        inputClassName,
        hasInputIcon,
        id = `input_${uuidV4()}`,
        required,
        clearErrors,
        minDate,
        maxDate,
        setValue,
    }) => {
        const { t, i18n } = useTranslation()
        const hintId = `${id}-hint`
        const errorId = `${id}-error`

        const datePlaceholder = 'dd.mm.yyyy'
        const dateTimePlaceholder = 'dd.mm.yyyy hh:mm'

        const dateFormat = 'dd.MM.yyyy'
        const dateTimeFormat = 'dd.MM.yyyy HH:mm'

        const placeholder = type === DateTypeEnum.DATE ? datePlaceholder : dateTimePlaceholder
        const format = type === DateTypeEnum.DATE ? dateFormat : dateTimeFormat

        const showTimeSelect = type === DateTypeEnum.DATETIME

        const handleDefaultDateChange = (date: Date | null) => {
            setValue(name, date ? formatDateForDefaultValue(date.toISOString()) : null)
        }

        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    return (
                        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
                            <div className={styles.labelDiv}>
                                <label className="govuk-label" htmlFor={id}>
                                    {label} {required && t('input.requiredField')}
                                </label>
                                {info && <Tooltip altText={`Tooltip ${label}`} descriptionElement={<div className="tooltipWidth500">{info}</div>} />}
                            </div>

                            {hint && (
                                <span className="govuk-hint" id={hintId}>
                                    {hint}
                                </span>
                            )}
                            {error && (
                                <span id={errorId} className="govuk-error-message">
                                    {error}
                                </span>
                            )}
                            <div className={classNames(styles.inputWrapper, inputClassName)} style={{ position: 'relative' }}>
                                <DatePicker
                                    wrapperClassName={styles.fullWidth}
                                    className={classNames('govuk-input', { 'govuk-input--error': !!error })}
                                    placeholderText={placeholder}
                                    selected={field.value ? new Date(field.value) : null}
                                    popperClassName={styles.dateInputPopperClass}
                                    onChange={(date) => {
                                        date && clearErrors?.(name)
                                        handleDateChange ? handleDateChange(date, field.name) : handleDefaultDateChange(date)
                                    }}
                                    dateFormat={format}
                                    showTimeSelect={showTimeSelect}
                                    locale={i18n.language === Languages.SLOVAK ? Languages.SLOVAK : Languages.ENGLISH}
                                    timeCaption={t('input.time')}
                                    disabled={disabled}
                                    required={required}
                                    minDate={minDate}
                                    maxDate={maxDate ? maxDate : new Date('9999-12-31')}
                                    aria-describedby={hint ? hintId : undefined}
                                    aria-errormessage={errorId}
                                />
                                {correct && (
                                    <img
                                        src={GreenCheckMarkIcon}
                                        className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect}
                                        alt={t('correct')}
                                    />
                                )}
                            </div>
                        </div>
                    )
                }}
            />
        )
    },
)
