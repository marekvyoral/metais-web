import React, { DetailedHTMLProps, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'

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
        const aID = id ? id : uuidV4()
        const hintId = `${aID}-hint`
        const errorId = `${aID}-error`
        return (
            <fieldset
                aria-errormessage={errorId}
                className={classNames(className, styles.fieldset, 'govuk-form-group', { 'govuk-form-group--error': !!error })}
            >
                <legend className="govuk-label">{label}</legend>
                {hint && (
                    <span className="govuk-hint" id={hintId}>
                        {hint}
                    </span>
                )}
                {error && error.message && (
                    <span id={errorId} className="govuk-error-message">
                        {error.message}
                    </span>
                )}
                <RadioButtonGroup {...rest} inline={inline} aria-describedby={hint ? hintId : undefined} disabled={disabled} ref={ref}>
                    {children}
                </RadioButtonGroup>
            </fieldset>
        )
    },
)
