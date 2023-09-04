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

export const ROLES_GROUP = 'SKUPINA_ROL'
export const metaisEmail = 'metais@mirri.gov.sk'
