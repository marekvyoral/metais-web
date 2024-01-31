import { DateTime } from 'luxon'

export const formatDateForDefaultValue = (date: string, format = 'yyyy-MM-dd') =>
    DateTime.fromJSDate(new Date(date)).isValid ? DateTime.fromJSDate(new Date(date)).toFormat(format) : ''

export const formatDateTimeForDefaultValue = (date: string, format = 'yyyy-MM-dd HH:mm') =>
    DateTime.fromJSDate(new Date(date)).isValid ? DateTime.fromJSDate(new Date(date)).toFormat(format) : ''

export const formatDateToIso = (date: string | undefined) => {
    if (!date) return undefined
    return DateTime.fromJSDate(new Date(date)).toISO() || undefined
}
