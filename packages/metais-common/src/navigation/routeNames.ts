export enum RouteNames {
    HOME = '/',
    DEV_TEST_SCREEN = '/DevTestScreen',
    PROJEKT_LIST_PAGE = '/projekt/list',
    PROJEKT_ENTITY_DETAIL = '/ci/:entityName/:projektId',
    HOW_TO_PUBLIC_AUTHORITIES = '/howto/PUBLIC_AUTHORITIES_HOWTO',
    HOW_TO_EGOV_COMPONENTS = '/howto/EGOV_HOWTO',
    HOW_TO_STANDARDIZATION = '/howto/STD_HOWTO',
    HOW_TO_CODELIST = '/howto/CODELISTS_HOWTO',
    HOW_TO_MONITORING = '/howto/MONITORING_HOWTO',
    HOW_TO_PO = '/howto/PO_HOWTO',
    HOW_TO_KRIS_STUDIES_PROJECTS = '/howto/SPK_HOWTO',
    HOW_TO_REFERENCE_IDENTIFIERS = '/howto/URI_HOWTO',
    HOW_TO_PROGRAMS_PROJECTS_ACTIVITIES = '/howto/PROGRAMS_PROJECTS_ACTIVITIES',
    HOW_TO_DATA_OBJECTS = '/howto/SDO_HOWTO',
    PREHLADY_A_POSTUPY = '/help',
    DOCUMENTS_LIST_TAB = '/ci/:entityName/:entityId/documents',
    RELATIONSHIPS_LIST_TAB = '/ci/:entityName/:entityId/relationships',
    TASKS = '/ulohy',
    USER_PROFILE = '/userprofile',
    REPORTS = '/reports',
    MONITORING_SERVICES = '/monitoring/services',
    REFERENCE_REGISTERS = '/refregisters',
    GLOBAL_SEARCH = '/global/search',
    MEDIA_WIKI = '/media-wiki',
    CONTACT = '/contact',
}

