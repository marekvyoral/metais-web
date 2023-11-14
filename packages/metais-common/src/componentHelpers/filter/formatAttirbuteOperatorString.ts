import { OPERATOR_SEPARATOR, OPERATOR_SEPARATOR_TYPE } from '@isdd/metais-common/constants'

export const formatAttributeOperatorString = (name: string, operator: string): `${string}${OPERATOR_SEPARATOR_TYPE}${string}` => {
    return `${name}${OPERATOR_SEPARATOR}${operator}`
}
