import {
    ConfigurationItemUi,
    RelationshipUi,
    RoleParticipantUI,
    useGetRoleParticipant,
    useReadConfigurationItem,
    useReadRelationship,
} from '@isdd/metais-common/api'
import { RelationshipType, useGetRelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import React from 'react'

export type RelationDetailProps = {
    data: {
        ownerData?: RoleParticipantUI
        relationshipData?: RelationshipUi
        relationTypeData?: RelationshipType
        ciSourceData?: ConfigurationItemUi
        ciTargetData?: ConfigurationItemUi
    }
    isLoading: boolean
    isError: boolean
}

type Props = {
    View: React.FC<RelationDetailProps>
    relationshipId: string
    entityId: string
}

export const RelationDetailContainer: React.FC<Props> = ({ relationshipId, entityId, View }) => {
    const { data: relationshipData, isLoading: isRelationshipLoading, isError: isRelationshipError } = useReadRelationship(relationshipId ?? '')
    const { data: ciTargetData, isLoading: isCiTargetDataLoading, isError: isCiTargetDataError } = useReadConfigurationItem(entityId ?? '')
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
        data: ownerData,
        isLoading: isOwnerLoading,
        isError: isOwnerError,
    } = useGetRoleParticipant(relationshipData?.metaAttributes?.owner ?? '', { query: { enabled: !!relationshipData?.metaAttributes?.owner } })

    const isLoading =
        (isCiSourceDataLoading && ciSourceFetchStatus != 'idle') ||
        isCiTargetDataLoading ||
        (isRelationTypeDataLoading && relationTypeFetchStatus != 'idle') ||
        isRelationshipLoading ||
        isOwnerLoading
    const isError = isCiSourceDataError || isCiTargetDataError || isRelationTypeDataError || isRelationshipError || isOwnerError

    return <View data={{ ownerData, relationshipData, relationTypeData, ciSourceData, ciTargetData }} isLoading={isLoading} isError={isError} />
}
