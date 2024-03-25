import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    calculateConstraintFromAttributeProfiles,
    calculateConstraintFromAttributes,
} from '@isdd/metais-common/componentHelpers/formatting/constraints'
import { MEASURE_UNIT } from '@isdd/metais-common/src/api/constants'
import { useHowToDisplayConstraints } from '@isdd/metais-common/src/hooks/useHowToDisplay'
interface IDetailData {
    entityStructure: CiType | undefined
    isEntityStructureLoading: boolean
    isEntityStructureError: boolean
}

export const useDetailData = ({ entityStructure, isEntityStructureLoading, isEntityStructureError }: IDetailData) => {
    const constraintsAttributes = calculateConstraintFromAttributes(entityStructure?.attributes)

    const constraintsAttributesProfiles = calculateConstraintFromAttributeProfiles(entityStructure?.attributeProfiles ?? [])

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    const { isFetching: isUnitsFetching, isError: isUnitsError, data: unitsData } = useGetEnum(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isEntityStructureLoading, isConstraintLoading, isUnitsFetching].some((item) => item)
    const isError = [isEntityStructureError, isConstraintError, isUnitsError].some((item) => item)
    return {
        isLoading,
        isError,
        constraintsData,
        unitsData,
    }
}
