import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './buttonGroupRow.module.scss'

export const ButtonGroupRow: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className={classNames(styles.buttonGroupRow, 'idsk-feedback__buttons')}>{children}</div>
}
