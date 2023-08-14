import React, { useState } from 'react'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useTranslation } from 'react-i18next'
import { useGetNotificationList } from '@isdd/metais-common/api/generated/notifications-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NotificationIcon } from '@isdd/metais-common/assets/images'
import { IconWithNotification } from '@isdd/metais-common/components/navbar/navbar-main/IconWithNotification'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import { getPortalNavitagionItems } from './navigationItems'

import { TasksPopup } from '@/components/tasks-popup/TasksPopup'

export const Navbar: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    const { data: notificationsData } = useGetNotificationList({ perPage: 1, pageNumber: 1 }, { query: { enabled: !!user } })
    const Notifications = () => (
        <IconWithNotification
            onClick={() => undefined}
            title={t('navbar.factChecker')}
            src={NotificationIcon}
            count={notificationsData?.pagination?.totalUnreadedItems ?? 0}
            path={NavigationSubRoutes.NOTIFICATIONS}
        />
    )

    const iconGroupItems: React.FC[] = [TasksPopup, Notifications]

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} iconGroupItems={iconGroupItems} />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={getPortalNavitagionItems(t)} />
                </div>
            </header>
        </>
    )
}
