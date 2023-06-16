export * from './transformAttributesArrayToObject'

export const KEY_VALUE_OBJECT = { type: 'object' }

export interface Properties {
    attributes: {
        type: string
    }
}

export interface InputSchema {
    components: {
        schemas: {
            ConfigurationItemUi: {
                properties: Properties
            }
        }
    }
}
