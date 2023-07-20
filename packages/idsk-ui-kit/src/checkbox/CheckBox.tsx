import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

import { InfoInputIcon } from '../info-input-icon/InfoInputIcon'

interface ICheckBoxProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string
    name: string
    value: string
    disabled?: boolean
    labelClassName?: string
    containerClassName?: string
    error?: string
    info?: string
}

export const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(
    ({ id, label, error, name, disabled, value, info, labelClassName, containerClassName, className, ...rest }, ref) => {
        return (
            <div className={classNames({ 'govuk-form-group--error': !!error })}>
                {error && (
                    <>
                        <span className="govuk-error-message">{error}</span>
                    </>
                )}
                <div className={classNames('govuk-checkboxes__item', containerClassName)}>
                    <input
                        className={classNames('govuk-checkboxes__input', className)}
                        id={id}
                        name={name}
                        type="checkbox"
                        value={value}
                        disabled={disabled}
                        ref={ref}
                        {...rest}
                    />

                    <label className={classNames('govuk-label govuk-checkboxes__label', labelClassName)} htmlFor={id}>
                        {label}
                    </label>
                    {info && <InfoInputIcon description={info} id={id} />}
                </div>
            </div>
        )
    },
)
