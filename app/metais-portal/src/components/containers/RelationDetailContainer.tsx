import {
    ApiError,
    ConfigurationItemUi,
    RelationshipUi,
    RoleParticipantUI,
    useGetRoleParticipant,
    useReadConfigurationItem,
    useReadRelationship,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { RelationshipType, useGetRelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import React from 'react'

export type RelationDetailProps = {
    data: {
        ownerData?: RoleParticipantUI
        relationshipData?: RelationshipUi
        relationTypeData?: RelationshipType
        ciSourceData?: ConfigurationItemUi
        ciTargetData?: ConfigurationItemUi
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType
    }
    isLoading: boolean
    isError: boolean

    refetchRelationship: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<RelationshipUi, ApiError>>
}

type Props = {
    View: React.FC<RelationDetailProps>
    relationshipId: string
}

export const RelationDetailContainer: React.FC<Props> = ({ relationshipId, View }) => {
    const {
        data: relationshipData,
        isLoading: isRelationshipLoading,
        isError: isRelationshipError,
        refetch: refetchRelationship,
    } = useReadRelationship(relationshipId ?? '')
    const {
        data: ciTargetData,
        isLoading: isCiTargetDataLoading,
        isError: isCiTargetDataError,
    } = useReadConfigurationItem(relationshipData?.endUuid ?? '', { query: { enabled: !!relationshipData?.endUuid } })
    const {
        data: ciSourceData,
        isLoading: isCiSourceDataLoading,
        isError: isCiSourceDataError,
        fetchStatus: ciSourceFetchStatus,
    } = useReadConfigurationItem(relationshipData?.startUuid ?? '', { query: { enabled: !!relationshipData?.startUuid } })

    const {
        data: relationTypeData,
        isLoading: isRelationTypeDataLoading,
        isError: isRelationTypeDataError,
        fetchStatus: relationTypeFetchStatus,
    } = useGetRelationshipType(relationshipData?.type ?? '', {
        query: { enabled: !!relationshipData?.uuid },
    })

    const {
        isLoading: isDetailDataLoading,
        isError: isDetailDataError,
        constraintsData,
        unitsData,
    } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const {
        data: ownerData,
        isLoading: isOwnerLoading,
        isError: isOwnerError,
    } = useGetRoleParticipant(relationshipData?.metaAttributes?.owner ?? '', { query: { enabled: !!relationshipData?.metaAttributes?.owner } })

    const isLoading =
        (isCiSourceDataLoading && ciSourceFetchStatus != 'idle') ||
        isCiTargetDataLoading ||
        (isRelationTypeDataLoading && relationTypeFetchStatus != 'idle') ||
        isRelationshipLoading ||
        isOwnerLoading ||
        isDetailDataLoading

    const isError = isCiSourceDataError || isCiTargetDataError || isRelationTypeDataError || isRelationshipError || isOwnerError || isDetailDataError

    return (
        <View
            data={{ ownerData, relationshipData, relationTypeData, ciSourceData, ciTargetData, constraintsData, unitsData }}
            isLoading={isLoading}
            isError={isError}
            refetchRelationship={refetchRelationship}
        />
    )
}
