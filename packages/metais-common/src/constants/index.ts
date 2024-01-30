import { TFunction } from 'i18next'

import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'

export const BASE_PAGE_NUMBER = 1
export const BASE_PAGE_SIZE = 10

export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^$/
export const REGEX_TEL = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$|^$/

export const filterKeysToSkip = new Set(['fullTextSearch', 'attributeFilters', 'sort', 'pageSize', 'pageNumber'])

export type OPERATOR_SEPARATOR_TYPE = '--'
export const OPERATOR_SEPARATOR = '--'
export const JOIN_OPERATOR = '+'

export const MAX_DYNAMIC_ATTRIBUTES_LENGHT = 10
export const DEFAULT_PAGESIZE_OPTIONS = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
]
export const ALL_EVENT_TYPES = 'All'
export const NOTIFICATION_TITLE = 'messagePerex'

export const CHANGE_OWNER_CHANGE_REASON = ['architectureChange', 'personalChange', 'othersChange']

export const CHANGE_OWNER_CHANGE_TYPE = ['changeCmdbItemAndRelatedCmdbItemsWithSameOwner', 'changeCmdbItemAndRelatedCmdbItems', 'changeCmdbItem']

export const notificationDefaultSelectedColumns = [
    { technicalName: 'deleted', name: 'Deleted', selected: false },
    { technicalName: 'eventType', name: 'EventType', selected: false },
    { technicalName: 'id', name: 'Id', selected: false },
    { technicalName: 'message', name: 'Message', selected: false },
    { technicalName: 'messagePerex', name: 'MessagePerex', selected: true },
    { technicalName: 'notifType', name: 'NotifType', selected: false },
    { technicalName: 'readedAt', name: 'ReadedAt', selected: false },
    { technicalName: 'sendToUserIdSet', name: 'SendToUserIdSet', selected: false },
    { technicalName: 'targetUri', name: 'TargetUri', selected: false },
    { technicalName: 'userId', name: 'UserId', selected: false },
    { technicalName: 'createdAt', name: 'CreatedAt', selected: true },
]

export const documentsManagementDefaultSelectedColumns = (t: TFunction<'translation', undefined, 'translation'>) => [
    { technicalName: 'id', name: 'Id', selected: false },
    { technicalName: 'state', name: t('documentsManagement.status'), selected: true },
    { technicalName: 'name', name: t('documentsManagement.name'), selected: true },
    { technicalName: 'nameEng', name: t('egov.engName'), selected: true },
    { technicalName: 'description', name: t('documentsManagement.description'), selected: false },
    { technicalName: 'descriptionEng', name: t('egov.engDescription'), selected: false },
]

export const documentsManagementGroupDocumentsDefaultSelectedColumns = (t: TFunction<'translation', undefined, 'translation'>) => [
    { technicalName: 'id', name: 'Id', selected: false },
    { technicalName: 'name', name: t('documentsManagement.name'), selected: true },
    { technicalName: 'nameEng', name: t('documentsManagement.nameEng'), selected: false },
    { technicalName: 'description', name: t('documentsManagement.description'), selected: true },
    { technicalName: 'descriptionEng', name: t('documentsManagement.descriptionEng'), selected: false },
    { technicalName: 'confluence', name: t('documentsManagement.xWiki'), selected: true },
    { technicalName: 'required', name: t('documentsManagement.required'), selected: true },
    { technicalName: 'documentGroup', name: t('documentsManagement.documentGroup'), selected: false },
    { technicalName: 'type', name: t('documentsManagement.type'), selected: false },
]

export const getProjectsFinanceManagementSelectedColumns = (t: TFunction<'translation', undefined, 'translation'>) => [
    { technicalName: 'name', name: t('projects.financeManagement.approvalProcessName'), selected: false },
    { technicalName: 'approvalProcess', name: t('projects.financeManagement.approvalProcess'), selected: true },
    { technicalName: 'min', name: t('projects.financeManagement.tableTitleMin'), selected: true },
    { technicalName: 'max', name: t('projects.financeManagement.tableTitleMax'), selected: true },
]

