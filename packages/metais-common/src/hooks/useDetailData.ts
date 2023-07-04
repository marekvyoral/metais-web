import { CiType } from '../api'
import { calculateConstraintFromAttributes, calculateConstraintFromAttributeProfiles } from '../componentHelpers/formatting/constraints'

import { useHowToDisplayConstraints } from './useHowToDisplay'

interface IDetailData {
    entityStructure: CiType | undefined
    isEntityStructureLoading: boolean
    isEntityStructureError: boolean
}

export const useDetailData = ({ entityStructure, isEntityStructureLoading, isEntityStructureError }: IDetailData) => {
    const constraintsAttributes = calculateConstraintFromAttributes(entityStructure?.attributes)

    const constraintsAttributesProfiles = calculateConstraintFromAttributeProfiles(entityStructure?.attributeProfiles ?? [])

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    // const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnumUsingGET(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityStructureLoading, isConstraintLoading].some((item) => item) //isUnitsLoading,
    const isError = [isEntityStructureError, isConstraintError].some((item) => item) //isUnitsError,
    return {
        isLoading,
        isError,
        constraintsData,
    }
}
