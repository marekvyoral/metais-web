import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { ConfigurationItemSetUi, useReadCiList1, useReadCiNeighbours } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { STAV_REGISTRACIE } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, OPERATOR_OPTIONS, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { formatDateToIso } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { Attribute, AttributeProfile, CiCode, CiType, useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IOption } from '@isdd/idsk-ui-kit/index'

import { RefIdentifierListShowEnum } from '@/components/views/ref-identifiers/refIdentifierListProps'
import { RefIdentifierCreateView } from '@/components/views/ref-identifiers/RefIdentifierCreateView'
import { PublicAuthorityState, usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

export interface RefIdentifierListFilterData extends IFilterParams, IFilter {
    type: RefIdentifierTypeEnum[]
    state: string
    createdAtFrom: string
    createdAtTo: string
    view: RefIdentifierListShowEnum
}

export interface RefIdentifierCreateContainerViewProps {
    publicAuthorityState: PublicAuthorityState
    attributes: Attribute[] | undefined
    type: RefIdentifierTypeEnum
    setType: (type: RefIdentifierTypeEnum) => void
    constraintsData: (EnumType | undefined)[]
    ciTypeData: CiType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    generatedEntityId: CiCode | undefined
    unitsData: EnumType | undefined
    ownerOptions: IOption<string>[] | undefined
    datasetOptions: IOption<string>[] | undefined
    isLoading: boolean
    isError: boolean
}

// interface RefIdentifiersContainerProps {
// View: React.FC<RefIdentifiersContainerViewProps>
// }

const refIdentifierTypes = [
    RefIdentifierTypeEnum.URIKatalog,
    RefIdentifierTypeEnum.DatovyPrvok,
    RefIdentifierTypeEnum.URIDataset,
    RefIdentifierTypeEnum.Individuum,
]

const defaultFilter: RefIdentifierListFilterData = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    type: [] as RefIdentifierTypeEnum[],
    state: '',
    createdAtFrom: '',
    createdAtTo: '',
    view: RefIdentifierListShowEnum.ALL,
}

export const RefIdentifierCreateContainer: React.FC = () => {
    const {
        state: { user },
    } = useAuth()

    const isLoggedIn = !!user

    const { filter, handleFilterChange } = useFilterParams<RefIdentifierListFilterData>(defaultFilter)
    const [type, setType] = useState<RefIdentifierTypeEnum>(RefIdentifierTypeEnum.DatovyPrvok)

    const {
        ciTypeData,
        constraintsData,
        attributeProfiles,
        attributes,
        isError: isAttributesError,
        isLoading: isAttributesLoading,
        unitsData,
    } = useAttributesHook(type)

    const { data: registrationState, isLoading: isDefaultStatesLoading } = useGetValidEnum(STAV_REGISTRACIE)
    const {
        data: generatedEntityId,
        isLoading: generatedIdLoading,
        isError: generatedIdError,
        fetchStatus,
    } = useGenerateCodeAndURL(type, { query: { refetchOnMount: false, cacheTime: 0 } })

    const groupDataUuids =
        user?.groupData.filter((item) => item.roles.some((role) => role.roleName === 'REFID_URI_DEF')).map((item) => item.orgId) || []

    const {
        data: ciDataByUuids,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
        refetch,
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

    const datasetOptions: IOption<string>[] =
        datasetData?.configurationItemSet?.map((item) => ({
            value: item.uuid ?? '',
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        })) ?? []

    console.log('ownerOptions', ownerOptions)

    const {
        groupData,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
        publicAuthorityState,
        roleState,
    } = usePublicAuthorityAndRoleHook()

    const attributesArrays = attributeProfiles?.map((item) => item.attributes || []) || []

    const attributeList = attributes?.concat(...attributesArrays)

    const isLoading = [isDefaultStatesLoading].some((item) => item)
    const isError = [].some((item) => item)

    return (
        <RefIdentifierCreateView
            generatedEntityId={generatedEntityId}
            attributeProfiles={attributeProfiles}
            publicAuthorityState={publicAuthorityState}
            constraintsData={constraintsData}
            ciTypeData={ciTypeData}
            unitsData={unitsData}
            attributes={attributeList}
            ownerOptions={ownerOptions}
            datasetOptions={datasetOptions}
            type={type}
            setType={setType}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
