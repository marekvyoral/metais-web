export const getDefaultValue = (fallbackValue: string, defaultValue: string | number | boolean | string[] | undefined, isUpdate?: boolean) => {
    if (defaultValue) {
        return defaultValue.toString()
    } else if (!isUpdate) {
        return fallbackValue
    } else {
        return ''
    }
}
export const getDefaultArrayValue = (fallbackValue: string, defaultValue: string | number | boolean | string[] | undefined, isUpdate?: boolean) => {
    if (Array.isArray(defaultValue)) {
        return defaultValue
    } else if (Array.isArray(fallbackValue) && !isUpdate) {
        return fallbackValue
    } else {
        return []
    }
}
