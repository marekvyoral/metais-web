import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './iconWithText.module.scss'

interface IconWithTextProps extends PropsWithChildren {
    icon: string
    className?: string
}
export const IconWithText: React.FC<IconWithTextProps> = ({ children, icon, className }) => {
    return (
        <div className={classNames(className, styles.container, 'govuk-body')}>
            {<img src={icon} />}
            {children}
        </div>
    )
}
