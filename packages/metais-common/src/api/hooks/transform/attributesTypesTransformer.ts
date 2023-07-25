const KEY_VALUE_OBJECT = { type: 'object' }

interface Properties {
    attributes: {
        type: string
    }
}

interface InputSchema {
    components: {
        schemas: {
            ConfigurationItemUi: {
                properties: Properties
            }
        }
    }
}

const retypeAttributesArrayToObject = (attributesParent: Properties) => {
    attributesParent.attributes = KEY_VALUE_OBJECT
}

/**
 * Transformer function for orval.
 *
 * @param {InputSchema} inputSchema
 * @return {InputSchema}
 */
export const transformAttributeSchema = (inputSchema: InputSchema) => {
    const schemas = inputSchema.components.schemas
    retypeAttributesArrayToObject(schemas.ConfigurationItemUi.properties)
    return inputSchema
}

module.exports = transformAttributeSchema
