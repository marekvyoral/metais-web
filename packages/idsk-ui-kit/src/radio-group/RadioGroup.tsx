import React, { DetailedHTMLProps, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
import { useTranslation } from 'react-i18next'

import styles from './radioGroup.module.scss'

interface IRadioWithLabelProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string
    label?: string
    hint?: string
    error?: FieldError
    disabled?: boolean
    inline?: boolean
    small?: boolean
}
export const RadioGroup = forwardRef<HTMLDivElement, IRadioWithLabelProps>(
    ({ children, id, label, hint, error, disabled, className, inline, small, ...rest }, ref) => {
        const { t } = useTranslation()
        const aID = id ? id : uuidV4()
        const hintId = `${aID}-hint`
        const errorId = `${aID}-error`
        return (
            <fieldset
                aria-errormessage={errorId}
                aria-describedby={`${hintId} ${errorId}`}
                aria-invalid={!!(error && error.message)}
                className={classNames(className, styles.fieldset, 'govuk-form-group', { 'govuk-form-group--error': !!error })}
            >
                {label && <legend className="govuk-label">{label}</legend>}
                <span id={hintId} className={classNames({ 'govuk-visually-hidden': !hint, 'govuk-hint': !!hint })}>
                    {hint}
                </span>

                <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                    {error && error.message && (
                        <>
                            <span className="govuk-visually-hidden">{t('error')}</span>
                            {error?.message}
                        </>
                    )}
                </span>

                <div
                    ref={ref}
                    aria-describedby={hint ? hintId : undefined}
                    aria-disabled={disabled}
                    className={classNames('govuk-radios', { 'govuk-radios--inline': inline, 'govuk-radios--small': small })}
                    {...rest}
                >
                    {children}
                </div>
            </fieldset>
        )
    },
)
