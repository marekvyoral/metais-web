// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setObjectPropertyByPath = (object: any, path: string, value: any) => {
    const parts = path.split('.')
    const limit = parts.length - 1
    parts
    for (let i = 0; i < limit; ++i) {
        const key = parts[i]
        if (parts?.[i + 1] === '0') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value.map((nesttedValue: any, index: number) => {
                setObjectPropertyByPath(object[key][index], parts.slice(i + 2).join('.'), nesttedValue)
            })
            return
        }
        object = object[key] ?? (object[key] = {})
    }
    const key = parts[limit]
    object[key] = value
}
