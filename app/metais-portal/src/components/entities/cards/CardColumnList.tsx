import React from 'react'

import styles from './cardColumnList.module.scss'

export const CardColumnList: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className={styles.cardColumnList}>{children}</div>
}
