import { useTranslation } from 'react-i18next'

import { useDetailData } from './useDetailData'

import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { transformColumnsMap, transformNameColumnsMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

export const useAttributesHook = (entityName?: string) => {
    const { i18n } = useTranslation()
    const {
        data: ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
    } = useGetCiType(entityName ?? '', { query: { queryKey: [i18n.language, entityName], enabled: !!entityName } })

    const { isLoading, isError, constraintsData, unitsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes
    const renamedAttributes =
        ciTypeData?.attributes?.map((attr) => {
            return {
                ...attr,
                name: transformNameColumnsMap.get(attr?.technicalName ?? '') ?? attr?.name,
                technicalName: transformColumnsMap.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            }
        }) ?? []

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
