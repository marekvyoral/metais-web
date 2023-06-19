import { AttributeUi } from '@/api'

export type AttributeValue = string | number | boolean | string[]
interface TransformedInterface {
    [key: string]: AttributeValue
}

export type Attributes = {
    name: string
    value: AttributeValue
}
export interface AttributesParent {
    attributes?: Attributes[] | TransformedInterface | AttributeUi[]
}

/**
 * Recursive transform function, that transform name-value parirs to object
 *
 * @param {Attributes} attributesArray array of attributes name-value
 * @returns {(TransformedInterface)} object where name is key and value is value
 */
const transformAttributesArrayToObject = (attributesArray: Attributes[]): TransformedInterface => {
    return Object.fromEntries(attributesArray.map((attribute: TransformedInterface) => [attribute.name, attribute.value]))
}

/**
 * Transform attributes array of name-value parirs to object
 *
 * @param {AttributesParent} [data] data object
 * @param {string[]} attributesPaths array of paths
 */
export const transformAttributesKeyValue = (data?: AttributesParent) => {
    if (data?.attributes) {
        data.attributes = transformAttributesArrayToObject(data.attributes as Attributes[])
    }
}
