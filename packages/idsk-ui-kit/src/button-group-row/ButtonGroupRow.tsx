import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

import styles from './buttonGroupRow.module.scss'

interface IButtonGroupParams extends PropsWithChildren {
    className?: string
}

export const ButtonGroupRow: React.FC<IButtonGroupParams> = ({ children, className }) => {
    return <div className={classNames(className, styles.buttonGroupRow, 'idsk-feedback__buttons')}>{children}</div>
}
