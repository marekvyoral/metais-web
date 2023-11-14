export function filterObjectByValue(obj: { [key: string]: string }, valueToKeep: string): { [key: string]: string } {
    const filteredObject: { [key: string]: string } = {}

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if (obj[key] === valueToKeep) {
                filteredObject[key] = obj[key]
            }
        }
    }

    return filteredObject
}
