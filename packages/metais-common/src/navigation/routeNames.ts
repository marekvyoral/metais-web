export enum RouteNames {
    HOME = '/',
    DEV_TEST_SCREEN = '/DevTestScreen',
    PROJEKT_LIST_PAGE = '/projekt/list',
    PROJEKT_ENTITY_DETAIL = '/ci/:entityName/:projektId',
    HOW_TO_PUBLIC_AUTHORITIES = '/howto/CMBD.PUBLIC_AUTHORITIES/PUBLIC_AUTHORITIES_HOWTO',
    HOW_TO_EGOV_COMPONENTS = '/howto/CMDB.EGOV_TITLE/EGOV_HOWTO',
    HOW_TO_STANDARDIZATION = '/howto/STANDARD.PROCESS/STD_HOWTO',
    HOW_TO_CODELIST = '/howto/CODELIST.CODELIST/CODELISTS_HOWTO',
    HOW_TO_MONITORING = '/howto/MONITORING.MONITORING/MONITORING_HOWTO',
    HOW_TO_PO = '/howto/CMDB.OVM_TITLE/PO_HOWTO',
    HOW_TO_KRIS_STUDIES_PROJECTS = '/howto/KRIS.TITLE/SPK_HOWTO',
    HOW_TO_REFERENCE_IDENTIFIERS = '/howto/URI.URI/URI_HOWTO',
    //not found on metais
    HOW_TO_DATA_OBJECTS = '/howto/DATA.DATA_OBJECTS/DO_HOWTO',
    PREHLADY_A_POSTUPY = '/tutorial',
    DOCUMENTS_LIST_TAB = '/ci/:entityName/:entityId/documents',
    RELATIONSHIPS_LIST_TAB = '/ci/:entityName/:entityId/relationships',
    TASKS = '/ulohy',
    CODELISTS = '/codelists',
    USER_PROFILE = '/userprofile',
    REPORTS = '/reports',
    GLOBAL_SEARCH = '/global/search',
    MEDIA_WIKI = '/media-wiki',
    CONTACT = '/contact',
}

export enum AdminRouteNames {
    HOME = '/',
    DASHBOARD = '/dashboard',
    ASSIGNMENT = '/assignment',
    NOTIFICATIONS = '/notifications',
    SETTINGS = '/userprofile',
    EKO = '/eko',
    USERS = '/managementList',
    USER_MANAGEMENT = '/user-management',
    REQUEST_LIST_ALL = '/managementList/requestListAll',
    EGOV = '/egov',
    EGOV_ENTITY = '/egov/entity',
    EGOV_PROFILE = '/egov/profile',
    EGOV_RELATION = '/egov/relation',
    TOOLTIPS = '/tooltips',
    ROLE_USERS = '/egov/roles/users',
    ROLE_EDIT = '/egov/roles/edit',
    ROLE_NEW = '/egov/roles/create',
    ROLES = '/egov/roles',
    ORGANIZATIONS = '/organizations',
    CODELISTS = '/codelists-management',
    MONITORING = '/monitoring',
    MONITORING_PARAMS = '/monitoring/params',
    MONITORING_LIST = '/monitoring/list',
    REPORTS_MANAGEMENT = '/reports-management',
    PROJECTS_MANAGEMENT = '/projects',
    PROJECTS_FINANCE_MANAGEMENT = '/projects/finance-management',
    DOCUMENTS_MANAGEMENT = '/projects/documents',
    TEMPLATE_REFERENCE_IDENTIFIERS = '/template-reference-identifiers',
}

