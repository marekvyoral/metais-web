import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface ICheckBoxProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string
    name: string
    value?: string
    disabled?: boolean
    labelClassName?: string
    containerClassName?: string
    error?: string
    info?: string
    title?: string
}

export const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(
    ({ id, label, error, name, disabled, value, info, title, labelClassName, containerClassName, className, ...rest }, ref) => {
        return (
            <div className={classNames({ 'govuk-form-group--error': !!error })}>
                {error && (
                    <>
                        <span className="govuk-error-message">{error}</span>
                    </>
                )}
                <div className={classNames('govuk-checkboxes__item', containerClassName)}>
                    <div>
                        <input
                            className={classNames('govuk-checkboxes__input', className)}
                            id={id}
                            name={name}
                            type="checkbox"
                            value={value}
                            disabled={disabled}
                            ref={ref}
                            {...rest}
                            title={title}
                        />

                        {label ? (
                            <label className={classNames('govuk-label govuk-checkboxes__label', labelClassName)} htmlFor={id}>
                                {label}
                            </label>
                        ) : (
                            <span className={classNames('govuk-label govuk-checkboxes__label', labelClassName)}>{label}</span>
                        )}
                    </div>
                    {info && <Tooltip descriptionElement={info} altText={`Tooltip ${label}`} />}
                </div>
            </div>
        )
    },
)
