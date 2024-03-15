import { NavigationCloseIcon, NotificationIcon, NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { IconWithNotification } from '@isdd/metais-common/components/navbar/navbar-main/IconWithNotification'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetNotificationsWithRefresh } from '@isdd/metais-common/hooks/useGetNotificationsWithRefresh'
import { useGetCurrentSystemState } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { InformationBar } from '@isdd/idsk-ui-kit/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SHOW_SYSTEM_STATE_BAR } from '@isdd/metais-common/api'

import { getPortalNavigationItems } from './navigationItems'
import styles from './styles.module.scss'

import { TasksPopup } from '@/components/tasks-popup/TasksPopup'
export const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    const { data: notificationsData } = useGetNotificationsWithRefresh({ filter: { perPage: 1, pageNumber: 1 }, enabled: isUserLogged })

    const Notifications = () => (
        <IconWithNotification
            title={t('navbar.notifications')}
            iconActive={NotificationBlackIcon}
            iconInactive={NotificationIcon}
            count={notificationsData?.pagination?.totalUnreadedItems ?? 0}
            path={NavigationSubRoutes.NOTIFICATIONS}
            showAsLink
            altText={t('navbar.notifications')}
            ariaLabel={t('notifications.youHave', { count: notificationsData?.pagination?.totalUnreadedItems ?? 0 })}
        />
    )

    const iconGroupItems: React.FC[] = [TasksPopup, Notifications]
    const topMenuPortalRoutes = getPortalNavigationItems(t, !!user)
    const topMenuWithoutPOAndMonitoring = topMenuPortalRoutes.filter((item) => item.path != RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS)

    const { data: currentSystemState } = useGetCurrentSystemState()
    const [showInfoBar, setShowInfoBar] = useState(sessionStorage.getItem(SHOW_SYSTEM_STATE_BAR) !== 'false')
    const closeInfoBar = () => {
        setShowInfoBar(false)
        sessionStorage.setItem(SHOW_SYSTEM_STATE_BAR, 'false')
    }
    return (
        <>
            <a href="#main-content" className="govuk-skip-link idsk-skip-link--sticky">
                {t('navbar.skip')}
            </a>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} iconGroupItems={iconGroupItems} />

                    <div className="idsk-header-web__nav--divider" />
                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={topMenuWithoutPOAndMonitoring} />
                    {!!currentSystemState?.text && showInfoBar && (
                        <div className={styles.modalContent}>
                            <button className={styles.closeButton} onClick={() => closeInfoBar()} aria-label={t('close')}>
                                <img src={NavigationCloseIcon} alt="" />
                            </button>
                            <InformationBar
                                color={currentSystemState?.systemStateColor?.value}
                                text={currentSystemState?.text}
                                status={
                                    i18n.language == Languages.SLOVAK
                                        ? currentSystemState?.systemState?.description ?? ''
                                        : currentSystemState?.systemState?.engDescription ?? ''
                                }
                            />
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}
