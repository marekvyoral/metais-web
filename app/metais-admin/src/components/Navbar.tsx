import React, { useState } from 'react'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { AdminRouteNames, NavigationItem } from '@isdd/metais-common/navigation/routeNames'

export const getAdminNavItems = (t: TFunction): NavigationItem[] => [
    {
        title: t('navMenu.dashboard'),
        path: AdminRouteNames.DASHBOARD,
    },
    {
        title: t('navMenu.assignment'),
        path: AdminRouteNames.ASSIGNMENT,
    },
    {
        title: t('navMenu.notifications'),
        path: AdminRouteNames.NOTIFICATIONS,
    },
    {
        title: t('navMenu.settings'),
        path: AdminRouteNames.SETTINGS,
    },
    {
        title: t('navMenu.organizations'),
        path: AdminRouteNames.ORGANIZATIONS,
    },
    {
        title: t('navMenu.codelists'),
        path: AdminRouteNames.CODELISTS,
    },
    {
        title: t('navMenu.admin'),
        path: AdminRouteNames.EGOV,
        subItems: [
            {
                title: t('navMenu.userManagement'),
                path: AdminRouteNames.USER_MANAGEMENT,
            },
            {
                title: t('navMenu.egov.entity'),
                path: AdminRouteNames.EGOV_ENTITY,
            },
            {
                title: t('navMenu.egov.roleManagement'),
                path: AdminRouteNames.ROLES,
            },
            {
                title: t('navMenu.egov.profiles'),
                path: AdminRouteNames.EGOV_PROFILE,
            },
            {
                title: t('navMenu.egov.relations'),
                path: AdminRouteNames.EGOV_RELATION,
            },
        ],
    },
]

export const Navbar: React.FC = () => {
    const { t } = useTranslation()
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    return (
        <>
            <a href="#main-content" className="govuk-skip-link idsk-skip-link--sticky">
                Preskočiť na hlavný obsah
            </a>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />
                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} />
                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={getAdminNavItems(t)} />
                </div>
            </header>
        </>
    )
}