export enum RouterRoutes {
    HOME = '/',
    IDENTITY_TERMS = '/IdentityTerms',
    CI_DETAIL = '/ci/:entityName/:entityId',
    CI_CREATE = '/ci/:entityName/create',
    CI_EDIT = '/ci/:entityName/:entityId/edit',
    CI_CLONE = '/ci/:entityName/:entityId/clone',
    CI_CREATE_ITEM_RELATION = 'ci/:entityName/:entityId/new-ci/:tabName',
    CI_CREATE_RELATION = 'ci/:entityName/:entityId/new-relation/:tabName',
    DEV_TEST_SCREEN = '/DevTestScreen',
    CI_LIST = '/ci/:entityName',
    DOCUMENTS_OUTLET = 'documents',
    RELATIONSHIPS_OUTLET = 'relationships',
    ACTIVITIES_OUTLET = 'activities',
    GOALS_OUTLET = 'goals',
    TASKS_OUTLET = 'tasks',
    EVALUATION_OUTLET = 'evaluation',
    HISTORY_OUTLET = 'history',
    HISTORY_CHANGES_OUTLET = 'historyChanges',
    HISTORY_COMPARE_SINGLE_ITEM = '/ci/:entityName/:entityId/history/:firstId',
    HISTORY_COMPARE_TWO_ITEMS = '/ci/:entityName/:entityId/history/:firstId/:secondId',
    USER_PROFILE = '/userprofile',
    TASK_DETAIL = '/ulohy/:taskId',
    TASKS = '/ulohy',
    STANDARDIZATION_VOTE_LIST = '/standardization/voteslist',
    STANDARDIZATION_VOTE_DETAIL = '/standardization/voteslist/:voteId',
    STANDARDIZATION_VOTE_EDIT = '/standardization/voteslist/:voteId/edit',
    STANDARDIZATION_VOTE_CREATE = '/standardization/voteslist/create',
    STANDARDIZATION_MEETINGS_LIST = '/standardization/meetingslist',
    STANDARDIZATION_MEETINGS_DETAIL = '/standardization/meetingslist/:meetingId',
    STANDARDIZATION_MEETINGS_EDIT = '/standardization/meetingslist/:meetingId/edit',
    STANDARDIZATION_MEETINGS_CREATE = '/standardization/meetingslist/create',
    STANDARDIZATION_GROUPS_LIST = '/standardization/groupslist',
    STANDARDIZATION_GROUPS_DETAIL = '/standardization/groupslist/:groupId',
    STANDARDIZATION_GROUPS_EDIT = '/standardization/groupslist/:groupId/edit',
    STANDARDIZATION_GROUPS_CREATE = '/standardization/groupslist/create',
    STANDARDIZATION_DRAFTS_LIST = '/standardization/draftslist',
    STANDARDIZATION_DRAFTS_DETAIL = '/standardization/draftslist/:entityId',
    STANDARDIZATION_DRAFTS_EDIT = '/standardization/draftslist/:entityId/edit',
    STANDARDIZATION_DRAFTS_CREATE = '/standardization/draftslist/create',
    REPORTS_LIST = '/reports',
    MONITORING_SERVICES = '/monitoring/services',
    REPORTS_DETAIL = '/reports/:entityId',
    REPORTS_CREATE = '/reports/create',
    RELATIONS = '/relation/:entityName/:entityId/:relationshipId',
    REGISTRATION = '/registration',
    REGISTRATION_SUCCESS = '/registration/success',
    REGISTRATION_FAILED = '/registration/failed',
    PUBLIC_SPACE = '/publicspace',
    PUBLIC_AUTHORITIES_HIERARCHY = '/public-authorities-hierarchy',
    NOTIFICATIONS = '/notifications',
    NOTIFICATIONS_DETAIL = '/notifications/:id',
    HOW_TO_GENERAL_PAGE = '/howto/*',
    HOW_TO_GENERIC_PAGE = '/howto/:howToEnumType',
    HOW_TO_MONITORING_PAGE = '/howto/MONITORING_HOWTO',
    HELP = '/help',
    GLOBAL_SEARCH = '/global/search',
    DATA_OBJECT_CODE_LIST = 'data-objects/codelists',
    DATA_OBJECT_CODE_LIST_DETAIL = 'data-objects/codelists/:id',
    DATA_OBJECT_CODE_LIST_EDIT = 'data-objects/codelists/:id/edit',
    DATA_OBJECT_REQUESTS_LIST = 'data-objects/requestlist',
    DATA_OBJECT_REQUESTS_DETAIL = 'data-objects/requestlist/:requestId',
    DATA_OBJECT_REQUESTS_EDIT = 'data-objects/requestlist/:requestId/edit',
    DATA_OBJECT_REQUESTS_CREATE = 'data-objects/requestlist/create',
    REF_REGISTERS_LIST = '/refregisters',
    REF_REGISTERS_DETAIL = '/refregisters/:entityId',
    REF_REGISTERS_EDIT = '/refregisters/:entityId/edit',
    REF_REGISTERS_CREATE = '/refregisters/create',
    REF_REGISTERS_HISTORY_COMPARE_SINGLE_ITEM = '/refregisters/:entityId/history/:firstId',
    REF_REGISTERS_HISTORY_COMPARE_TWO_ITEMS = '/refregisters/:entityId/history/:firstId/:secondId',
    CI_PROJECT_DETAIL = 'ci/Projekt/:entityId',
    CI_PROJECT_CREATE = 'ci/Projekt/create',
    CI_PROJECT_EDIT = 'ci/Projekt/:entityId/edit',
    CI_PO_PO = 'ci/PO_PO',
    CI_PO_IS = 'ci/PO_IS',
    CI_PO_IS_PO = 'ci/PO_IS_PO',
    CI_PO_PO_DETAIL = 'ci/PO_PO/:entityId',
    CI_PO_IS_DETAIL = 'ci/PO_IS/:entityId',
    CI_PO_IS_PO_DETAIL = 'ci/PO_IS_PO/:entityId',
    CI_PRINCIPLE_DETAIL = 'ci/Princip/:entityId',
    CI_PRINCIPLE_CREATE = 'ci/Princip/create',
    CI_GOAL_DETAIL = 'ci/Ciel/:entityId',
    CI_GOAL_CREATE = 'ci/Ciel/create',
    CI_ACTIVITY_DETAIL = 'ci/Aktivita/:entityId',
    CI_KRIS_LIST = 'ci/KRIS',
    CI_ACTIVITY_CREATE = 'ci/Aktivita/:create',
    CI_KRIS_DETAIL = 'ci/Kris/:entityId',
    CI_KRIS_CREATE = 'ci/Kris/create',
    CI_KS_DETAIL = 'ci/KS/:entityId',
    CI_KS_CREATE = 'ci/KS/create',
    CI_AS_DETAIL = 'ci/AS/:entityId',
    CI_AS_CREATE = 'ci/AS/create',
    ITVS_EXCEPTIONS_CREATE = 'ci/OsobitnyPostup/create',
    ITVS_EXCEPTIONS_EDIT = 'ci/OsobitnyPostup/:entityId/edit',
    PROV_INTEGRATION_LIST = '/prov-integration/list',
    PROV_INTEGRATION_CREATE = '/prov-integration/create',
}

