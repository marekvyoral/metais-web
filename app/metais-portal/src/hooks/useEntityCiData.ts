import { useQuery } from '@tanstack/react-query'

import { useHowToDisplayUnits } from './useHowToDisplayUnits'
import { useHowToDisplayConstraints } from './useHowToDisplayConstraints'

import { getEntityCiData } from '@/api/EntityCiApi'

export const useEntityCiData = (entityName: string) => {
    const {
        isLoading: isEntityCiDataLoading,
        isError: isEntityCiDataError,
        data: entityCiData,
    } = useQuery({
        queryKey: ['entityCiData', entityName],
        queryFn: () => getEntityCiData(entityName),
    })

    const units = entityCiData?.attributes.some((attribute) => attribute.units !== null)
    const constraintsAttributes =
        entityCiData?.attributes
            .map((attribute) => attribute.constraints.filter((item) => item.type === 'enum').map((constraint) => constraint.enumCode))
            .flat() ?? []

    const constraintsAttributesProfiles =
        entityCiData?.attributeProfiles
            .map((profile) =>
                profile.attributes.map((attribute) =>
                    attribute.constraints.filter((item) => item.type === 'enum').map((constraint) => constraint.enumCode),
                ),
            )
            .flat(2) ?? []

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useHowToDisplayUnits(units)

    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityCiDataLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isEntityCiDataError, isUnitsError, isConstraintError].some((item) => item)

    return {
        isLoading,
        isError,
        entityCiData,
        unitsData,
        constraintsData,
    }
}
