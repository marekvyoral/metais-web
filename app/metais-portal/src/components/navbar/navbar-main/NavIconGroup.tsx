import React from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IconWithNotification } from './IconWithNotification'

import styles from '@/components/navbar/navbar.module.scss'
import { FactCheckIcon, NotificationIcon } from '@/assets/images'

interface INavIconGroup {
    isMobile: boolean
}

export const NavIconGroup: React.FC<INavIconGroup> = ({ isMobile }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    return (
        <>
            {user && (
                <div className={classnames(isMobile ? styles.iconGroupMobile : styles.iconGroupDesktop)}>
                    <ul className={styles.notificationIconList}>
                        <li className={styles.notificationListItem}>
                            <IconWithNotification
                                onClick={() => undefined}
                                title={t('navbar.notifications')}
                                src={FactCheckIcon}
                                count={323}
                                path="#"
                            />
                        </li>
                        <li className={styles.notificationListItem}>
                            <IconWithNotification
                                onClick={() => undefined}
                                title={t('navbar.factChecker')}
                                src={NotificationIcon}
                                count={3}
                                path="#"
                            />
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}
