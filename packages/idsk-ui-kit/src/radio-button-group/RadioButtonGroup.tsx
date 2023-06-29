import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

interface IRadioButtonGroupProps extends PropsWithChildren {
    inline?: boolean
}

export const RadioButtonGroup = forwardRef<HTMLDivElement, IRadioButtonGroupProps>(({ children, inline }, ref) => {
    return (
        <div ref={ref} className={classNames('govuk-radios', { 'govuk-radios--inline': !!inline })}>
            {children}
        </div>
    )
})
