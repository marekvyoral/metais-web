import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './buttonGroupRow.module.scss'

interface IButtonGroupParams extends PropsWithChildren {
    className?: string
    type?: 'row' | 'column'
}

export const ButtonGroupRow: React.FC<IButtonGroupParams> = ({ children, className, type = 'row' }) => {
    const columnType = type === 'column' ? styles.buttonGroupColumn : styles.buttonGroupRow
    return <div className={classNames(className, columnType, 'idsk-feedback__buttons')}>{children}</div>
}
