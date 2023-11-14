import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './infoIcon.module.scss'

import { InfoIcon } from '@isdd/idsk-ui-kit/assets/images'

interface IInfoIconWithTextProps extends PropsWithChildren {
    tooltip?: string
    hideIcon?: boolean
}

export const InfoIconWithText = forwardRef<HTMLDivElement, IInfoIconWithTextProps>(({ children, tooltip, hideIcon = false }, ref) => {
    return (
        <span className={classNames(styles.infoIconGroup)} ref={ref}>
            {!hideIcon && <img src={InfoIcon} className={classNames(styles.infoIcon)} alt="info-icon" title={tooltip} />}
            <span className={classNames(styles.infoText)}>{children}</span>
        </span>
    )
})