export const getRolesListSelectedColumns = (t: TFunction<'translation', undefined, 'translation'>) => [
    { technicalName: 'name', name: t('adminRolesPage.name'), selected: true },
    { technicalName: 'description', name: t('adminRolesPage.description'), selected: true },
    { technicalName: 'assignedGroup', name: t('adminRolesPage.group'), selected: true },
    { technicalName: 'type', name: t('adminRolesPage.systemRole'), selected: true },
]

export const projectsFinanceManagementInvestmentType = [
    { label: 'Project', value: 'c_projekt' },
    { label: 'Zmenová požiadavka', value: 'c_zmenova_poziadavka' },
]

export const ROLES_GROUP = 'SKUPINA_ROL'
export const metaisEmail = 'metais@mirri.gov.sk'

export const CAN_CREATE_GRAPH_QUERY_KEY = 'canCreateGraph'
export enum EClaimState {
    WAITING = 'WAITING',
    ACCEPTED = 'ACCEPTED',
    REFUSED = 'REFUSED',
    ALL = '',
}
export enum ReponseErrorCodeEnum {
    DEFAULT = 'default',
    GNR403 = 'gnr403',
    GNR404 = 'gnr404',
    GNR412 = 'gnr412',
    NTM01 = 'ntm01',
    GNR500 = 'gnr500',
    OPERATION_NOT_ALLOWED = 'OperationNotAllowed',
    WRONG_OLD_PASSWORD = 'WRONG_OLD_PASSWORD',
}
export const REPORTS = 'reports'
export const FIRST_PAGE_NUMBER = 1

export enum GROUP_ROLES {
    STD_PSPRE = 'STD_PSPRE',
    STD_PSPODP = 'STD_PSPODP',
    STD_PSCLEN = 'STD_PSCLEN',
    STD_PSPO = 'STD_PSPO',
    STD_PSZAST = 'STD_PSZAST',
}

export enum KSISVS_ROLES {
    STD_KSPRE = 'STD_KSPRE',
    STD_KSPODP = 'STD_KSPODP',
    STD_KSTAJ = 'STD_KSTAJ',
    STD_KSCLEN = 'STD_KSCLEN',
    STD_KOORDINATOR_AGENDY = 'STD_KOORDINATOR_AGENDY',
}
export enum RoleEnum {
    PROJEKT_SCHVALOVATEL = 'PROJEKT_SCHVALOVATEL',
}
export const KSIVS_SHORT_NAME = 'KSISVS'
export const REFID_URI_SZ = 'REFID_URI_SZ'
export const META_PREFERENCES_KEY = 'META_'
export const FILTER_LOCAL_STORAGE_KEY = 'filter_'

export const PUBLIC_ORG_CMDB_CODE = '00003010'
export const NULL = 'null'

export const USER_INFO_QUERY_KEY = 'userInfo'
export const CONFLUENCE = 'CONFLUENCE'
export const IS_KOORDINATOR = 'isKoordinator'

export enum RequestListState {
    DRAFT = 'DRAFT',
    ACCEPTED = 'ACCEPTED',
    NEW_REQUEST = 'NEW_REQUEST',
    REJECTED = 'REJECTED',
    PUBLISHED = 'PUBLISHED',
    UPDATING = 'UPDATING',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    ISVS_PROCESSING = 'ISVS_PROCESSING',
    ISVS_REJECTED = 'ISVS_REJECTED',
    ISVS_ACCEPTED = 'ISVS_ACCEPTED',
    KS_ISVS_REJECTED = 'KS_ISVS_REJECTED',
    KS_ISVS_ACCEPTED = 'KS_ISVS_ACCEPTED',
    ACCEPTED_SZZC = 'ACCEPTED_SZZC',
}

