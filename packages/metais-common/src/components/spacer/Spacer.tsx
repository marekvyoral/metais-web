import classNames from 'classnames'
import React from 'react'

import styles from './spacer.module.scss'

interface ISpacer {
    vertical?: boolean
    horizontal?: boolean
}
export const Spacer: React.FC<ISpacer> = ({ vertical, horizontal }) => {
    return (
        <div
            className={classNames({
                [styles.defaultSpaceHorizontal]: horizontal,
                [styles.defaultSpaceVertical]: vertical,
            })}
        />
    )
}
