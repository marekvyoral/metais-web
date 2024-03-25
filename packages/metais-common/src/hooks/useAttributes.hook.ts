import { useTranslation } from 'react-i18next'

import { useDetailData } from './useDetailData'
import { useGetCiTypeWrapper } from './useCiType.hook'

import { transformColumnsMap, transformNameColumnsMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

export const useAttributesHook = (entityName?: string, onlyValidProfiles = true) => {
    const { i18n } = useTranslation()
    const {
        data: ciTypeData,
        isFetching: isCiTypeDataFetching,
        isError: isCiTypeDataError,
    } = useGetCiTypeWrapper(entityName ?? '', { query: { queryKey: [i18n.language, entityName], enabled: !!entityName } }, onlyValidProfiles)

    const { isLoading, isError, constraintsData, unitsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataFetching,
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
        isLoading: isLoading || isCiTypeDataFetching,
        isError: isError || isCiTypeDataError,
    }
}
