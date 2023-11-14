import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

import styles from './definitionList.module.scss'

interface IDefinitionListProps extends PropsWithChildren {
    className?: string
}

export const DefinitionList: React.FC<IDefinitionListProps> = ({ children, className }) => {
    return <dl className={classNames(styles.dl, className)}>{children}</dl>
}
