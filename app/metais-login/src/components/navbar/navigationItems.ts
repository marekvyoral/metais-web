import { NavigationItem, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'
import { PORTAL_URL } from '@isdd/metais-common/constants'

export const getLoginNavigationItems = (t: TFunction, ksisvsGroupId: string | undefined): NavigationItem[] => {
    const navigationItems: NavigationItem[] = [
        {
            title: t('navMenu.egovComponents'),
            path: PORTAL_URL + RouteNames.HOW_TO_EGOV_COMPONENTS,

            subItems: [
                { title: t('navMenu.lists.isvs'), path: PORTAL_URL + NavigationSubRoutes.ISVS },
                { title: t('navMenu.lists.endServices'), path: PORTAL_URL + NavigationSubRoutes.KONCOVE_SLUZBY },
                { title: t('navMenu.lists.applicationServices'), path: PORTAL_URL + NavigationSubRoutes.APLIKACNE_SLUZBY },
                { title: t('navMenu.lists.infrastructures'), path: PORTAL_URL + NavigationSubRoutes.INFRASCTRUCTURES },
                { title: t('navMenu.lists.webResidence'), path: PORTAL_URL + NavigationSubRoutes.WEBOVE_SIDLO },
                { title: t('navMenu.lists.process'), path: PORTAL_URL + NavigationSubRoutes.PROCES },
                { title: t('navMenu.lists.personalProcedures'), path: PORTAL_URL + '/todo' },
                { title: t('navMenu.lists.educationalCourses'), path: PORTAL_URL + '/todo' },
                { title: t('navMenu.lists.evidenceObjects'), path: PORTAL_URL + NavigationSubRoutes.OBJEKTY_EVIDENCIE },
                { title: t('navMenu.lists.attributesEvidenceObjects'), path: PORTAL_URL + NavigationSubRoutes.ATRIBUTY_OBJEKTY_EVIDENCIE },
            ],
        },
        {
            path: PORTAL_URL + RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS,
            title: t('navMenu.KRITProgramsProjects'),
            subItems: [
                { title: t('navMenu.lists.princip'), path: PORTAL_URL + NavigationSubRoutes.PRINCIP },
                { title: t('navMenu.lists.ciel'), path: PORTAL_URL + NavigationSubRoutes.CIEL },
                { title: t('navMenu.lists.aktivita'), path: PORTAL_URL + NavigationSubRoutes.AKTIVITA },
                { title: t('navMenu.lists.kris'), path: PORTAL_URL + NavigationSubRoutes.KRIS },
                { title: t('navMenu.lists.programs'), path: PORTAL_URL + NavigationSubRoutes.PROGRAM },
                { title: t('navMenu.lists.projects'), path: PORTAL_URL + NavigationSubRoutes.PROJEKT },
            ],
        },
        {
            path: PORTAL_URL + RouteNames.HOW_TO_STANDARDIZATION,
            title: t('navMenu.standardization'),
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
                        { title: t('navMenu.lists.codelists'), path: PORTAL_URL + NavigationSubRoutes.CISELNIKY },
                        { title: t('navMenu.lists.codelistsRequestsList'), path: PORTAL_URL + NavigationSubRoutes.CODELIST_REQUESTS },
                    ],
                },
                {
                    title: t('navMenu.referenceIdentifiers'),
                    path: PORTAL_URL + RouteNames.HOW_TO_REFERENCE_IDENTIFIERS,
                    subItems: [
                        { title: t('navMenu.lists.referenceIdentifiersList'), path: PORTAL_URL + NavigationSubRoutes.IDENTIFIERS_LIST },
                        { title: t('navMenu.lists.referenceIdentifiersRequestsList'), path: PORTAL_URL + NavigationSubRoutes.IDENTIFIERS_REQUESTS },
                    ],
                },
            ],
        },

        {
            path: PORTAL_URL + RouteNames.PREHLADY_A_POSTUPY,
            title: t('navMenu.guides'),
        },
    ]

    return navigationItems
}
