import { useTranslation } from 'react-i18next'

import { useGetCiTypeWrapper } from './useCiType.hook'
import { useDetailData } from './useDetailData'

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
        onlyValidAttributes: true,
    })

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes

    return {
        attributeProfiles,
        attributes,
        ciTypeData,
        constraintsData,
        unitsData,
        isLoading: isLoading || isCiTypeDataFetching,
        isError: isError || isCiTypeDataError,
    }
}
