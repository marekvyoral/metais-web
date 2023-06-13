const setObjectPropertyByPath = (object, path, value) => {
    const parts = path.split('.')
    const limit = parts.length - 1
    parts
    for (let i = 0; i < limit; ++i) {
        const key = parts[i]
        if (parts?.[i + 1] === '0') {
            value.map((nesttedValue, index) => {
                setObjectPropertyByPath(object[key][index], parts.slice(i + 2).join('.'), nesttedValue)
            })
            return
        }
        object = object[key] ?? (object[key] = {})
    }
    const key = parts[limit]
    object[key] = value
}

const TYPES_FOR_TRANSORM = ['ConfigurationItemUi.properties.attributes']
const KEY_VALUE_OBJECT = { type: 'object' }

/**
 * Transformer function for orval.
 *
 * @param {OpenAPIObject} inputSchema
 * @return {OpenAPIObject}
 */
// eslint-disable-next-line no-undef
module.exports = (inputSchema) => {
    const schemas = inputSchema.components.schemas
    TYPES_FOR_TRANSORM.map((path) => {
        setObjectPropertyByPath(schemas, path, KEY_VALUE_OBJECT)
    })
    return inputSchema
}
