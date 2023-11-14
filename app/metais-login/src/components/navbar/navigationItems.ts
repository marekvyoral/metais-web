import { DataObjectsIcon, EgovComponentsIcon, InstructionsIcon, MonitoringIcon, StandartsIcon } from '@isdd/metais-common/assets/images'
import { PORTAL_URL } from '@isdd/metais-common/constants'
import { NavigationItem, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'

const getEgovSubItems = (t: TFunction, isSideMenu?: boolean) => {
    const commonRoutes: NavigationItem[] = [
        { title: t('navMenu.lists.endServices'), path: PORTAL_URL + NavigationSubRoutes.KONCOVE_SLUZBY },
        { title: t('navMenu.lists.applicationServices'), path: PORTAL_URL + NavigationSubRoutes.APLIKACNE_SLUZBY },
        { title: t('navMenu.lists.isvs'), path: PORTAL_URL + NavigationSubRoutes.ISVS },
        { title: t('navMenu.lists.infrastructures'), path: PORTAL_URL + NavigationSubRoutes.INFRASCTRUCTURES },
        { title: t('navMenu.lists.webResidence'), path: PORTAL_URL + NavigationSubRoutes.WEBOVE_SIDLO },
        { title: t('navMenu.lists.personalProcedures'), path: PORTAL_URL + '/todo' },
        //{ title: t('navMenu.lists.educationalCourses'), path: PORTAL_URL + NavigationSubRoutes.EDUCATIONAL_COURSES },
        //{ title: t('navMenu.lists.evidenceObjects'), path: PORTAL_URL + NavigationSubRoutes.OBJEKTY_EVIDENCIE },
        //{ title: t('navMenu.lists.attributesEvidenceObjects'), path: PORTAL_URL + NavigationSubRoutes.ATRIBUTY_OBJEKTY_EVIDENCIE },
    ]
    const egovComponentsSubItemsSideMenu: NavigationItem[] = [
        {
            path: PORTAL_URL + RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS,
            title: t('navMenu.GoalsPrincipalsActivitiesKRIT'),
            subItems: [
                { title: t('navMenu.lists.ciel'), path: PORTAL_URL + NavigationSubRoutes.CIEL },
                { title: t('navMenu.lists.princip'), path: PORTAL_URL + NavigationSubRoutes.PRINCIP },
                { title: t('navMenu.lists.krit'), path: PORTAL_URL + NavigationSubRoutes.KRIT },
            ],
        },

        {
            title: t('navMenu.programProjectsActivities'),
            path: PORTAL_URL + RouteNames.HOW_TO_PROGRAMS_PROJECTS_ACTIVITIES,
            subItems: [
                { title: t('navMenu.lists.aktivita'), path: PORTAL_URL + NavigationSubRoutes.AKTIVITA },
                { title: t('navMenu.lists.programs'), path: PORTAL_URL + NavigationSubRoutes.PROGRAM },
                { title: t('navMenu.lists.projects'), path: PORTAL_URL + NavigationSubRoutes.PROJEKT },
            ],
        },
        {
            title: t('navMenu.publicAuthorities'),
            path: PORTAL_URL + RouteNames.HOW_TO_PO,
            subItems: [
                {
                    title: t('navMenu.lists.processorsOfITDevelopmentConcepts'),
                    path: PORTAL_URL + NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS,
                },
                { title: t('navMenu.lists.subordinates'), path: PORTAL_URL + NavigationSubRoutes.SUBORDINATES },
                { title: t('navMenu.lists.notInOVM'), path: PORTAL_URL + NavigationSubRoutes.NOT_OVM },
                { title: t('navMenu.lists.publicAuthorityHierarchy'), path: PORTAL_URL + NavigationSubRoutes.PUBLIC_AUTHORITY_HIERARCHY },
            ],
        },
        ...commonRoutes,
    ]

    const egovComponentsSubItemsTopMenu: NavigationItem[] = [
        ...commonRoutes,
        { title: t('navMenu.lists.projects'), path: PORTAL_URL + NavigationSubRoutes.PROJEKT },
        { title: t('navMenu.lists.otherComponents'), path: PORTAL_URL + RouteNames.HOW_TO_EGOV_COMPONENTS },
    ]

    return isSideMenu ? egovComponentsSubItemsSideMenu : egovComponentsSubItemsTopMenu
}

export const getLoginNavigationItems = (t: TFunction, ksisvsGroupId: string | undefined, isSideMenu?: boolean): NavigationItem[] => {
    const egovSubItems = getEgovSubItems(t, isSideMenu)

    const navigationItems: NavigationItem[] = [
        {
            title: t('navMenu.egovComponents'),
            path: PORTAL_URL + RouteNames.HOW_TO_EGOV_COMPONENTS,
            icon: EgovComponentsIcon,
            subItems: egovSubItems,
        },

        {
            path: PORTAL_URL + RouteNames.HOW_TO_STANDARDIZATION,
            title: t('navMenu.standardization'),
            icon: StandartsIcon,
            subItems: [
                { title: t('navMenu.lists.commission'), path: PORTAL_URL + `${NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE}/${ksisvsGroupId}` },
                { title: t('navMenu.lists.groups'), path: PORTAL_URL + NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE },
                { title: t('navMenu.lists.concepts'), path: PORTAL_URL + NavigationSubRoutes.ZOZNAM_NAVRHOV },
                { title: t('navMenu.lists.votes'), path: PORTAL_URL + NavigationSubRoutes.ZOZNAM_HLASOV },
                { title: t('navMenu.lists.meetings'), path: PORTAL_URL + NavigationSubRoutes.ZOZNAM_ZASADNUTI },
                { title: t('navMenu.lists.standards'), path: PORTAL_URL + NavigationSubRoutes.STANDARDY_ISVS },
            ],
        },

        {
            path: PORTAL_URL + RouteNames.HOW_TO_DATA_OBJECTS,
            title: t('navMenu.dataObjects'),
            icon: DataObjectsIcon,
            subItems: [
                {
                    title: t('navMenu.lists.registers'),
                    path: PORTAL_URL + NavigationSubRoutes.HOW_TO_REFERENCE_REGISTERS,
                    subItems: [
                        { title: t('navMenu.lists.registersList'), path: PORTAL_URL + NavigationSubRoutes.REFERENCE_REGISTRE },
                        { title: t('navMenu.lists.registersRequestsList'), path: PORTAL_URL + NavigationSubRoutes.REFERENCE_REGISTERS_REQUESTS },
                    ],
                },
                {
                    title: t('navMenu.lists.codelists'),
                    path: PORTAL_URL + RouteNames.HOW_TO_CODELIST,
                    subItems: [
                        { title: t('navMenu.lists.codelistsList'), path: PORTAL_URL + NavigationSubRoutes.CISELNIKY },
                        { title: t('navMenu.lists.codelistsRequestsList'), path: PORTAL_URL + NavigationSubRoutes.CODELIST_REQUESTS },
                    ],
                },
                /* {
                    title: t('navMenu.referenceIdentifiers'),
                    path: PORTAL_URL + RouteNames.HOW_TO_REFERENCE_IDENTIFIERS,
                    subItems: [
                        { title: t('navMenu.lists.referenceIdentifiersList'), path: PORTAL_URL + NavigationSubRoutes.IDENTIFIERS_LIST },
                        { title: t('navMenu.lists.referenceIdentifiersRequestsList'), path: PORTAL_URL + NavigationSubRoutes.IDENTIFIERS_REQUESTS },
                    ],
                },*/
            ],
        },
        {
            path: PORTAL_URL + RouteNames.HOW_TO_MONITORING,
            title: t('navMenu.monitoring'),
            icon: MonitoringIcon,
            subItems: [
                { title: t('navMenu.reports'), path: PORTAL_URL + RouteNames.REPORTS },
                //{ title: t('navMenu.lists.monitoringEnd'), path: PORTAL_URL + NavigationSubRoutes.MONITORING_KS },
                //{ title: t('navMenu.lists.monitoringApp'), path: PORTAL_URL + NavigationSubRoutes.MONITORING_AS },
                //{ title: t('navMenu.lists.monitoringImport'), path: PORTAL_URL + NavigationSubRoutes.MONITORING_IMPORT },
                //{ title: t('navMenu.lists.monitoringSet'), path: PORTAL_URL + NavigationSubRoutes.MONITORING_PARAMETRE_SET },
            ],
        },
        {
            path: PORTAL_URL + RouteNames.PREHLADY_A_POSTUPY,
            title: t('navMenu.guides'),
            icon: InstructionsIcon,
        },
    ]

    return navigationItems
}
