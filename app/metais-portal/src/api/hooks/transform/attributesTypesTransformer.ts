const KEY_VALUE_OBJECT = { type: 'object' }

interface Propperties {
    attributes: {
        type: string
    }
}

interface InputSchema {
    components: {
        schemas: {
            ConfigurationItemUi: {
                properties: Propperties
            }
        }
    }
}

const retypeAttributesArrayToObject = (attributesParent: Propperties) => {
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
