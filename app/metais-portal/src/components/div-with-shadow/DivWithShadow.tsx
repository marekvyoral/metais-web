import classNames from 'classnames'
import React from 'react'

import styles from './style.module.scss'

type Props = React.PropsWithChildren & {
    className?: string
}

export const DivWithShadow: React.FC<Props> = ({ children, className }) => {
    return <div className={classNames(styles.wrapDiv, className)}>{children}</div>
}
