import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './infoIcon.module.scss'

import { InfoIcon } from '@isdd/idsk-ui-kit/assets/images'

interface IInfoIconWithTextProps extends PropsWithChildren {
    tooltip?: string
}

export const InfoIconWithText = forwardRef<HTMLDivElement, IInfoIconWithTextProps>(({ children, tooltip }, ref) => {
    return (
        <div className={classNames(styles.infoIconGroup)} ref={ref}>
            <img src={InfoIcon} className={classNames(styles.infoIcon)} alt="info-icon" title={tooltip} />
            <strong className={classNames(styles.infoText)}>{children}</strong>
        </div>
    )
})
