import { useQuery } from '@tanstack/react-query'

import { useHowToDisplayUnits } from './useHowtToDisplayUnits'
import { useHowToDisplayConstraints } from './useHowToDisplayConstraints'

import { getEntityStructure } from '@/api/TableApi'

export const useEntityStructure = (entityName: string) => {
    const {
        isLoading: isEntityStructureLoading,
        isError: isEntityStructureError,
        data,
    } = useQuery({
        queryKey: ['entityStructure', entityName],
        queryFn: () => getEntityStructure(entityName),
    })

    const units = data?.attributes.some((attribute) => attribute.units !== null)
    const constraints =
        data?.attributes
            .map((attribute) => attribute.constraints.filter((item) => item.type === 'enum').map((constraint) => constraint.enumCode))
            .flat() ?? []

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useHowToDisplayUnits(units)

    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityStructureLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isEntityStructureError, isUnitsError, isConstraintError].some((item) => item)

    return {
        isLoading,
        isError,
        data,
        unitsData,
        constraintsData,
    }
}
