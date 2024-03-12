import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { useIntegrationLink } from '@isdd/metais-common/src/hooks/useIntegrationLink'
import { useGetMeta1 } from '@isdd/metais-common/api/generated/dms-swagger'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { IntegrationLinkAccordion } from '@/components/views/prov-integration/integration-link/IntegrationLinkAccordion'

export const IntegrationLinkInformation = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)
    const { isError, isLoading, consumingProjectData, providingProjectData, lastModifiedByIdentityData, createdByIdentityData, dizProfileData } =
        useIntegrationLink({
            entityId: entityId ?? '',
            createdByLogin: ciItemData?.metaAttributes?.createdBy ?? '',
            lastModifiedByLogin: ciItemData?.metaAttributes?.lastModifiedBy ?? '',
        })
    const { data: dmsFileMetaData, isLoading: isDmsFileMetaDataLoading, isError: isDmsFileMetaDataError } = useGetMeta1(entityId ?? '')

    return (
        <>
            <IntegrationLinkAccordion
                data={{
                    ciItemData,
                    gestorData,
                    constraintsData,
                    ciTypeData,
                    unitsData,
                    consumingProjectData,
                    providingProjectData,
                    lastModifiedByIdentityData,
                    createdByIdentityData,
                    dizProfileData,
                    dmsFileMetaData,
                }}
                isError={[isCiItemError, isAttError, isError].some((item) => item)}
                isLoading={[isCiItemLoading, isAttLoading, isLoading, isDmsFileMetaDataLoading].some((item) => item)}
                isDmsFileError={isDmsFileMetaDataError}
            />
        </>
    )
}
