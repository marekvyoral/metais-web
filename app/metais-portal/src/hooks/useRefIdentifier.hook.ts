import { IOption } from '@isdd/idsk-ui-kit/index'
import { useReadCiList1, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TYP_DATOVEHO_PRVKU } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useRefIdentifierHook = (type?: string) => {
    const {
        state: { user },
    } = useAuth()
    const {
        i18n: { language },
    } = useTranslation()

    const [isCheckUriLoading, setCheckUriLoading] = useState<boolean>(false)

    const getCiList = useReadCiList1Hook()

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

    const {
        data: dataItemTypeState,
        isLoading: isDataItemTypeStatesLoading,
        isError: isDataItemTypeStatesError,
    } = useGetValidEnum(TYP_DATOVEHO_PRVKU)

    const {
        data: templateUriData,
        isLoading: isTemplateUriDataLoading,
        isError: isTemplateUriDataError,
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
                    {
                        name: ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku,
                        filterValue: [{ value: 'c_typ_dp.1', equality: OPERATOR_OPTIONS.EQUAL }],
                    },
                ],
                searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov],
                type: [RefIdentifierTypeEnum.DatovyPrvok],
            },
        },
        { query: {} },
    )

    const checkUriIfExist = async (attribute: string, uri?: string) => {
        setCheckUriLoading(true)
        try {
            const result = await getCiList({
                filter: {
                    type: [type ?? ''],
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
                        {
                            name: attribute,
                            filterValue: [{ value: uri, equality: OPERATOR_OPTIONS.EQUAL }],
                        },
                    ],
                },
            })
            setCheckUriLoading(false)
            return result.configurationItemSet?.length ? result.configurationItemSet?.length > 0 : false
        } catch {
            setCheckUriLoading(false)
            return false
        }
    }

    const templateUriOptions =
        templateUriData?.configurationItemSet?.map((item) => ({
            value: item.uuid ?? '',
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        })) ?? []

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

    const dataItemTypeOptions =
        dataItemTypeState?.enumItems?.map((item) => ({
            value: item.code ?? '',
            label: (language === Languages.ENGLISH ? item.engDescription : item.description) ?? '',
        })) ?? []

    const attributesArrays = attributeProfiles?.map((item) => item.attributes || []) || []

    const attributeList = attributes?.concat(...attributesArrays)

    const isLoading = [
        isAttributesLoading,
        isGeneratedIdLoading,
        isReadCiListLoading,
        isDatasetLoading,
        isTemplateUriDataLoading,
        isDataItemTypeStatesLoading,
    ].some((item) => item)
    const isError = [
        isAttributesError,
        isGeneratedIdError,
        isReadCiListError,
        isDatasetError,
        isTemplateUriDataError,
        isDataItemTypeStatesError,
    ].some((item) => item)

    return {
        isCheckUriLoading,
        checkUriIfExist,
        groupDataFiltered,
        ciTypeData,
        generatedEntityId,
        attributes: attributeList,
        ownerOptions,
        datasetOptions,
        templateUriOptions,
        dataItemTypeOptions,
        isError,
        isLoading,
    }
}
