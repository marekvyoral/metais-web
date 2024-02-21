import { DateTime } from 'luxon'

export const formatDateForDefaultValue = (date: string, format = 'yyyy-MM-dd') =>
    DateTime.fromJSDate(new Date(date)).isValid ? DateTime.fromJSDate(new Date(date)).toFormat(format) : ''

export const formatDateTimeForDefaultValue = (date: string, format = 'yyyy-MM-dd HH:mm') =>
    DateTime.fromJSDate(new Date(date)).isValid ? DateTime.fromJSDate(new Date(date)).toFormat(format) : ''

export const formatDateTimeToIs = (date: string, format = 'yyyy-MM-dd HH:mm') =>
    DateTime.fromJSDate(new Date(date)).isValid ? DateTime.fromJSDate(new Date(date)).toFormat(format) : ''

export const formatDateToIso = (date: Date | string | undefined) => {
    if (!date) return undefined
    if (typeof date === 'string') return DateTime.fromJSDate(new Date(date)).toISO() || undefined
    return DateTime.fromJSDate(date).toISO() || undefined
}
