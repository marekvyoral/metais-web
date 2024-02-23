import { ATTRIBUTE_NAME, RELATION_TYPE, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useReadCiList1, useReadCiNeighbours, useReadRelationships } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { STAV_REGISTRACIE, TYP_DATOVEHO_PRVKU } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import React from 'react'

import { RefIdentifierDetailView } from '@/components/views/ref-identifiers/RefIdentifierDetailView'

export interface RefIdentifierDetailContainerViewProps {
    entityItemName: string
    ciItemData: ConfigurationItemUi | undefined
    attributes: Attribute[] | undefined
    registrationState: EnumType | undefined
    dataItemTypeState?: EnumType
    gestorName: string | undefined
    ciList: ConfigurationItemUi[] | undefined
    ciItemId: string
    isLoading: boolean
    isError: boolean
}

export interface RefIdentifierDetailInfoViewProps {
    ciList?: ConfigurationItemUi[]
    ciItemData: ConfigurationItemUi | undefined
    attributes: Attribute[] | undefined
    registrationState: EnumType | undefined
    dataItemTypeState?: EnumType
    gestorName?: string
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

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(id)
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

    const {
        isFetching: isPoListFetching,
        isError: isPoListError,
        data: poList,
    } = useReadCiNeighbours(
        id,
        {
            page: 1,
            perpage: 10000,
            neighboursFilter: {
                relType: [RELATION_TYPE.PO_je_gestor_URIKatalog, RELATION_TYPE.PO_je_gestor_DatovyPrvok],
                metaAttributes: {
                    state: ['DRAFT'],
                },
            },
        },
        { query: { cacheTime: 0 } },
    )

    const gestorName = poList?.toNodes?.neighbourPairs?.at(0)?.configurationItem?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]

    const datasetUuids =
        relationData?.endRelationshipSet
            ?.filter((item) => item.type === RELATION_TYPE.URIDataset_patri_URIKatalog)
            .map((item) => item.startUuid ?? '') ?? []
    const dataItemUuids =
        relationData?.startRelationshipSet
            ?.filter((item) => item.type === RELATION_TYPE.DatovyPrvok_sa_sklada_DatovyPrvok && item.metaAttributes?.state !== 'INVALIDATED')
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

    const attributesArrays = attributeProfiles?.map((item) => item.attributes || []) || []

    const attributeList = attributes?.concat(...attributesArrays)

    const isLoading = [
        isRegistrationStateLoading,
        isDataItemTypeStatesLoading,
        isCiItemLoading,
        isAttLoading,
        isPoListFetching,
        isRelationFetching,
        isCiListFetching,
    ].some((item) => item)

    const isError = [
        isRegistrationStateError,
        isDataItemTypeStatesError,
        isCiItemError,
        isAttError,
        isPoListError,
        isRelationError,
        isCiListError,
    ].some((item) => item)

    return (
        <>
            <RefIdentifierDetailView
                ciItemId={id}
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
