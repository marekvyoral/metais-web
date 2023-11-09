import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetNotificationList } from '@isdd/metais-common/api/generated/notifications-swagger'
import { NotificationIcon } from '@isdd/metais-common/assets/images'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { IconWithNotification } from '@isdd/metais-common/components/navbar/navbar-main/IconWithNotification'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'

import { getPortalNavigationItems } from './navigationItems'

import { TasksPopup } from '@/components/tasks-popup/TasksPopup'

export const Navbar: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: { userInfo: user },
    } = useAuth()
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    const { data: notificationsData } = useGetNotificationList({ perPage: 1, pageNumber: 1 }, { query: { enabled: !!user } })
    const Notifications = () => (
        <IconWithNotification
            title={t('navbar.notifications')}
            src={NotificationIcon}
            count={notificationsData?.pagination?.totalUnreadedItems ?? 0}
            path={NavigationSubRoutes.NOTIFICATIONS}
            showAsLink
            altText={t('navbar.notifications')}
        />
    )

    const { data: ksisvsGroup } = useFind2111({ shortName: KSIVS_SHORT_NAME })

    const iconGroupItems: React.FC[] = [TasksPopup, Notifications]
    const topMenuPortalRoutes = getPortalNavigationItems(t, !!user, Array.isArray(ksisvsGroup) ? ksisvsGroup[0].uuid : ksisvsGroup?.uuid)
    const topMenuWithoutPOAndMonitoring = topMenuPortalRoutes.filter(
        (item) => item.path != RouteNames.HOW_TO_PO && item.path != RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS,
    )

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} iconGroupItems={iconGroupItems} />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={topMenuWithoutPOAndMonitoring} />
                </div>
            </header>
        </>
    )
}
