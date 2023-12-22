import { DateTime } from 'luxon'

export const isObjectEmpty = (obj: unknown) => {
    if (obj != null && typeof obj == 'object') {
        return Object.keys(obj).length == 0
    }
    return false
}

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