export enum CodeListFilterOnlyBase {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}
export const PORTAL_URL = import.meta.env.VITE_PORTAL_URL
export const DEFAULT_ERROR = 'Error'
export const ROLES_CAN_CHANGE_STD_DRAFTS = [KSISVS_ROLES.STD_KSPODP, KSISVS_ROLES.STD_KSPRE, KSISVS_ROLES.STD_KSTAJ]

export const STAV_REGISTRACIE = 'STAV_REGISTRACIE'
export const TYP_DATOVEHO_PRVKU = 'TYP_DATOVEHO_PRVKU'
export const STAV_PROJEKTU = 'STAV_PROJEKTU'
export const FAZA_PROJEKTU = 'FAZA_PROJEKTU'
export const CI_ITEM_QUERY_KEY = 'ciItemData'
export const REPORTS_LIST_QUERY_KEY = '/reports/list'
export const ADMIN_EGOV_ENTITY_LIST_QKEY = `/citypes/list`
export const ADMIN_EGOV_RELATION_LIST_QKEY = `/relationshiptypes/list`
export const ADMIN_EKO_LIST_QKEY = `/ekocodes`
export const HTML_TYPE = 'HTML'
export const MUK = 'muk'

export const P_REALIZUJE_AKT = 'P_realizuje_AKT'
export const ENTITY_ACTIVITY = 'Aktivita'

export const DESCRIPTION = 'Popis'

export const PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE: { [key: string]: string } = {
    'Projektový iniciálny dokument (PID)': 'projektovy_inicialny_dokument_',
    'Manažérske správy, reporty, zoznamy a požiadavky': 'manazerske_spravy_reporty_',
    'Dokumenty architektúry': 'dokumenty_architektury_',
}
export const FINISHED_STATE = 'c_stav_projektu_9'
export const RATED_STATE = 'c_stav_projektu_4'
export const NOT_APPROVED_STATE = 'c_stav_projektu_12'
export const RE_RATED_STATE = 'c_stav_projektu_11'
export const RETURNED_STATE = 'c_stav_projektu_5'

export const PROJECT_STATUS = 'EA_Profil_Projekt_status'

export const ACTION_CREATE = 'CREATE'
export const ACTION_UPDATE = 'UPDATE'
export const ENTITY_PROJECT = 'Projekt'

export const API_CALL_RETRY_COUNT = 50
export const PO_IS = 'PO_IS'
export const PO_PO = 'PO_PO'
export const PO_IS_PO = 'PO_IS_PO'
export const PO = 'PO'
export const ENTITY_KS = 'KS'
export const ENTITY_AS = 'AS'
export const ENTITY_ISVS = 'ISVS'
export const ENTITY_KONTRAKT = 'Kontrakt'
export const ENTITY_MIGRATION = 'Migracia'
export const ENTITY_INFRA_SLUZBA = 'InfraSluzba'
export const ENTITY_TRAINING = 'Training'
export const STANDARDIZATION_DRAFTS_LIST = 'draftsList'
export const REFERENCE_REGISTER = 'ReferenceRegister'

export const MAX_TITLE_LENGTH = 100
export const INVALIDATED = 'INVALIDATED'
export const DRAFT = 'DRAFT'

export const ENTITY_CIEL = 'Ciel'
export const ENTITY_KRIS = 'KRIS'
export const KRIS_stanovuje_Ciel = 'KRIS_stanovuje_Ciel'
export const ENTITY_PRINCIP = 'Princip'
export const PO_predklada_KRIS = 'PO_predklada_KRIS'
export const ENTITY_ZS = 'ZS'
export const ENTITY_AGENDA = 'Agenda'

export const INACTIVE_LOGOUT_TIME = import.meta.env.VITE_INACTIVE_LOGOUT_TIME
export const INACTIVE_WARNING_TIME = import.meta.env.VITE_INACTIVE_WARNING_TIME
export const IAM_OIDC_BASE_URL = import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL

export const ciInformationTab = 'information'
export const integrationHarmonogramTab = 'harmonogram'

