import { useDetailData } from './useDetailData'

import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { transformColumnsMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

export const useAttributesContainer = (entityName: string) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName)

    const { isLoading, isError, constraintsData, unitsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes
    const renamedAttributes =
        ciTypeData?.attributes?.map((attr) => ({
            ...attr,
            technicalName: transformColumnsMap.get(attr?.technicalName ?? '') ?? attr?.technicalName,
        })) ?? []

    return {
        attributeProfiles,
        attributes,
        ciTypeData,
        constraintsData,
        unitsData,
        renamedAttributes,
        isLoading: isLoading || isCiTypeDataLoading,
        isError: isError || isCiTypeDataError,
    }
}
