import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './buttonGroupRow.module.scss'

interface ButtonGroupParams extends PropsWithChildren {
    className?: string
}

export const ButtonGroupRow: React.FC<ButtonGroupParams> = ({ children, className }) => {
    return <div className={classNames(className, styles.buttonGroupRow, 'idsk-feedback__buttons')}>{children}</div>
}
