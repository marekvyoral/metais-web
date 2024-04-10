import { decodeHtmlEntities } from '@isdd/metais-common/src/utils/utils'
import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

import styles from './radioButton.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IRadioButtonProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    name: string
    value: string | number
    disabled?: boolean
    className?: string
    label: string
    info?: string
}

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(({ id, label, name, disabled, value, className, info, ...rest }, ref) => {
    return (
        <div className={classNames('govuk-radios__item', styles.labelDiv, className)}>
            <input className="govuk-radios__input" id={id} name={name} type="radio" value={value} disabled={disabled} ref={ref} {...rest} />
            <label className="govuk-label govuk-radios__label" htmlFor={id}>
                {label}
            </label>
            {info && <Tooltip descriptionElement={<div className="tooltipWidth500">{decodeHtmlEntities(info)}</div>} altText={`Tooltip ${label}`} />}
        </div>
    )
})
