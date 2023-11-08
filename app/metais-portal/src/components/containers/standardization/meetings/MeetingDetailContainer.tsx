import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { ApiMeetingRequest, useGetMeetingRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import { Group, useFind2111 } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useMemo } from 'react'

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
}

interface MeetingDetailContainer {
    View: React.FC<MeetingDetailViewProps>
    meetingId: number
}

const MeetingDetailContainer: React.FC<MeetingDetailContainer> = ({ View, meetingId }) => {
    const { userInfo: user } = useAuth()

    const { filter, handleFilterChange } = useFilterParams<FilterParams>(identitiesFilter)

    const { data: meetingDetailData, isLoading } = useGetMeetingRequestDetail(meetingId)
    const { data: groups } = useFind2111({})

    const group = useMemo(() => {
        const meetingGroups = (groups || []) as Group[]
        const meetingGroup = meetingGroups?.find((o) => meetingDetailData?.groups?.includes(o.uuid || ''))
        return meetingGroup
    }, [groups, meetingDetailData])

    return (
        <View
            isLoading={isLoading}
            filter={filter}
            handleFilterChange={handleFilterChange}
            user={user ?? null}
            meetingDetailData={meetingDetailData}
            meetingId={meetingId}
            group={group}
        />
    )
}

export default MeetingDetailContainer
