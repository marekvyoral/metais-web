export const BASE_PAGE_NUMBER = 1
export const BASE_PAGE_SIZE = 10

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

export const documentsManagementDefaultSelectedColumns = [
    { technicalName: 'id', name: 'Id', selected: false },
    { technicalName: 'name', name: 'Name', selected: true },
    { technicalName: 'nameEng', name: 'NameEng', selected: true },
    { technicalName: 'description', name: 'Description', selected: false },
    { technicalName: 'descriptionEng', name: 'DescriptionEng', selected: false },
    { technicalName: 'state', name: 'State', selected: true },
]

export const documentsManagementGroupDocumentsDefaultSelectedColumns = [
    { technicalName: 'id', name: 'Id', selected: false },
    { technicalName: 'name', name: 'Name', selected: true },
    { technicalName: 'nameEng', name: 'NameEng', selected: false },
    { technicalName: 'description', name: 'Description', selected: true },
    { technicalName: 'descriptionEng', name: 'DescriptionEng', selected: false },
    { technicalName: 'confluence', name: 'Confluence', selected: true },
    { technicalName: 'required', name: 'Required', selected: true },
    { technicalName: 'documentGroup', name: 'Document group', selected: false },
    { technicalName: 'type', name: 'Type', selected: false },
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
    GNR412 = 'gnr412',
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
}
export enum RoleEnum {
    PROJEKT_SCHVALOVATEL = 'PROJEKT_SCHVALOVATEL',
}
export const KSIVS_SHORT_NAME = 'KSISVS'
export const META_PREFERENCES_KEY = 'META_'
export const FILTER_LOCAL_STORAGE_KEY = 'filter_'

export const PUBLIC_ORG_CMDB_CODE = '00003010'
export const NULL = 'null'

export const USER_INFO_QUERY_KEY = 'userInfo'

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

export const STAV_PROJEKTU = 'STAV_PROJEKTU'
export const FAZA_PROJEKTU = 'FAZA_PROJEKTU'
export const CI_ITEM_QUERY_KEY = 'ciItemData'
export const REPORTS_LIST_QUERY_KEY = '/reports/list'
export const ADMIN_EGOV_ENTITY_LIST_QKEY = `/citypes/list`
export const ADMIN_EGOV_RELATION_LIST_QKEY = `/relationshiptypes/list`
export const ADMIN_EKO_LIST_QKEY = `/ekocodes`
export const phoneOrEmptyStringRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$|^$/
export const HTML_TYPE = 'HTML'

export const P_REALIZUJE_AKT = 'P_realizuje_AKT'
export const ACTIVITY = 'Aktivita'

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
export const ENTITY_MIGRATION = 'Migracia'
