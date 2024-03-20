import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { ApiMeetingRequest, useGetMeetingRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import { Group, useFind2111 } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useMemo } from 'react'
import { GetMeta200, useGetMeta } from '@isdd/metais-common/api/generated/dms-swagger'

import { MeetingsDetailPermissionsWrapper } from '@/components/permissions/MeetingsDetailPermissionsWrapper'

export interface FilterParams extends IFilterParams, IFilter {
    memberUuid: string | undefined
    poUuid: string | undefined
    role: string | undefined
    identityState: string
}

export const defaultSort = [
    {
        orderBy: 'firstName_lastName',
        sortDirection: SortType.ASC,
    },
]

export const identitiesFilter: FilterParams = {
    memberUuid: undefined,
    poUuid: undefined,
    role: undefined,
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    identityState: 'ACTIVATED',
    sort: defaultSort,
}

export interface MeetingDetailViewProps {
    user: User | null
    meetingDetailData: ApiMeetingRequest | undefined
    handleFilterChange: (changedFilter: IFilter) => void
    filter: FilterParams
    isLoading: boolean
    meetingId: number
    group: Group | undefined
    refetch: () => void
    attachmentsMetaData?: GetMeta200
}

interface MeetingDetailContainer {
    View: React.FC<MeetingDetailViewProps>
    meetingId: number
}

const MeetingDetailContainer: React.FC<MeetingDetailContainer> = ({ View, meetingId }) => {
    const {
        state: { user },
    } = useAuth()

    const { filter, handleFilterChange } = useFilterParams<FilterParams>(identitiesFilter)

    const { data: meetingDetailData, isLoading, refetch, isFetching } = useGetMeetingRequestDetail(meetingId)
    const { data: attachmentsMetaData, isLoading: isMetaDataLoading } = useGetMeta(
        meetingDetailData?.meetingAttachments?.map((att) => att.attachmentId ?? '') ?? [],
        { query: { enabled: (meetingDetailData?.meetingAttachments?.length ?? 0) > 0 } },
    )

    const { data: groups } = useFind2111({})

    const group = useMemo(() => {
        const meetingGroups = (groups || []) as Group[]
        const meetingGroup = meetingGroups?.find((o) => meetingDetailData?.groups?.includes(o.uuid || ''))
        return meetingGroup
    }, [groups, meetingDetailData])

    return (
        <MeetingsDetailPermissionsWrapper meetingDetailData={meetingDetailData}>
            <View
                isLoading={isLoading || isFetching || isMetaDataLoading}
                filter={filter}
                handleFilterChange={handleFilterChange}
                user={user}
                meetingDetailData={meetingDetailData}
                meetingId={meetingId}
                group={group}
                refetch={() => refetch()}
                attachmentsMetaData={attachmentsMetaData}
            />
        </MeetingsDetailPermissionsWrapper>
    )
}

export default MeetingDetailContainer
