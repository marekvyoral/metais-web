import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

import styles from './definitionList.module.scss'

interface IDefintionListProps extends PropsWithChildren {
    className?: string
}

export const DefinitionList: React.FC<IDefintionListProps> = ({ children, className }) => {
    return <dl className={classNames(styles.dl, className)}>{children}</dl>
}
