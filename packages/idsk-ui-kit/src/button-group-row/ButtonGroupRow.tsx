import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './buttonGroupRow.module.scss'

interface IButtonGroupParams extends PropsWithChildren {
    className?: string
    type?: 'row' | 'column'
}

export const ButtonGroupRow: React.FC<IButtonGroupParams> = ({ children, className, type }) => {
    const rowType = type === 'row' ? styles.buttonGroupRow : styles.buttonGroupColumn
    return <div className={classNames(className, rowType, 'idsk-feedback__buttons')}>{children}</div>
}
