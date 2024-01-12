import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { DataObjectsIcon, EgovComponentsIcon, InstructionsIcon, MonitoringIcon, StandartsIcon } from '@isdd/metais-common/assets/images'
import { NavigationItem, NavigationSubItem, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'

const SUBORDINATES_PATH_QUERY =
    `EA_Profil_PO_kategoria_osoby=c_kategoria_osoba.2&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.b&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.c1&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.c2&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.d1&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.d2&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.d3&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.d4&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.e&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.f&` +
    `EA_Profil_PO_typ_osoby=c_typ_osoby.g`

const removeSubItemsForLoggedInUser = (subItems?: NavigationSubItem[]): NavigationSubItem[] | undefined => {
    return subItems?.filter((item) => !item.isLoginRequired).map((item) => ({ ...item, subItems: removeSubItemsForLoggedInUser(item.subItems) }))
}

const getDataObjectSubItems = (t: TFunction, isSideMenu?: boolean) => {
    const dataObjectSubItemsTopMenu = [
        {
            title: t('navMenu.lists.registers'),
            path: NavigationSubRoutes.REFERENCE_REGISTRE,
        },
        {
            title: t('navMenu.lists.codelists'),
            path: NavigationSubRoutes.CODELIST,
        },
    ]

    const dataObjectSubItemsSideMenu = [
        {
            title: t('navMenu.lists.registers'),
            path: NavigationSubRoutes.HOW_TO_REFERENCE_REGISTERS,
            subItems: [{ title: t('navMenu.lists.registersList'), path: NavigationSubRoutes.REFERENCE_REGISTRE }],
        },
        {
            title: t('navMenu.lists.codelists'),
            path: RouteNames.HOW_TO_CODELIST,
            subItems: [
                { title: t('navMenu.lists.codelistsList'), path: NavigationSubRoutes.CODELIST },
                { title: t('navMenu.lists.codelistsRequestsList'), path: NavigationSubRoutes.REQUESTLIST, isLoginRequired: true },
            ],
        },
    ]
    return isSideMenu ? dataObjectSubItemsSideMenu : dataObjectSubItemsTopMenu
}

const getEgovSubItems = (t: TFunction, isSideMenu?: boolean) => {
    const commonRoutes: NavigationItem[] = [
        { title: t('navMenu.lists.endServices'), path: NavigationSubRoutes.KONCOVE_SLUZBY },
        { title: t('navMenu.lists.applicationServices'), path: NavigationSubRoutes.APLIKACNE_SLUZBY },
        { title: t('navMenu.lists.isvs'), path: NavigationSubRoutes.ISVS },
        { title: t('navMenu.lists.infrastructures'), path: NavigationSubRoutes.INFRASCTRUCTURES },
        { title: t('navMenu.lists.webResidence'), path: NavigationSubRoutes.WEBOVE_SIDLO },
        { title: t('navMenu.lists.personalProcedures'), path: NavigationSubRoutes.OSOBITNY_POSTUP },
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
            title: t('navMenu.publicAuthoritiesNav'),
            path: RouteNames.HOW_TO_PO,
            subItems: [
                {
                    title: t('navMenu.lists.processorsOfITDevelopmentConcepts'),
                    path: NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS,
                },
                {
                    title: t('navMenu.lists.subordinates'),
                    path: `${NavigationSubRoutes.SUBORDINATES}?${SUBORDINATES_PATH_QUERY}`,
                },
                {
                    title: t('navMenu.lists.notInOVM'),
                    path: `${NavigationSubRoutes.NOT_OVM}?${ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby}=c_kategoria_osoba.1`,
                },
                { title: t('navMenu.lists.publicAuthorityHierarchy'), path: NavigationSubRoutes.PUBLIC_AUTHORITY_HIERARCHY, isLoginRequired: true },
            ],
        },
        ...commonRoutes,
    ]

    const egovComponentsSubItemsTopMenu: NavigationItem[] = [
        {
            title: t('navMenu.GoalsPrincipalsActivitiesKRIT'),
            path: NavigationSubRoutes.CIEL,
        },

        {
            title: t('navMenu.programProjectsActivities'),
            path: NavigationSubRoutes.AKTIVITA,
        },
        {
            title: t('navMenu.publicAuthoritiesNav'),
            path: NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS,
        },
        ...commonRoutes,
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

    const dataObjectSubItems = getDataObjectSubItems(t, isSideMenu)

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
            subItems: dataObjectSubItems,
        },

        {
            path: RouteNames.HOW_TO_MONITORING,
            title: t('navMenu.monitoringNav'),
            icon: MonitoringIcon,
            subItems: [
                { title: t('navMenu.reports'), path: RouteNames.REPORTS },
                { title: t('navMenu.lists.monitoringServices'), path: RouteNames.MONITORING_SERVICES },
                //{ title: t('navMenu.lists.monitoringEnd'), path: NavigationSubRoutes.MONITORING_KS },
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
