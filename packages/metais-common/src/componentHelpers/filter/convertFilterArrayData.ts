import { FieldValues } from 'react-hook-form'

import { JOIN_OPERATOR, OPERATOR_SEPARATOR } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export const convertFilterArrayData = <T extends FieldValues & IFilterParams>(filterData: T): T => {
    const filterAttributeKeys = Object.keys(filterData).filter((item) => item.includes(OPERATOR_SEPARATOR))

    const convertedValues = filterAttributeKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: Array.isArray(filterData[key]) ? filterData[key].join(JOIN_OPERATOR) : filterData[key],
        }),
        {},
    )

    return { ...filterData, ...convertedValues }
}