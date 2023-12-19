import { DateTime } from 'luxon'

export const isObjectEmpty = (obj: unknown) => {
    if (obj != null && typeof obj == 'object') {
        return Object.keys(obj).length == 0
    }
    return false
}

export const formatNumberWithSpaces = (value: string) => {
    const formatted = value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return formatted
}

export const isDate = (value: unknown): value is Date => {
    return value instanceof Date && DateTime.fromJSDate(new Date(value)).isValid
}

export const isFalsyStringValue = (value: unknown): boolean => {
    return value === '0' || value === 'false' || value === 'FALSE'
}

export const getRoleUuidFromGid = (gid: string) => {
    return gid.substring(0, 36)
}

export const getOrgIdFromGid = (gid: string) => {
    return gid.substring(37)
}
