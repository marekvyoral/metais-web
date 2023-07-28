import { FactCheckIcon, NotificationIcon } from '@isdd/metais-common/assets/images'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetNotificationList } from '@isdd/metais-common/api/generated/notifications-swagger'

import { IconWithNotification } from './IconWithNotification'

import styles from '@/components/navbar/navbar.module.scss'
import { NavigationSubRoutes } from '@/navigation/routeNames'

interface INavIconGroup {
    isMobile: boolean
}

export const NavIconGroup: React.FC<INavIconGroup> = ({ isMobile }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const { data: notificationsData } = useGetNotificationList({ perPage: 1, pageNumber: 1 }, { query: { enabled: !!user } })

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
                                count={notificationsData?.pagination?.totalUnreadedItems ?? 0}
                                path={NavigationSubRoutes.NOTIFICATIONS}
                            />
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}
