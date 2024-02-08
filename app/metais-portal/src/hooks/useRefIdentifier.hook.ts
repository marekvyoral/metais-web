import { IOption } from '@isdd/idsk-ui-kit/index'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/index'

export const useRefIdentifierHook = (type?: string) => {
    const {
        state: { user },
    } = useAuth()

    const { ciTypeData, attributeProfiles, attributes, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(type)

    const {
        data: generatedEntityId,
        isLoading: isGeneratedIdLoading,
        isError: isGeneratedIdError,
    } = useGenerateCodeAndURL(type ?? '', { query: { refetchOnMount: false, cacheTime: 0, enabled: !!type } })

    const groupDataFiltered = user?.groupData.filter((item) => item.roles.some((role) => role.roleName === 'REFID_URI_DEF')) || []

    const groupDataUuids = groupDataFiltered.map((item) => item.orgId)

    const {
        data: ciDataByUuids,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
    } = useReadCiList1(
        {
            filter: {
                metaAttributes: {
                    state: ['DRAFT'],
                },
                uuid: groupDataUuids,
            },
        },
        { query: { enabled: groupDataUuids?.length > 0 } },
    )

    const {
        data: datasetData,
        isLoading: isDatasetLoading,
        isError: isDatasetError,
    } = useReadCiList1(
        {
            filter: {
                metaAttributes: {
                    state: ['DRAFT'],
                },
                attributes: [
                    {
                        name: ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie,
                        filterValue: [
                            { value: 'c_stav_registracie.1', equality: OPERATOR_OPTIONS.EQUAL },
                            { value: 'c_stav_registracie.2', equality: OPERATOR_OPTIONS.EQUAL },
                            { value: 'c_stav_registracie.4', equality: OPERATOR_OPTIONS.EQUAL },
                        ],
                    },
                ],
                searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov],
                type: [RefIdentifierTypeEnum.URIDataset],
            },
        },
        { query: { enabled: groupDataUuids?.length > 0 } },
    )

    const ownerOptions: IOption<string>[] =
        ciDataByUuids?.configurationItemSet?.map((item) => ({
            value: item.uuid ?? '',
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        })) ?? []

    const datasetOptions =
        datasetData?.configurationItemSet?.map((item) => ({
            value: item.uuid ?? '',
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        })) ?? []

    const attributesArrays = attributeProfiles?.map((item) => item.attributes || []) || []

    const attributeList = attributes?.concat(...attributesArrays)

    const isLoading = [isAttributesLoading, isGeneratedIdLoading, isReadCiListLoading, isDatasetLoading].some((item) => item)
    const isError = [isAttributesError, isGeneratedIdError, isReadCiListError, isDatasetError].some((item) => item)

    return {
        groupDataFiltered,
        ciTypeData,
        generatedEntityId,
        attributes: attributeList,
        ownerOptions,
        datasetOptions,
        isError,
        isLoading,
    }
}
