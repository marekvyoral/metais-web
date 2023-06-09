import { getObjectPropertyByPath } from './getObjectPropertyByPath'
import { setObjectPropertyByPath } from './setObjectPropertyByPath'

/**
 * Recursive transform function, that transform name-value parirs to object
 *
 * @param {any[]} attributesArray array of attributes name-value
 * @returns {({ name: string; value: string | string[] })} object where name is key and value is value
 */
const transformAttributesArrayToObject = (attributesArray: any) => {
    if (Array.isArray(attributesArray?.[0]))
        return attributesArray.map((attributesNestedArray: any) => transformAttributesArrayToObject(attributesNestedArray))
    return Object.fromEntries(attributesArray.map((attribute: any) => [attribute.name, attribute.value]))
}

/**
 * Transform attributes array of name-value parirs to object
 *
 * @param {*} [data] data object
 * @param {string[]} attributesPaths array of paths
 * @returns {*}
 */

export const transformResponseWithAttributesToObject = (data: any, attributesPaths: string[]) => {
    if (!data) return
    const newData = data
    attributesPaths.map((attributePath) => {
        const attributesArray = getObjectPropertyByPath(data, attributePath)
        const attributesObject = transformAttributesArrayToObject(attributesArray)
        setObjectPropertyByPath(newData, attributePath, attributesObject)
    })
    return newData
}
