import { useQuery } from '@tanstack/react-query'

import { useHowToDisplayUnits } from './useHowToDisplayUnits'
import { useHowToDisplayConstraints } from './useHowToDisplayConstraints'

import { getEntityCiAttributesToDisplay, getEntityCiData } from '@/api/EntityCiApi'

export const useEntityCiData = (entityName: string, entityId: string) => {
    const {
        isLoading: isEntityCiDataLoading,
        isError: isEntityCiDataError,
        data: entityCiData,
    } = useQuery({
        queryKey: ['entityCiData', entityName],
        queryFn: () => getEntityCiData(entityName),
    })

    const {
        isLoading: isEntityCiAttributesLoading,
        isError: isEntityCiAttributesError,
        data: entityCiAttributes,
    } = useQuery({
        queryKey: ['entityCiAttributesData', entityId],
        queryFn: () => getEntityCiAttributesToDisplay(entityId),
    })

    const units = entityCiData?.attributes.some((attribute) => attribute.units !== null)
    const constraints =
        entityCiData?.attributes
            .map((attribute) => attribute.constraints.filter((item) => item.type === 'enum').map((constraint) => constraint.enumCode))
            .flat() ?? []

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useHowToDisplayUnits(units)

    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityCiAttributesLoading, isEntityCiDataLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isEntityCiDataError, isEntityCiAttributesError, isUnitsError, isConstraintError].some((item) => item)

    return {
        isLoading,
        isError,
        entityCiData,
        entityCiAttributes,
        unitsData,
        constraintsData,
    }
}
