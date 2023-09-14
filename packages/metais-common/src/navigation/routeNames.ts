export enum RouteNames {
    HOME = '/',
    DEV_TEST_SCREEN = 'DevTestScreen',
    PROJEKT_LIST_PAGE = '/projekt/list',
    PROJEKT_ENTITY_DETAIL = '/ci/:entityName/:projektId',
    HOW_TO_PUBLIC_AUTHORITIES = 'howto/CMBD.PUBLIC_AUTHORITIES/PUBLIC_AUTHORITIES_HOWTO',
    HOW_TO_EGOV_COMPONENTS = 'howto/CMDB.EGOV_TITLE/EGOV_HOWTO',
    HOW_TO_STANDARDIZATION = 'howto/STANDARD.PROCESS/STD_HOWTO',
    HOW_TO_CODELIST = 'howto/CODELIST.CODELIST/CODELISTS_HOWTO',
    HOW_TO_MONITORING = 'howto/MONITORING.MONITORING/MONITORING_HOWTO',
    //not found on metais
    HOW_TO_DATA_OBJECTS = 'howto/DATA.DATA_OBJECTS/DO_HOWTO',
    PREHLADY_A_POSTUPY = 'tutorial',
    DOCUMENTS_LIST_TAB = '/ci/:entityName/:entityId/documents',
    RELATIONSHIPS_LIST_TAB = '/ci/:entityName/:entityId/relationships',
    TASKS = '/ulohy',
    CODELISTS = '/codelists',
    REPORTS = 'reports/',
}

export enum AdminRouteNames {
    HOME = '/',
    DASHBOARD = 'dashboard',
    ASSIGNMENT = 'assignment',
    NOTIFICATIONS = 'notifications',
    SETTINGS = 'settings',
    EKO = '/eko',
    USER_MANAGEMENT = '/managementList',
    REQUEST_LIST = '/managementList/requestList',
    GDPR_REQUEST_LIST = '/managementList/gdprRequestList',
    REGISTRATION_REQUEST_LIST = '/managementList/registrationRequestList',
    EGOV = '/egov',
    EGOV_ENTITY = '/egov/entity',
    EGOV_PROFILE = '/egov/profile',
    EGOV_RELATION = '/egov/relation',
    TOOLTIPS = '/tooltips',
    ROLE_USERS = '/egov/roles/users',
    ROLE_EDIT = '/egov/roles/edit',
    ROLE_NEW = '/egov/roles/create',
    ROLES = '/egov/roles',
    ORGANIZATIONS = 'organizations/',
    CODELISTS = 'codelists-management/',
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
    OBJEKTY_EVIDENCIE = 'todo',
    ATRIBUTY_OBJEKTY_EVIDENCIE = 'todo',
    STANDARDY_ISVS = 'publicspace',
    OSOBITNE_POSTUPY = 'ci/osobitny_postup_ITVS',
    PRACOVNE_SKUPINY_KOMISIE = '/standardization/groupslist',
    PRACOVNA_SKUPINA_DETAIL = '/standardization/groupslist/:groupId',
    PRACOVNA_SKUPINA_CREATE = '/standardization/groupslist/create',
    PRACOVNA_SKUPINA_EDIT = '/standardization/groupslist/:groupId/edit',
    ZOZNAM_NAVRHOV = 'standardization/draftslist',
    ZOZNAM_HLASOV = 'standardization/voteslist',
    ZOZNAM_ZASADNUTI = 'standardization/meetingslist',
    TVORBA_NAVRHU = 'standardization/newdraft',
    REFERENCE_REGISTRE = 'refregisters/list',
    CISELNIKY = 'codelists/list',
    PUBLIKOVANE_CISELNIKY = 'codelists/publiclist',
    CENTRALNY_DATOVY_MODEL = 'todo',
    PRUD = 'todo',
    JEDNOTNA_DIGITALNA_BRANA = 'todo',
    PREHLADY = 'todo',
    MONITORING_KS = 'monitorks',
    MONITORING_AS = 'monitoras',
    MONITORING_PARAMETRE_SET = 'monitor-report',
    NOTIFICATIONS = '/notifications',
    LICENCIE = '/howto/LICENCE.LICENCE_TITLE/LICENSE_HOWTO',
    SERVERY = 'todo',
    VIRTUALNE_STROJE = 'todo',
    MIESTO_PREVADZKY = 'todo',
    NIE_SU_OVM = 'todo',
}

export interface NavigationSubItem {
    title: string
    path: string
    isLoginRequired?: boolean
    subItems?: NavigationSubItem[]
}

export interface NavigationItem {
    title: string
    path: string
    icon?: string
    subItems?: NavigationSubItem[]
}
