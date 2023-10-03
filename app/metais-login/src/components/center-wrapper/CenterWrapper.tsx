import React, { PropsWithChildren } from 'react'

import styles from '@/styles/commonStyles.module.scss'

export const CenterWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.centerDiv}>
            <div className={styles.maxWidth}>{children}</div>
        </div>
    )
}
