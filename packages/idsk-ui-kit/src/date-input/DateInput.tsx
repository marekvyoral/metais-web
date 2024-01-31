import React from 'react'
import { Control, Controller, FieldValue, UseFormClearErrors } from 'react-hook-form'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Languages } from '@isdd/metais-common/src/localization/languages'
import { sk, enUS as en } from 'date-fns/locale'
import classNames from 'classnames'
import { GreenCheckMarkIcon } from '@isdd/metais-common/src/assets/images'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import 'react-datepicker/dist/react-datepicker.css'

import styles from './dateInput.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

registerLocale('sk', sk)
registerLocale('en', en)

type Props = {
    handleDateChange: (date: Date | null, name: string) => void
    name: string
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
}

export const DateInput: React.FC<Props> = ({
    name,
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
}) => {
    const { t, i18n } = useTranslation()
    const hintId = `${id}-hint`

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
                            <>
                                <span className="govuk-error-message">{error}</span>
                            </>
                        )}
                        <div className={classNames(styles.inputWrapper, inputClassName)} style={{ position: 'relative' }}>
                            <DatePicker
                                wrapperClassName={styles.fullWidth}
                                className={classNames('govuk-input', { 'govuk-input--error': !!error })}
                                placeholderText="dd.mm.yyyy"
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => {
                                    date && clearErrors?.(name)
                                    handleDateChange(date, field.name)
                                }}
                                dateFormat="dd.MM.yyyy"
                                locale={i18n.language === Languages.SLOVAK ? Languages.SLOVAK : Languages.ENGLISH}
                                disabled={disabled}
                                required={required}
                                maxDate={new Date('9999-12-31')}
                            />
                            {correct && <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} />}
                        </div>
                    </div>
                )
            }}
        />
    )
}
