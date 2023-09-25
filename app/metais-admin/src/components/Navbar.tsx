import { InstructionsIcon } from '@isdd/metais-common/assets/images'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { AdminRouteNames, NavigationItem } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const getAdminNavItems = (t: TFunction): NavigationItem[] => [
    {
        title: t('navMenu.userManagement.userManagement'),
        path: AdminRouteNames.USER_MANAGEMENT,
        icon: InstructionsIcon,
        subItems: [
            {
                title: t('navMenu.userManagement.users'),
                path: AdminRouteNames.USERS,
            },
            {
                title: t('navMenu.userManagement.requestList'),
                path: AdminRouteNames.REQUEST_LIST_ALL,
            },
        ],
    },
    {
        title: t('navMenu.roleManagement'),
        path: AdminRouteNames.ROLES,
        icon: InstructionsIcon,
    },
    {
        title: t('navMenu.publicAuthorities.management'),
        path: '/public-authorities',
        icon: InstructionsIcon,
        subItems: [
            { title: t('navMenu.publicAuthorities.publicAuthorities'), path: '/public-authorities/list' },
            { title: t('navMenu.publicAuthorities.massActualizations'), path: '/public-authorities/mass-updates' },
        ],
    },
    {
        title: t('navMenu.egov.egov'),
        path: AdminRouteNames.EGOV,
        icon: InstructionsIcon,
        subItems: [
            {
                title: t('navMenu.egov.entity'),
                path: AdminRouteNames.EGOV_ENTITY,
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
    {
        title: t('navMenu.codelists'),
        path: AdminRouteNames.CODELISTS,
        icon: InstructionsIcon,
    },
    {
        title: t('navMenu.monitoring.monitoring'),
        //in admin is /list but that is not unique
        path: AdminRouteNames.MONITORING,
        icon: InstructionsIcon,
        subItems: [
            //did not find similar routes in admin so I made custom ones
            { title: t('navMenu.monitoring.params'), path: AdminRouteNames.MONITORING_PARAMS },
            { title: t('navMenu.monitoring.list'), path: AdminRouteNames.MONITORING_LIST },
        ],
    },
    //predpokladam ze to je sprava zostav
    { title: t('navMenu.reportsManagement'), path: AdminRouteNames.REPORTS_MANAGEMENT, icon: InstructionsIcon },
    {
        title: t('navMenu.projects.management'),
        path: AdminRouteNames.PROJECTS_MANAGEMENT,
        icon: InstructionsIcon,
        subItems: [
            { title: t('navMenu.projects.financeManagement'), path: AdminRouteNames.PROJECTS_FINANCE_MANAGEMENT },
            {
                title: t('navMenu.eko'),
                path: AdminRouteNames.EKO,
            },
            { title: t('navMenu.documentsManagement'), path: AdminRouteNames.DOCUMENTS_MANAGEMENT },
        ],
    },
    { title: t('navMenu.templateReferenceIdentifiersManagement'), path: AdminRouteNames.TEMPLATE_REFERENCE_IDENTIFIERS, icon: InstructionsIcon },
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
