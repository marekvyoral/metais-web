import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'

export const convertUrlArrayAttribute = (operator: OPERATOR_OPTIONS, value: string) => {
    const splitValue = value.split(JOIN_OPERATOR)
    const convertedValue = splitValue.map((item) => ({ operator, value: item }))
    return convertedValue
}
