import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from '@isdd/idsk-ui-kit/radio-with-label/radioGroupWithLabel.module.scss'

interface IRadioButtonGroupProps extends PropsWithChildren {
    inline?: boolean
    disabled?: boolean
}

export const RadioButtonGroup = forwardRef<HTMLDivElement, IRadioButtonGroupProps>(({ children, disabled, inline }, ref) => {
    return (
        <div ref={ref} aria-disabled={disabled} className={classNames('govuk-radios', { 'govuk-radios--inline': !!inline })}>
            <fieldset className={classNames(styles.fieldset, 'govuk-form-group')}>{children}</fieldset>
        </div>
    )
})
