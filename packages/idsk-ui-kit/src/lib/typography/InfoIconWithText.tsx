import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './infoIcon.module.scss'

interface IInfoIconWithTextProps extends PropsWithChildren {
    assistive?: string
}

export const InfoIconWithText = forwardRef<HTMLDivElement, IInfoIconWithTextProps>(({ children, assistive }, ref) => {
    return (
        <div className={classNames('govuk-warning-text', [styles.infoIconGroup])} ref={ref}>
            <span className={classNames('govuk-warning-text__icon', [styles.infoIcon])} aria-hidden="true">
                i
            </span>
            <strong className={classNames('govuk-warning-text__text', [styles.infoText])}>
                <span className="govuk-warning-text__assistive">{assistive}</span>
                {children}
            </strong>
        </div>
    )
})
