import { InstructionsIcon } from '@isdd/metais-common/assets/images'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { AdminRouteNames, AdminRouteRoles, NavigationItem } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPermittedRoutesForUser } from '@/componentHelpers/navigation'
import { useAdminProtectedRoutes } from '@/hooks/permissions/useAdminProtectedRoutes'

export const getAdminNavItems = (t: TFunction, userRoles: string[] | null): NavigationItem[] => {
    const adminRoutes: NavigationItem[] = [
        {
            title: t('navMenu.userManagement.userManagement'),
            path: AdminRouteNames.USER_MANAGEMENT,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
            subItems: [
                {
                    title: t('navMenu.userManagement.users'),
                    role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
                    path: AdminRouteNames.USER_MANAGEMENT,
                },
                {
                    title: t('navMenu.userManagement.requestList'),
                    role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
                    path: AdminRouteNames.REQUEST_LIST_ALL,
                },
            ],
        },
        {
            title: t('navMenu.roleManagement'),
            path: AdminRouteNames.ROLES,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN],
        },
        {
            title: t('navMenu.publicAuthorities.management'),
            path: '/public-authorities',
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN],
            subItems: [
                {
                    title: t('navMenu.publicAuthorities.publicAuthorities'),
                    path: AdminRouteNames.PUBLIC_AUTHORITIES_LIST,
                    role: [AdminRouteRoles.ADMIN],
                },
                {
                    title: t('navMenu.publicAuthorities.massUpdate'),
                    path: AdminRouteNames.PUBLIC_AUTHORITIES_MASS_UPDATE,
                    role: [AdminRouteRoles.ADMIN],
                },
            ],
        },
        {
            title: t('navMenu.egov.egov'),
            path: AdminRouteNames.EGOV_ENTITY,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN],
            subItems: [
                {
                    title: t('navMenu.egov.entity'),
                    path: AdminRouteNames.EGOV_ENTITY,
                    role: [AdminRouteRoles.ADMIN],
                },
                {
                    title: t('navMenu.egov.profiles'),
                    path: AdminRouteNames.EGOV_PROFILE,
                    role: [AdminRouteRoles.ADMIN],
                },
                {
                    title: t('navMenu.egov.relations'),
                    path: AdminRouteNames.EGOV_RELATION,
                    role: [AdminRouteRoles.ADMIN],
                },
            ],
        },
        {
            title: t('navMenu.codelists'),
            path: AdminRouteNames.CODELISTS,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN],
        },
        {
            title: t('navMenu.monitoring.monitoring'),
            //in admin is /list but that is not unique
            path: AdminRouteNames.MONITORING,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
            subItems: [
                //did not find similar routes in admin so I made custom ones
                {
                    title: t('navMenu.monitoring.params'),
                    path: AdminRouteNames.MONITORING_PARAMS,
                    role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
                },
                {
                    title: t('navMenu.monitoring.list'),
                    path: AdminRouteNames.MONITORING_LIST,
                    role: [AdminRouteRoles.ADMIN, AdminRouteRoles.HKO],
                },
            ],
        },
        //predpokladam ze to je sprava zostav
        {
            title: t('navMenu.reportsManagement'),
            path: AdminRouteNames.REPORTS_MANAGEMENT,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN, AdminRouteRoles.METAIS],
        },
        {
            title: t('navMenu.projects.management'),
            path: AdminRouteNames.PROJECTS_FINANCE_MANAGEMENT,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN, AdminRouteRoles.METAIS],
            subItems: [
                {
                    title: t('navMenu.projects.financeManagement'),
                    path: AdminRouteNames.PROJECTS_FINANCE_MANAGEMENT,
                    role: [AdminRouteRoles.ADMIN],
                },
                {
                    title: t('navMenu.eko'),
                    path: AdminRouteNames.EKO,
                    //not sure about this TODO
                    role: [AdminRouteRoles.ADMIN],
                },
                {
                    title: t('navMenu.documentsManagement'),
                    path: AdminRouteNames.DOCUMENTS_MANAGEMENT,
                    role: [AdminRouteRoles.ADMIN, AdminRouteRoles.METAIS],
                },
            ],
        },
        //not sure about this TODO
        {
            title: t('navMenu.templateReferenceIdentifiersManagement'),
            path: AdminRouteNames.TEMPLATE_REFERENCE_IDENTIFIERS,
            icon: InstructionsIcon,
            role: [AdminRouteRoles.ADMIN],
        },
    ]

    if (userRoles == null || userRoles.length == 0) return []

    return getPermittedRoutesForUser(adminRoutes, userRoles)
}

type NavbarProps = {
    isAdmin?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    const adminRoutes = getAdminNavItems(t, user?.roles ?? null)
    useAdminProtectedRoutes(adminRoutes)

    return (
        <>
            <a href="#main-content" className="govuk-skip-link idsk-skip-link--sticky">
                Preskočiť na hlavný obsah
            </a>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />
                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} isAdmin={isAdmin} />
                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={adminRoutes} />
                </div>
            </header>
        </>
    )
}
