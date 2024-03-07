import React, { DetailedHTMLProps, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
import { useTranslation } from 'react-i18next'

import styles from './radioGroupWithLabel.module.scss'

import { RadioButtonGroup } from '@isdd/idsk-ui-kit/radio-button-group/RadioButtonGroup'

interface IRadioWithLabelProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string
    label?: string
    hint?: string
    error?: FieldError
    disabled?: boolean
    inline?: boolean
}
export const RadioGroupWithLabel = forwardRef<HTMLDivElement, IRadioWithLabelProps>(
    ({ children, id, label, hint, error, disabled, className, inline, ...rest }, ref) => {
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
                <legend className="govuk-label">{label}</legend>
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

                <RadioButtonGroup {...rest} inline={inline} aria-describedby={hint ? hintId : undefined} disabled={disabled} ref={ref}>
                    {children}
                </RadioButtonGroup>
            </fieldset>
        )
    },
)
