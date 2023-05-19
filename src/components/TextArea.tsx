import classNames from 'classnames'
import * as React from 'react'
import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    id: string
    label?: string
    name: string
    rows: number
    hint?: string
    error?: FieldError
    disabled?: boolean
}
export const TextArea = forwardRef<HTMLTextAreaElement, IInputProps>(({ id, label, name, rows, hint, error, disabled, ...rest }, ref) => {
    const hintId = `${id}-hint`
    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': !!error })}>
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

            <textarea
                className={classNames('govuk-textarea', { ' govuk-textarea--error': !!error })}
                id={id}
                name={name}
                rows={rows}
                ref={ref}
                {...rest}
                disabled={disabled}
            />
        </div>
    )
})
