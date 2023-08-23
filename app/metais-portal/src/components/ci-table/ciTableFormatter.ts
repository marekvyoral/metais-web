import { formatToDateTime, isValidDate } from '@isdd/metais-common/index'

export const formatLabelByAttribute = (value: string, defaultString: string) => {
    if (!value) return ''
    if (isValidDate(value)) return formatToDateTime(value)
    return defaultString
}
