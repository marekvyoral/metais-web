import { PO, PO_IS, PO_IS_PO, PO_PO } from '@isdd/metais-common/constants'

export const shouldEntityNameBePO = (entityName: string): string => {
    switch (entityName) {
        case PO_IS:
            return PO
        case PO_IS_PO:
            return PO
        case PO_PO:
            return PO
    }
    return entityName
}
