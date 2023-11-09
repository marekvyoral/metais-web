import classnames from 'classnames'
import React from 'react'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface INavIconGroup {
    isMobile: boolean
    iconGroupItems?: React.FC[]
}

export const NavIconGroup: React.FC<INavIconGroup> = ({ isMobile, iconGroupItems }) => {
    const {
        state: { user },
    } = useAuth()

    return (
        <>
            {user && (
                <div className={classnames(isMobile ? styles.iconGroupMobile : styles.iconGroupDesktop)}>
                    <ul className={styles.notificationIconList}>
                        {iconGroupItems?.map((Item, index) => {
                            return (
                                <li key={index} className={styles.notificationListItem}>
                                    <Item />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </>
    )
}
