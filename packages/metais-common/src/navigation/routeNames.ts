export enum RouteNames {
    HOME = '/',
    DEV_TEST_SCREEN = 'DevTestScreen',
    PROJEKT_LIST_PAGE = '/projekt/list',
    PROJEKT_ENTITY_DETAIL = '/ci/:entityName/:projektId',
    HOW_TO_PUBLIC_AUTHORITIES = 'howto/CMBD.PUBLIC_AUTHORITIES/PUBLIC_AUTHORITIES_HOWTO',
    HOW_TO_EGOV_COMPONENTS = 'howto/CMDB.EGOV_TITLE/EGOV_HOWTO',
    HOW_TO_STANDARDIZATION = 'howto/STANDARD.PROCESS/STD_HOWTO',
    HOW_TO_MONITORING = 'howto/MONITORING.MONITORING/MONITORING_HOWTO',
    //not found on metais
    HOW_TO_DATA_OBJECTS = 'howto/DATA.DATA_OBJECTS/DO_HOWTO',
    PREHLADY_A_POSTUPY = '',
    DOCUMENTS_LIST_TAB = '/ci/:entityName/:entityId/documents',
    RELATIONSHIPS_LIST_TAB = '/ci/:entityName/:entityId/relationships',
    TASKS = '/ulohy',
}

export enum AdminRouteNames {
    HOME = '/',
    DASHBOARD = '/dashboard',
    ASSIGNMENT = '/assignment',
    NOTIFICATIONS = '/notifications',
    SETTINGS = '/settings',
    EGOV = '/egov',
    EGOV_ENTITY = '/egov/entity',
    EGOV_PROFILE = '/egov/profile',
    EGOV_RELATION = '/egov/relation',
    ORGANIZATIONS = '/organizations',
}

export enum NavigationSubRoutes {
    TASK_DETAIL = '/ulohy/:taskId',
    PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS = 'ci/PO_IS',
    SUBORDINATES = 'ci/PO_PO',
    IS_OPERATORS = 'ci/PO_IS_PO',
    CIEL = 'ci/Ciel',
    PROGRAM = 'ci/Program',
    PROJEKT = 'ci/Projekt',
    KONCOVE_SLUZBY = 'ci/KS',
    APLIKACNE_SLUZBY = 'ci/AS',
    PROCES = 'ci/BP',
    ISVS = 'ci/ISVS',
    INFRASCTRUCTURES = 'ci/InfraSluzba',
    AUTORITY = 'ci/PO',
    OBJEKTY_EVIDENCIE = '',
    ATRIBUTY_OBJEKTY_EVIDENCIE = '',
    STANDARDY_ISVS = 'publicspace',
    OSOBITNE_POSTUPY = 'ci/osobitny_postup_ITVS',
    KOMISIA_NA_STANDARDIZACIU = 'standardization/groupdetail/a89f40e5-7917-46d4-9ba1-0c6eae2a5e25',
    PRACOVNE_SKUPINY_KOMISIE = 'standardization/groupslist',
    ZOZNAM_NAVRHOV = 'standardization/draftslist',
    ZOZNAM_HLASOV = 'standardization/voteslist',
    ZOZNAM_ZASADNUTI = 'standardization/meetingslist',
    TVORBA_NAVRHU = 'standardization/newdraft',
    REFERENCE_REGISTRE = 'refregisters/list',
    CISELNIKY = 'codelists/publiclist',
    CENTRALNY_DATOVY_MODEL = '',
    PRUD = '',
    JEDNOTNA_DIGITALNA_BRANA = '',
    PREHLADY = '',
    MONITORING_KS = 'monitorks',
    MONITORING_AS = 'monitoras',
    MONITORING_PARAMETRE_SET = 'monitor-report',
    NOTIFICATIONS = '/notifications',
    LICENCIE = '/howto/LICENCE.LICENCE_TITLE/LICENSE_HOWTO',
    SERVERY = '',
    VIRTUALNE_STROJE = '',
    MIESTO_PREVADZKY = '',
    NIE_SU_OVM = '',
}

export interface NavigationItem {
    title: string
    path: string
    icon?: string
    subItems?: {
        title: string
        path: string
    }[]
}
