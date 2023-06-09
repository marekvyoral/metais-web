export const getObjectPropertyByPath = (object: any, path: string) => {
    if (object == null) {
        return object
    }
    const parts = path.split('.')
    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i]
        if (object == null) {
            return undefined
        }
        // handle array in path
        else if (part === '0') {
            return object.map((arrayItem: any) => getObjectPropertyByPath(arrayItem, parts.slice(i + 1).join('.')))
        } else object = object[part]
    }
    return object
}
