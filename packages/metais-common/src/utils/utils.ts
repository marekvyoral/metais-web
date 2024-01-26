import { DateTime } from 'luxon'

export const isObjectEmpty = (obj: unknown) => {
    if (obj != null && typeof obj == 'object') {
        return Object.keys(obj).length == 0
    }
    return false
}

export const cleanFileName = (fileName: string) =>
    fileName.replace(/[\u2000-\u2009\u200A-\u200D\u2060-\u2063\u180E\uFEFF\u202F\u205F\u3000]+/gu, '').replace(/[/\\?%*:|"<>]/g, '')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanObjectValues = (obj: any) => {
    for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            // Recursively call the function for nested objects
            cleanObjectValues(obj[key])

            // If the nested object becomes empty after removal, delete the key
            if (Object.keys(obj[key]).length === 0) {
                delete obj[key]
            }
        } else if (obj[key] === undefined || obj[key] === '') {
            // Delete the key if the value is undefined or an empty string
            delete obj[key]
        }
    }

    return obj
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

export const removeNullPropertiesFromRecord = (obj: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(obj).filter(([, value]) => {
            return !(value == null || value === '' || (Array.isArray(value) && value.length === 0) || isObjectEmpty(value))
        }),
    )

export const replaceDotForUnderscore = (string: string) => {
    return string.replaceAll('.', '_')
}

export const decodeHtmlEntities = (encodedString: string): string => {
    // This technique leverages the browser's built-in HTML decoding capabilities.
    const textarea = document.createElement('textarea')
    textarea.innerHTML = encodedString
    return textarea.value
}

export const removeNonDigitCharacters = (value?: number | string) => {
    return value?.toString().replace(/[^\d]+/g, '') ?? 0
}

export const protectDateFromDecrement = (date: string) => {
    return DateTime.fromJSDate(new Date(date)).toISO()
}

export const isOwnershipOnPoSide = (ownerGid: string, poUuid: string) => {
    if (ownerGid == null) {
        return false
    }
    if (ownerGid.indexOf(poUuid) != -1) {
        return true
    }
    return false
}
