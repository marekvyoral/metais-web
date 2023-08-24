import { DateTime } from 'luxon'

export const formatDateForDefaultValue = (date: string) => {
    return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd')
}
