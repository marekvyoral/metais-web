import React, { DetailedHTMLProps, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import classNames from 'classnames'

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
        const hintId = `${id}-hint`
        return (
            <div className={classNames(className, 'govuk-form-group', { 'govuk-form-group--error': !!error })}>
                <label className="govuk-label">{label}</label>
                {hint && (
                    <span className="govuk-hint" id={hintId}>
                        {hint}
                    </span>
                )}
                {error && error.message && (
                    <>
                        <span className="govuk-error-message">{error.message}</span>
                    </>
                )}
                <RadioButtonGroup {...rest} inline={inline} aria-describedby={hint ? hintId : undefined} disabled={disabled} ref={ref}>
                    {children}
                </RadioButtonGroup>
            </div>
        )
    },
)
