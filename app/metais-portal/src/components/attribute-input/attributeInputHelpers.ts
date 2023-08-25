export const getDefaultValue = (fallbackValue: string, defaultValue: string | number | boolean | string[] | undefined) => {
    if (defaultValue) {
        return defaultValue.toString()
    }
    return fallbackValue
}
export const getDefaultArrayValue = (fallbackValue: string, defaultValue: string | number | boolean | string[] | undefined) => {
    if (Array.isArray(defaultValue)) {
        return defaultValue
    } else if (Array.isArray(fallbackValue)) {
        return fallbackValue
    } else {
        return []
    }
}
