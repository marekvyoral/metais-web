import { calculateConstraintFromAttributeProfiles, calculateConstraintFromAttributes } from '../componentHelpers/formatting/constraints'

import { MEASURE_UNIT } from './common/constants'
import { useHowToDisplayConstraints } from './useHowToDisplay'

import { CiType, useGetEnum } from '@isdd/metais-common/api'
interface IDetailData {
    entityStructure: CiType | undefined
    isEntityStructureLoading: boolean
    isEntityStructureError: boolean
}

export const useDetailData = ({ entityStructure, isEntityStructureLoading, isEntityStructureError }: IDetailData) => {
    const constraintsAttributes = calculateConstraintFromAttributes(entityStructure?.attributes)

    const constraintsAttributesProfiles = calculateConstraintFromAttributeProfiles(entityStructure?.attributeProfiles ?? [])

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnum(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityStructureLoading, isConstraintLoading, isUnitsLoading].some((item) => item)
    const isError = [isEntityStructureError, isConstraintError, isUnitsError].some((item) => item)
    return {
        isLoading,
        isError,
        constraintsData,
        unitsData,
    }
}
