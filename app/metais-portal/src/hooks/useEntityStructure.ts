import { useHowToDisplayConstraints } from './useHowToDisplay'

import { AttributeConstraintEnumAllOf, useGetCiTypeUsingGET } from '@/api'

export const useEntityStructure = (entityName: string) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(entityName)

    const constraintsAttributes =
        ciTypeData?.attributes
            ?.map((attribute) =>
                attribute?.constraints
                    ?.filter((item) => item.type === 'enum')
                    .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
            )
            .flat() ?? []

    const constraintsAttributesProfiles =
        ciTypeData?.attributeProfiles
            ?.map((profile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints
                        ?.filter((item) => item.type === 'enum')
                        .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    // const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnumUsingGET(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isCiTypeDataLoading, isConstraintLoading].some((item) => item) //isUnitsLoading,
    const isError = [isCiTypeDataError, isConstraintError].some((item) => item) //isUnitsError,

    return {
        isLoading,
        isError,
        ciTypeData,
        constraintsData,
        unitsData: undefined,
    }
}
