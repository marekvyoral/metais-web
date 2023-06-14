import { AttributeConstraintEnumAllOf, useGetCiTypeUsingGET } from '../api/generated/types-repo-swagger'

import { useHowToDisplayConstraints, useHowToDisplayUnits } from './useHowToDisplay'

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

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useHowToDisplayUnits()
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isCiTypeDataLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isCiTypeDataError, isUnitsError, isConstraintError].some((item) => item)

    return {
        isLoading,
        isError,
        ciTypeData,
        unitsData,
        constraintsData,
    }
}