export enum AdminRouteNames {
    HOME = '/',
    DASHBOARD = '/dashboard',
    ASSIGNMENT = '/assignment',
    NOTIFICATIONS = '/notifications',
    SETTINGS = '/userprofile',
    EKO = '/eko',
    USER_MANAGEMENT = '/managementList',
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
    PUBLIC_AUTHORITIES = '/public-authorities',
    PUBLIC_AUTHORITIES_LIST = '/public-authorities/list',
    PUBLIC_AUTHORITIES_FIND = '/public-authorities/find',
    PUBLIC_AUTHORITIES_MASS_UPDATE = '/public-authorities/mass-update',
    CODELISTS = '/codelists-management',
    MONITORING = '/monitoring',
    MONITORING_PARAMS = '/monitoring/params',
    MONITORING_LIST = '/monitoring/list',
    MONITORING_CREATE = '/monitoring/create',
    MONITORING_EDIT = '/monitoring/edit',
    MONITORING_DETAIL = '/monitoring/detail',
    REPORTS_MANAGEMENT = '/reports-management',
    PROJECTS_MANAGEMENT = '/projects',
    PROJECTS_FINANCE_MANAGEMENT = '/projects/finance-management',
    DOCUMENTS_MANAGEMENT = '/projects/documents',
    TEMPLATE_REFERENCE_IDENTIFIERS = '/template-reference-identifiers',
}

export enum NavigationSubRoutes {
    HOW_TO_REFERENCE_REGISTERS = '/howto/REF_REG_HOWTO',
    TASK_DETAIL = '/ulohy/:taskId',
    PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS = '/ci/PO_IS',
    KRIT = '/ci/KRIS',
    SUBORDINATES = '/ci/PO_PO',
    NOT_OVM = '/ci/PO_IS_PO',
    PRINCIP = '/ci/Princip',
    CIEL = '/ci/Ciel',
    AKTIVITA = '/ci/Aktivita',
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
    ZOZNAM_HLASOV_DETAIL = '/standardization/voteslist',
    ZOZNAM_HLASOV_EDIT = '/standardization/voteslist',
    ZOZNAM_HLASOV_CREATE = '/standardization/voteslist/create',
    ZOZNAM_ZASADNUTI = '/standardization/meetingslist',
    ZOZNAM_ZASADNUTI_CREATE = '/standardization/meetingslist/create',
    ZOZNAM_ZASADNUTI_DETAIL = '/standardization/meetingslist',
    TVORBA_NAVRHU = '/standardization/newdraft',
    REFERENCE_REGISTRE = '/refregisters',
    CODELIST = '/data-objects/codelists',
    REQUESTLIST = '/data-objects/requestlist',
    CENTRALNY_DATOVY_MODEL = '/todo',
    PRUD = '/todo',
    JEDNOTNA_DIGITALNA_BRANA = '/todo',
    MONITORING_KS = '/monitorks',
    MONITORING_AS = '/monitoras',
    MONITORING_PARAMETRE_SET = '/monitor-report',
    MONITORING_IMPORT = '/todo',
    NOTIFICATIONS = '/notifications',
    LICENCIE = '/howto/LICENSE_HOWTO',
    SERVERY = '/servers',
    WEBOVE_SIDLO = '/ci/WeboveSidlo',
    VIRTUALNE_STROJE = '/virtual-machines',
    MIESTO_PREVADZKY = '/ci/MiestoPrevadzky',
    PUBLIC_AUTHORITY_HIERARCHY = '/public-authorities-hierarchy',
    REFERENCE_REGISTERS_REQUESTS = '/refregisters/requests',
    IDENTIFIERS_REQUESTS = '/uri/list/sent',
    IDENTIFIERS_LIST = '/uri/list/accepted',
    OVERVIEWS = '/overviews',
    EDUCATIONAL_COURSES = '/courses',
    RELATIONS_INSPECTION = '/relations-inspection',
    ARCHITECTONIC_REPOSITORY = '/architectonic-repository',
    TOTAL_COST_OF_OWNERSHIP = '/howto/TOTAL_OWNERSHIP_COSTS_HOWTO',
    SERVICE_LEVEL_AGREEMENTS_WITH_OPERATOR = '/sla-contract-list',
    INTEGRATION_AGREEMENTS_ON_SERVICE_LEVEL = '/isla-contract-list',
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
    IDSK_DIZAJN = 'https://idsk.gov.sk',
    EXCEPTIONS_LEGISLATION = '/ci/OsobitnyPostup',
}

export enum RegistrationRoutes {
    REGISTRATION = '/registration',
    REGISTRATION_SUCCESS = '/registration/success',
    REGISTRATION_FAILED = '/registration/failed',
}

export const LoginRouteNames = {
    LOGIN_PROBLEMS: '/login-problems',
    FORGOTTEN_PASSWORD: '/forgotten-password',
}

export const SLARouteNames = {
    SLAParamsList: '/sla-params-list/:entityName',
}