export const KRIScolumnsTechNames = [
    ATTRIBUTE_NAME.Gen_Profil_nazov,
    ATTRIBUTE_NAME.Gen_Profil_kod_metais,
    ATTRIBUTE_NAME.Profil_KRIS_stav_kris,
    MetainformationColumns.OWNER,
    MetainformationColumns.LAST_MODIFIED_AT,
]
export const krisRelatedCiTabsNames = [ENTITY_KS, ENTITY_ISVS, ENTITY_PROJECT, ENTITY_ZS, ENTITY_AGENDA]
export enum ROLES {
    EA_GARPO = 'EA_GARPO',
}
export const NO_USER_COLUMNS_LS_KEY = 'METAIS_columns_noUser/'

export const CAN_CREATE_AND_EDIT_VOTES_USER_ROLES = ['STD_KSPODP', 'STD_KSPRE', 'STD_KSTAJ', 'STD_PSPRE', 'STD_PSPODP']

export const CAN_NOT_MANAGE_CI = [
    'Agenda',
    'DOCUMENT',
    'DOKUMENT',
    'DatovyPrvok',
    'DistribuciaDatasetu',
    'DokumentRefID',
    'Individuum',
    'KRIS_Protokol',
    'License',
    'OkruhZS',
    'Ontologia',
    'OvladanaPO',
    'PO',
    'ParameterKontraktu',
    'ParameterSluzby',
    'PlanKontroly',
    'ReferenceRegister',
    'ReferenceRegisterHistory',
    'ReferenceRegisterItem',
    'ReferenceRegisterItemGroup',
    'ReferenceRegisterItemSubGroup',
    'SCCMLicenses',
    'SCCMLicensesItem',
    'SccmLicense',
    'SccmLicenseItem',
    'URICiselnik',
    'URIDataset',
    'URIKatalog',
    'UVS',
    'VerziaOntologie',
    'ZC',
    'ZS',
    'FazaZivotnehoCyklu',
    'ElektronickaSchranka',
    'Endpoint',
    'OperaciaAS',
    'Ciel',
]
export const CAN_CREATE_MEETING_USER_ROLES = ['STD_KSPODP', 'STD_KSPRE', 'STD_KSTAJ', 'STD_PSPRE', 'STD_PSPODP']
export const CAN_EDIT_MEETING_USER_ROLES = ['STD_KOORDINATOR_AGENDY']
export const LOWER_CASE_NUMBER_DOT_REGEX = /^[a-z0-9.]*$/
export const SPACES_REGEX = /\s+/g
export const baseWikiUrl = import.meta.env.VITE_REST_CLIENT_WIKI_BASE_URL
export const STAV_DIZ_ENUM_CODE = 'STAV_DIZ'

export const categoryParameterMap = new Map<string, string>([
    ['AS', 'c_typ_parametra_kategoria.3'],
    ['KS', 'c_typ_parametra_kategoria.4'],
])
export const INTEGRACIA_KONZUMUJE_PROJEKT = 'Integracia_konzumuje_Projekt'
export const INTEGRACIA_VYSTAVUJE_PROJEKT = 'Integracia_vystavuje_Projekt'
export const INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM = 'edit'
export const FAZA_INTEGRACNEHO_MILNIKA = 'FAZA_INTEGRACNEHO_MILNIKA'
export const GUI_PROFILE_DIZ = 'Gui_Profil_DIZ'
export const PROVIDING_ISVS_NAME = 'providingIsvsName'
export const INTEGRACIA_Profil_Integracia_stav_diz = 'Integracia_Profil_Integracia_stav_diz'
export const Gui_Profil_DIZ_konzumujuci_projekt = 'Gui_Profil_DIZ_konzumujuci_projekt'
export const Gui_Profil_DIZ_poskytujuci_projekt = 'Gui_Profil_DIZ_poskytujuci_projekt'
export const FAZA_KONTRAKTU = 'FAZA_KONTRAKTU'
export const Profil_Kontrakt = 'Profil_Kontrakt'
export const Program_financuje_Projekt = 'Program_financuje_Projekt'