export enum NavigationSubRoutes {
    HOW_TO_REFERENCE_REGISTERS = '/howto/REFERENCE.REFERENCE/REF_REG_HOWTO',
    TASK_DETAIL = '/ulohy/:taskId',
    PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS = '/ci/PO_IS',
    KRIT = '/kr/list',
    SUBORDINATES = '/ci/PO_PO',
    NOT_OVM = '/ci/PO_IS_PO',
    PRINCIP = '/ci/Princip',
    CIEL = '/ci/Ciel',
    AKTIVITA = '/ci/aktivita',
    PROGRAM = '/ci/Program',
    PROJEKT = '/ci/Projekt',
    KONCOVE_SLUZBY = '/ci/KS',
    APLIKACNE_SLUZBY = '/ci/AS',
    PROCES = '/ci/BP',
    ISVS = '/ci/ISVS',
    INFRASCTRUCTURES = '/ci/InfraSluzba',
    AUTORITY = '/ci/PO',
    OBJEKTY_EVIDENCIE = '/todo',
    ATRIBUTY_OBJEKTY_EVIDENCIE = '/todo',
    STANDARDY_ISVS = '/publicspace',
    OSOBITNE_POSTUPY = '/ci/osobitny_postup_ITVS',
    PRACOVNE_SKUPINY_KOMISIE = '/standardization/groupslist',
    PRACOVNA_SKUPINA_DETAIL = '/standardization/groupslist',
    PRACOVNA_SKUPINA_CREATE = '/standardization/groupslist/create',
    PRACOVNA_SKUPINA_EDIT = '/standardization/groupslist',
    ZOZNAM_NAVRHOV = '/standardization/draftslist',
    ZOZNAM_HLASOV = '/standardization/voteslist',
    ZOZNAM_ZASADNUTI = '/standardization/meetingslist',
    TVORBA_NAVRHU = '/standardization/newdraft',
    REFERENCE_REGISTRE = '/refregisters/list',
    CISELNIKY = '/codelists/list',
    PUBLIKOVANE_CISELNIKY = '/codelists/publiclist',
    CENTRALNY_DATOVY_MODEL = '/todo',
    PRUD = '/todo',
    JEDNOTNA_DIGITALNA_BRANA = '/todo',
    MONITORING_KS = '/monitorks',
    MONITORING_AS = '/monitoras',
    MONITORING_PARAMETRE_SET = '/monitor-report',
    MONITORING_IMPORT = '/todo',
    NOTIFICATIONS = '/notifications',
    LICENCIE = '/howto/LICENCE.LICENCE_TITLE/LICENSE_HOWTO',
    SERVERY = '/servers',
    VIRTUALNE_STROJE = '/virtual-machines',
    MIESTO_PREVADZKY = '/ci/MiestoPrevadzky',
    PUBLIC_AUTHORITY_HIERARCHY = '/po-table',
    REFERENCE_REGISTERS_REQUESTS = '/todo',
    CODELIST_REQUESTS = '/todo',
    IDENTIFIERS_REQUESTS = '/uri/list/sent',
    IDENTIFIERS_LIST = '/uri/list/accepted',
    WEBOVE_SIDLO_AND_MOBILE_APPS = '/todo',
    OVERVIEWS = '/overviews',
    EDUCATIONAL_COURSES = '/courses',
    RELATIONS_INSPECTION = '/relations-inspection',
    ARCHITECTONIC_REPOSITORY = '/architectonic-repository',
    TOTAL_COST_OF_OWNERSHIP = '/howto/TCO.TCO_TOTAL_OWNERSHIP_COSTS/TOTAL_OWNERSHIP_COSTS_HOWTO',
    SERVICE_LEVEL_AGREEMENTS_WITH_OPERATOR = '/sla-contract-list',
    INTEGRATION_AGREEMENTS_ON_SERVICE_LEVEL = '/isla-contract-list',
    PERSONAL_PROCEDURES = '/personal-procedures',
}

export enum AdminRouteRoles {
    ADMIN = 'R_ADMIN',
    HKO = 'R_HKO',
    METAIS = 'R_METAIS',
    LM = 'LIC_LM_UPVII',
    GDPR = 'GDPR',
    STD_KA = 'STD_KOORDINATOR_AGENDY',
}
export interface NavigationSubItem {
    title: string
    path: string
    isLoginRequired?: boolean
    subItems?: NavigationSubItem[]
    role?: AdminRouteRoles[]
}

export interface NavigationItem {
    title: string
    path: string
    icon?: string
    subItems?: NavigationSubItem[]
    role?: AdminRouteRoles[]
}

export enum FooterRouteNames {
    ACCESSIBILITY_DECLARATION = '/technical/declaration',
    WEB_RESIDENCY_MAP = '/sitemap',
    GDPR_AND_COOKIES = '/cookies/info',
    TECHNICAL_OPERATOR = '/technical/help',
    CONTENT_ADMIN = '/technical/manager',
    RSS = '/rss',
    IDSK_DIZAJN = '/#',
}
