import { DataObjectsIcon, EgovComponentsIcon, InstructionsIcon, MonitoringIcon, StandartsIcon } from '@isdd/metais-common/assets/images'
import { NavigationItem, NavigationSubItem, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'

const removeSubItemsForLoggedInUser = (subItems?: NavigationSubItem[]): NavigationSubItem[] | undefined => {
    return subItems?.filter((item) => !item.isLoginRequired).map((item) => ({ ...item, subItems: removeSubItemsForLoggedInUser(item.subItems) }))
}

const getEgovSubItems = (t: TFunction, isSideMenu?: boolean) => {
    const commonRoutes: NavigationItem[] = [
        { title: t('navMenu.lists.endServices'), path: NavigationSubRoutes.KONCOVE_SLUZBY },
        { title: t('navMenu.lists.applicationServices'), path: NavigationSubRoutes.APLIKACNE_SLUZBY },
        { title: t('navMenu.lists.isvs'), path: NavigationSubRoutes.ISVS },
        { title: t('navMenu.lists.infrastructures'), path: NavigationSubRoutes.INFRASCTRUCTURES },
        { title: t('navMenu.lists.webResidence'), path: NavigationSubRoutes.WEBOVE_SIDLO },
        { title: t('navMenu.lists.personalProcedures'), path: '/todo' },
        //{ title: t('navMenu.lists.educationalCourses'), path: NavigationSubRoutes.EDUCATIONAL_COURSES },
        //{ title: t('navMenu.lists.evidenceObjects'), path: NavigationSubRoutes.OBJEKTY_EVIDENCIE },
        //{ title: t('navMenu.lists.attributesEvidenceObjects'), path: NavigationSubRoutes.ATRIBUTY_OBJEKTY_EVIDENCIE },
    ]
    const egovComponentsSubItemsSideMenu: NavigationItem[] = [
        {
            path: RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS,
            title: t('navMenu.GoalsPrincipalsActivitiesKRIT'),
            subItems: [
                { title: t('navMenu.lists.ciel'), path: NavigationSubRoutes.CIEL },
                { title: t('navMenu.lists.princip'), path: NavigationSubRoutes.PRINCIP },
                { title: t('navMenu.lists.krit'), path: NavigationSubRoutes.KRIT },
            ],
        },

        {
            title: t('navMenu.programProjectsActivities'),
            path: RouteNames.HOW_TO_PROGRAMS_PROJECTS_ACTIVITIES,
            subItems: [
                { title: t('navMenu.lists.aktivita'), path: NavigationSubRoutes.AKTIVITA },
                { title: t('navMenu.lists.programs'), path: NavigationSubRoutes.PROGRAM },
                { title: t('navMenu.lists.projects'), path: NavigationSubRoutes.PROJEKT },
            ],
        },
        {
            title: t('navMenu.publicAuthorities'),
            path: RouteNames.HOW_TO_PO,
            subItems: [
                {
                    title: t('navMenu.lists.processorsOfITDevelopmentConcepts'),
                    path: NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS,
                },
                { title: t('navMenu.lists.subordinates'), path: NavigationSubRoutes.SUBORDINATES },
                { title: t('navMenu.lists.notInOVM'), path: NavigationSubRoutes.NOT_OVM },
                { title: t('navMenu.lists.publicAuthorityHierarchy'), path: NavigationSubRoutes.PUBLIC_AUTHORITY_HIERARCHY },
            ],
        },
        ...commonRoutes,
    ]

    const egovComponentsSubItemsTopMenu: NavigationItem[] = [
        ...commonRoutes,
        { title: t('navMenu.lists.projects'), path: NavigationSubRoutes.PROJEKT },
        { title: t('navMenu.lists.otherComponents'), path: RouteNames.HOW_TO_EGOV_COMPONENTS },
    ]

    return isSideMenu ? egovComponentsSubItemsSideMenu : egovComponentsSubItemsTopMenu
}

export const getPortalNavigationItems = (
    t: TFunction,
    isAuthorized = false,
    ksisvsGroupId: string | undefined,
    isSideMenu?: boolean,
): NavigationItem[] => {
    const egovSubItems = getEgovSubItems(t, isSideMenu)

    const navigationItems: NavigationItem[] = [
        {
            title: t('navMenu.egovComponents'),
            path: RouteNames.HOW_TO_EGOV_COMPONENTS,
            icon: EgovComponentsIcon,
            subItems: egovSubItems,
        },

        {
            path: RouteNames.HOW_TO_STANDARDIZATION,
            title: t('navMenu.standardization'),
            icon: StandartsIcon,
            subItems: [
                { title: t('navMenu.lists.commission'), path: `${NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE}/${ksisvsGroupId}` },
                { title: t('navMenu.lists.groups'), path: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE },
                { title: t('navMenu.lists.concepts'), path: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                { title: t('navMenu.lists.votes'), path: NavigationSubRoutes.ZOZNAM_HLASOV },
                { title: t('navMenu.lists.meetings'), path: NavigationSubRoutes.ZOZNAM_ZASADNUTI },
                { title: t('navMenu.lists.standards'), path: NavigationSubRoutes.STANDARDY_ISVS },
            ],
        },

        {
            path: RouteNames.HOW_TO_DATA_OBJECTS,
            title: t('navMenu.dataObjects'),
            icon: DataObjectsIcon,
            subItems: [
                {
                    title: t('navMenu.lists.registers'),
                    path: NavigationSubRoutes.HOW_TO_REFERENCE_REGISTERS,
                    subItems: [{ title: t('navMenu.lists.registersList'), path: NavigationSubRoutes.REFERENCE_REGISTRE }],
                },
                {
                    title: t('navMenu.lists.codelists'),
                    path: RouteNames.HOW_TO_CODELIST,
                    subItems: [
                        { title: t('navMenu.lists.codelistsList'), path: NavigationSubRoutes.CISELNIKY },
                        { title: t('navMenu.lists.codelistsRequestsList'), path: NavigationSubRoutes.CODELIST_REQUESTS },
                    ],
                },
                /* {
                    title: t('navMenu.referenceIdentifiers'),
                    path: RouteNames.HOW_TO_REFERENCE_IDENTIFIERS,
                    subItems: [
                        { title: t('navMenu.lists.referenceIdentifiersList'), path: NavigationSubRoutes.IDENTIFIERS_LIST },
                        { title: t('navMenu.lists.referenceIdentifiersRequestsList'), path: NavigationSubRoutes.IDENTIFIERS_REQUESTS },
                    ],
                },*/
            ],
        },

        {
            path: RouteNames.HOW_TO_MONITORING,
            title: t('navMenu.monitoring'),
            icon: MonitoringIcon,
            subItems: [
                { title: t('navMenu.reports'), path: RouteNames.REPORTS },
                { title: t('navMenu.lists.monitoring'), path: NavigationSubRoutes.MONITORING },
                //{ title: t('navMenu.lists.monitoringApp'), path: NavigationSubRoutes.MONITORING_AS },
                //{ title: t('navMenu.lists.monitoringImport'), path: NavigationSubRoutes.MONITORING_IMPORT },
                //{ title: t('navMenu.lists.monitoringSet'), path: NavigationSubRoutes.MONITORING_PARAMETRE_SET },
            ],
        },
        {
            path: RouteNames.PREHLADY_A_POSTUPY,
            title: t('navMenu.guides'),
            icon: InstructionsIcon,
        },
    ]

    return isAuthorized ? navigationItems : navigationItems.map((item) => ({ ...item, subItems: removeSubItemsForLoggedInUser(item.subItems) }))
}
