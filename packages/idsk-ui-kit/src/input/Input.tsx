import * as React from 'react'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import classNames from 'classnames'

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string
    label?: string
    name: string
    hint?: string
    error?: FieldError
    disabled?: boolean
}
export const Input = forwardRef<HTMLInputElement, IInputProps>(({ id, label, name, hint, error, disabled, className, ...rest }, ref) => {
    const hintId = `${id}-hint`
    return (
        <div className={classNames(className, 'govuk-form-group', { 'govuk-form-group--error': !!error })}>
            <label className="govuk-label" htmlFor={id}>
                {label}
            </label>
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
            <input
                className={classNames('govuk-input', { 'govuk-input--error': !!error })}
                id={id}
                name={name}
                type="text"
                ref={ref}
                {...rest}
                aria-describedby={hint ? hintId : undefined}
                disabled={disabled}
            />
        </div>
    )
})
