export const isObjectEmpty = (obj: unknown) => {
    if (obj != null && typeof obj == 'object') {
        return Object.keys(obj).length == 0
    }
    return false
}
