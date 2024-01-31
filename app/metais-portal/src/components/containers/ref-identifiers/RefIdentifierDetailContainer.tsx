import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useReadCiList1, useReadRelationships } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { STAV_REGISTRACIE, TYP_DATOVEHO_PRVKU } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import React from 'react'

import { getGestorName } from '@/components/views/codeLists/CodeListDetailUtils'
import { RefIdentifierDetailView } from '@/components/views/ref-identifiers/RefIdentifierDetailView'

export interface RefIdentifierDetailContainerViewProps {
    entityItemName: string
    ciItemData: ConfigurationItemUi | undefined
    attributes: Attribute[] | undefined
    registrationState: EnumType | undefined
    dataItemTypeState?: EnumType
    gestorName: string | undefined
    ciList: ConfigurationItemUi[] | undefined
    isLoading: boolean
    isError: boolean
}

export interface RefIdentifierDetailInfoViewProps {
    ciList?: ConfigurationItemUi[]
    ciItemData: ConfigurationItemUi | undefined
    attributes: Attribute[] | undefined
    registrationState: EnumType | undefined
    dataItemTypeState?: EnumType
    gestorName: string | undefined
}

interface RefIdentifierDetailContainerProps {
    id: string
}

export const RefIdentifierDetailContainer: React.FC<RefIdentifierDetailContainerProps> = ({ id }) => {
    const { data: registrationState, isLoading: isRegistrationStateLoading, isError: isRegistrationStateError } = useGetValidEnum(STAV_REGISTRACIE)
    const {
        data: dataItemTypeState,
        isLoading: isDataItemTypeStatesLoading,
        isError: isDataItemTypeStatesError,
    } = useGetValidEnum(TYP_DATOVEHO_PRVKU)

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(id)
    const { attributes, attributeProfiles, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(ciItemData?.type)

    const {
        data: relationData,
        isFetching: isRelationFetching,
        isError: isRelationError,
    } = useReadRelationships(id, undefined, {
        query: {
            enabled: ciItemData?.type === RefIdentifierTypeEnum.URIKatalog || ciItemData?.type === RefIdentifierTypeEnum.DatovyPrvok,
        },
    })

    const datasetUuids =
        relationData?.endRelationshipSet?.filter((item) => item.type === 'URIDataset_patri_URIKatalog').map((item) => item.endUuid ?? '') ?? []

    const dataItemUuids =
        relationData?.startRelationshipSet
            ?.filter((item) => item.type === 'DatovyPrvok_sa_sklada_DatovyPrvok' && item.metaAttributes?.state !== 'INVALIDATED')
            .map((item) => item.endUuid ?? '') ?? []

    const {
        data: ciList,
        isFetching: isCiListFetching,
        isError: isCiListError,
    } = useReadCiList1(
        {
            filter: {
                uuid: [...datasetUuids, ...dataItemUuids],
            },
        },
        {
            query: {
                enabled: datasetUuids.length > 0 || dataItemUuids.length > 0,
            },
        },
    )

    const gestorName = getGestorName(gestorData, ciItemData?.metaAttributes?.owner)

    const attributesArrays = attributeProfiles?.map((item) => item.attributes || []) || []

    const attributeList = attributes?.concat(...attributesArrays)

    const isLoading = [
        isRegistrationStateLoading,
        isDataItemTypeStatesLoading,
        isCiItemLoading,
        isAttLoading,
        isRelationFetching,
        isCiListFetching,
    ].some((item) => item)

    const isError = [isRegistrationStateError, isDataItemTypeStatesError, isCiItemError, isAttError, isRelationError, isCiListError].some(
        (item) => item,
    )

    return (
        <>
            <RefIdentifierDetailView
                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                ciItemData={ciItemData}
                ciList={ciList?.configurationItemSet}
                dataItemTypeState={dataItemTypeState}
                registrationState={registrationState}
                gestorName={gestorName}
                attributes={attributeList}
                isLoading={isLoading}
                isError={isError}
            />
        </>
    )
}
