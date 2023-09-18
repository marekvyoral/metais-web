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

export const KSIVS_SHORT_NAME = 'KSISVS'
export const FILTER_LOCAL_STORAGE_KEY = 'filter_'
