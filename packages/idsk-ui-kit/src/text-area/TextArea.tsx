import classNames from 'classnames'
import React, { forwardRef, DetailedHTMLProps } from 'react'
import { useTranslation } from 'react-i18next'

import styles from '../styles/InfoAndCheckInput.module.scss'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IInputProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    id?: string
    label?: string
    name: string
    rows: number
    hint?: string
    error?: string
    disabled?: boolean
    info?: string
    correct?: boolean
    wrapperClassname?: string
    hasInputIcon?: boolean
    required?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, IInputProps>(
    ({ id, label, name, rows, hint, info, error, disabled, correct, wrapperClassname, hasInputIcon = false, required, ...rest }, ref) => {
        const hintId = `${id}-hint`
        const errorId = `${id}-error`
        const { t } = useTranslation()
        return (
            <div className={classNames('govuk-form-group', wrapperClassname, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id}>
                        {label} {required && t('input.requiredField')}
                    </label>
                    {info && <Tooltip altText={`Tooltip ${label}`} descriptionElement={<div className="tooltipWidth500">{info}</div>} />}
                </div>
                <span id={hintId} className={classNames({ 'govuk-visually-hidden': !hint, 'govuk-hint': !!hint })}>
                    {hint}
                </span>

                <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                    {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                    {error}
                </span>
                <div className={styles.inputWrapper}>
                    <textarea
                        className={classNames('govuk-textarea', { ' govuk-textarea--error': !!error })}
                        id={id}
                        name={name}
                        rows={rows}
                        ref={ref}
                        {...rest}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={`${hintId} ${errorId}`}
                        aria-errormessage={errorId}
                        required={required}
                    />
                    {correct && (
                        <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />
                    )}
                </div>
            </div>
        )
    },
)
