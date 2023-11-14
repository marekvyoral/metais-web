import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'

export const transformOperatorsToUrl = (operator: string) => {
    switch (operator) {
        case OPERATOR_OPTIONS_URL.EQUAL: {
            return OPERATOR_OPTIONS.EQUAL
        }
        case OPERATOR_OPTIONS_URL.EQUAL_OR_GREATER: {
            return OPERATOR_OPTIONS.EQUAL_OR_GREATER
        }
        case OPERATOR_OPTIONS_URL.EQUAL_OR_LOWER: {
            return OPERATOR_OPTIONS.EQUAL_OR_LOWER
        }
        case OPERATOR_OPTIONS_URL.FULLTEXT: {
            return OPERATOR_OPTIONS.FULLTEXT
        }
        case OPERATOR_OPTIONS_URL.GREATER: {
            return OPERATOR_OPTIONS.GREATER
        }
        case OPERATOR_OPTIONS_URL.LOWER: {
            return OPERATOR_OPTIONS.LOWER
        }
    }

    return operator
}

export const transformOperatorsFromUrl = (operator: string) => {
    switch (operator) {
        case OPERATOR_OPTIONS.EQUAL: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case OPERATOR_OPTIONS.EQUAL_OR_GREATER: {
            return OPERATOR_OPTIONS_URL.EQUAL_OR_GREATER
        }
        case OPERATOR_OPTIONS.EQUAL_OR_LOWER: {
            return OPERATOR_OPTIONS_URL.EQUAL_OR_LOWER
        }
        case OPERATOR_OPTIONS.FULLTEXT: {
            return OPERATOR_OPTIONS_URL.FULLTEXT
        }
        case OPERATOR_OPTIONS.GREATER: {
            return OPERATOR_OPTIONS_URL.GREATER
        }
        case OPERATOR_OPTIONS.LOWER: {
            return OPERATOR_OPTIONS_URL.LOWER
        }
    }

    return operator
}
