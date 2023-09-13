import { DataObjectsIcon, EgovComponentsIcon, InstructionsIcon, MonitoringIcon, StandartsIcon } from '@isdd/metais-common/assets/images'
import { NavigationItem, NavigationSubItem, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { TFunction } from 'i18next'

const removeSubItemsForLoggedInUser = (subItems?: NavigationSubItem[]): NavigationSubItem[] | undefined => {
    return subItems?.filter((item) => !item.isLoginRequired).map((item) => ({ ...item, subItems: removeSubItemsForLoggedInUser(item.subItems) }))
}

export const getPortalNavigationItems = (t: TFunction, isAuthorized = false, ksisvsGroupId: string | undefined): NavigationItem[] => {
    const navigationItems: NavigationItem[] = [
        {
            title: t('navMenu.egovComponents'),
            path: RouteNames.HOW_TO_EGOV_COMPONENTS,
            icon: EgovComponentsIcon,
            subItems: [
                { title: t('navMenu.lists.programs'), path: NavigationSubRoutes.PROGRAM },
                { title: t('navMenu.lists.projects'), path: NavigationSubRoutes.PROJEKT },
                { title: t('navMenu.lists.endServices'), path: NavigationSubRoutes.KONCOVE_SLUZBY },
                { title: t('navMenu.lists.applicationServices'), path: NavigationSubRoutes.APLIKACNE_SLUZBY },
                { title: t('navMenu.lists.isvs'), path: NavigationSubRoutes.ISVS },
                { title: t('navMenu.lists.evidenceObjects'), path: NavigationSubRoutes.OBJEKTY_EVIDENCIE },
                { title: t('navMenu.lists.attributesEvidenceObjects'), path: NavigationSubRoutes.ATRIBUTY_OBJEKTY_EVIDENCIE },
                { title: t('navMenu.lists.infrastructures'), path: NavigationSubRoutes.INFRASCTRUCTURES },
                { title: t('navMenu.lists.authorities'), path: NavigationSubRoutes.AUTORITY },
                { title: t('navMenu.lists.servers'), path: NavigationSubRoutes.SERVERY },
                { title: t('navMenu.lists.virtualMachines'), path: NavigationSubRoutes.VIRTUALNE_STROJE },
                { title: t('navMenu.lists.operationPlace'), path: NavigationSubRoutes.MIESTO_PREVADZKY },
                { title: t('navMenu.lists.notInOVM'), path: NavigationSubRoutes.NIE_SU_OVM },
                { title: t('navMenu.lists.licenses'), path: NavigationSubRoutes.LICENCIE },
                { title: t('navMenu.lists.processorsOfITDevelopmentConcepts'), path: NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS },
                { title: t('navMenu.lists.subordinates'), path: NavigationSubRoutes.SUBORDINATES },
                { title: t('navMenu.lists.ISoperators'), path: NavigationSubRoutes.IS_OPERATORS },
            ],
        },
        {
            path: RouteNames.HOW_TO_STANDARDIZATION,
            title: t('navMenu.standardization'),
            icon: StandartsIcon,
            subItems: [
                { title: t('navMenu.lists.standards'), path: NavigationSubRoutes.STANDARDY_ISVS },
                { title: t('navMenu.lists.commission'), path: `${NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE}/${ksisvsGroupId}` },
                { title: t('navMenu.lists.groups'), path: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE },
                { title: t('navMenu.lists.concepts'), path: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                { title: t('navMenu.lists.votes'), path: NavigationSubRoutes.ZOZNAM_HLASOV },
                { title: t('navMenu.lists.meetings'), path: NavigationSubRoutes.ZOZNAM_ZASADNUTI },
            ],
        },
        {
            path: RouteNames.HOW_TO_DATA_OBJECTS,
            title: t('navMenu.dataObjects'),
            icon: DataObjectsIcon,
            subItems: [
                { title: t('navMenu.lists.registers'), path: NavigationSubRoutes.REFERENCE_REGISTRE },
                {
                    title: t('navMenu.lists.codelists'),
                    path: RouteNames.HOW_TO_CODELIST,
                    subItems: [
                        { title: t('navMenu.lists.codelists'), path: NavigationSubRoutes.CISELNIKY, isLoginRequired: true },
                        { title: t('navMenu.lists.publicCodelists'), path: NavigationSubRoutes.PUBLIKOVANE_CISELNIKY },
                    ],
                },
                { title: t('navMenu.lists.centralModel'), path: NavigationSubRoutes.CENTRALNY_DATOVY_MODEL },
                { title: t('navMenu.lists.prud'), path: NavigationSubRoutes.PRUD },
                { title: t('navMenu.lists.sdg'), path: NavigationSubRoutes.JEDNOTNA_DIGITALNA_BRANA },
            ],
        },
        {
            path: RouteNames.HOW_TO_MONITORING,
            title: t('navMenu.monitoring'),
            icon: MonitoringIcon,
            subItems: [
                { title: t('navMenu.lists.overviews'), path: NavigationSubRoutes.PREHLADY },
                { title: t('navMenu.lists.monitoringEnd'), path: NavigationSubRoutes.MONITORING_KS },
                { title: t('navMenu.lists.monitoringApp'), path: NavigationSubRoutes.MONITORING_AS },
                { title: t('navMenu.lists.monitoringSet'), path: NavigationSubRoutes.MONITORING_PARAMETRE_SET },
                { title: t('navMenu.reports'), path: RouteNames.REPORTS },
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
