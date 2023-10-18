import { DateTime } from 'luxon'

export const formatDateForDefaultValue = (date: string, format = 'yyyy-MM-dd') => {
    return DateTime.fromJSDate(new Date(date)).toFormat(format)
}

export const formatDateTimeForDefaultValue = (date: string, format = 'yyyy-MM-dd HH:mm') => {
    return DateTime.fromJSDate(new Date(date)).toFormat(format)
}
