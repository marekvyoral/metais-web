import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

interface IRadioButtonGroupProps extends PropsWithChildren {
    inline?: boolean
    disabled?: boolean
}

export const RadioButtonGroup = forwardRef<HTMLDivElement, IRadioButtonGroupProps>(({ children, disabled, inline }, ref) => {
    return (
        <div ref={ref} aria-disabled={disabled} className={classNames('govuk-radios', { 'govuk-radios--inline': !!inline })}>
            {children}
        </div>
    )
})
